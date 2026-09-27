const localOrigin = process.env.LINK_CHECK_BASE_URL ?? "http://127.0.0.1:3000";
const publicOrigin = "https://quantajs.com";
const requestTimeoutMs = Number(process.env.LINK_CHECK_TIMEOUT_MS ?? 5000);
const externalConcurrency = 12;

const pageCache = new Map();

async function fetchText(url, timeoutMs = requestTimeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "quanta-docs-link-check/1.0" },
    });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(timer);
  }
}

function localUrl(url) {
  const parsed = new URL(url, publicOrigin);
  return new URL(parsed.pathname + parsed.search, localOrigin);
}

async function getLocalPage(url) {
  const key = localUrl(url).toString();
  if (!pageCache.has(key)) {
    pageCache.set(key, fetchText(key));
  }
  return pageCache.get(key);
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function extractLinks(html) {
  return [...html.matchAll(/\shref=["']([^"'<>]+)["']/gi)].map((match) => match[1]);
}

function extractIds(html) {
  return new Set(
    [...html.matchAll(/\sid=["']([^"'<>]+)["']/gi)].map((match) => match[1]),
  );
}

function sourceLabel(url) {
  const parsed = new URL(url, publicOrigin);
  return parsed.pathname + parsed.search || "/";
}

async function runPool(values, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (index < values.length) {
      const current = values[index++];
      await worker(current);
    }
  });
  await Promise.all(runners);
}

const sitemap = await fetchText(new URL("/sitemap.xml", localOrigin));
if (!sitemap.response.ok) {
  console.error(`Failed to load /sitemap.xml: HTTP ${sitemap.response.status}`);
  process.exit(1);
}

const pages = extractSitemapUrls(sitemap.text);
if (pages.length === 0) {
  console.error("Sitemap contains no pages.");
  process.exit(1);
}

const internalFailures = [];
const externalLinks = new Map();

for (const publicPage of pages) {
  let page;
  try {
    page = await getLocalPage(publicPage);
  } catch (error) {
    internalFailures.push(`${sourceLabel(publicPage)} -> page fetch failed: ${error}`);
    continue;
  }

  if (!page.response.ok) {
    internalFailures.push(
      `${sourceLabel(publicPage)} -> HTTP ${page.response.status} for the page itself`,
    );
    continue;
  }

  for (const href of extractLinks(page.text)) {
    if (
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:")
    ) {
      continue;
    }

    let target;
    try {
      target = new URL(href, new URL(publicPage, publicOrigin));
    } catch {
      internalFailures.push(`${sourceLabel(publicPage)} -> malformed href ${href}`);
      continue;
    }

    if (target.origin !== publicOrigin) {
      if (target.protocol === "http:" || target.protocol === "https:") {
        if (!externalLinks.has(target.toString())) {
          externalLinks.set(target.toString(), sourceLabel(publicPage));
        }
      }
      continue;
    }

    let targetPage;
    try {
      targetPage = await getLocalPage(target);
    } catch (error) {
      internalFailures.push(
        `${sourceLabel(publicPage)} -> ${target.pathname}: fetch failed (${error})`,
      );
      continue;
    }

    if (!targetPage.response.ok) {
      internalFailures.push(
        `${sourceLabel(publicPage)} -> ${target.pathname}: HTTP ${targetPage.response.status}`,
      );
      continue;
    }

    if (target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      if (id && !extractIds(targetPage.text).has(id)) {
        internalFailures.push(
          `${sourceLabel(publicPage)} -> ${target.pathname}${target.hash}: missing anchor`,
        );
      }
    }
  }
}

const externalWarnings = [];
const externalEntries = [...externalLinks.entries()];
await runPool(externalEntries, externalConcurrency, async ([url, source]) => {
  try {
    const { response } = await fetchText(url, Math.min(requestTimeoutMs, 4000));
    if (!response.ok) {
      externalWarnings.push(`${source} -> ${url}: HTTP ${response.status}`);
    }
  } catch (error) {
    externalWarnings.push(`${source} -> ${url}: ${error}`);
  }
});

console.log(
  `Checked ${pages.length} sitemap pages, ${pageCache.size} internal targets, and ${externalEntries.length} unique external URLs.`,
);

for (const warning of externalWarnings.sort()) {
  console.warn(`warning: external link: ${warning}`);
}

if (internalFailures.length > 0) {
  for (const failure of [...new Set(internalFailures)].sort()) {
    console.error(`error: internal link: ${failure}`);
  }
  process.exit(1);
}
