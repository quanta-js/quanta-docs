import { getDocFrontmatter, getRawMdxForSlug } from "@/lib/markdown";
import { page_routes, ROUTES } from "@/lib/routes-config";

const SITE_URL = "https://quantajs.com";

type LlmDocPage = {
    title: string;
    description: string;
    href: string;
    slug: string;
    section: string;
};

function sectionForHref(href: string): string {
    const section = ROUTES.find(
        (route) => href === route.href || href.startsWith(`${route.href}/`)
    );
    return section?.title ?? "Documentation";
}

export async function getLlmDocPages(): Promise<LlmDocPage[]> {
    const pages = await Promise.all(
        page_routes.map(async (route) => {
            const slug = route.href.replace(/^\//, "");
            const frontmatter = await getDocFrontmatter(slug);
            return {
                title: frontmatter?.title ?? route.title,
                description: frontmatter?.description ?? "",
                href: route.href,
                slug,
                section: sectionForHref(route.href),
            };
        })
    );

    return pages;
}

export async function renderLlmsIndex(): Promise<string> {
    const pages = await getLlmDocPages();
    const lines = [
        "# QuantaJS",
        "",
        "> Reactive state management for JavaScript and TypeScript applications.",
        "",
    ];

    for (const route of ROUTES) {
        const sectionPages = pages.filter((page) => page.section === route.title);
        if (sectionPages.length === 0) continue;

        lines.push(`## ${route.title}`, "");
        for (const page of sectionPages) {
            const markdownUrl = `${SITE_URL}/docs${page.href}.md`;
            const suffix = page.description ? `: ${page.description}` : "";
            lines.push(`- [${page.title}](${markdownUrl})${suffix}`);
        }
        lines.push("");
    }

    return lines.join("\n").trimEnd() + "\n";
}

export async function renderLlmsFull(): Promise<string> {
    const pages = await getLlmDocPages();
    const documents = await Promise.all(
        pages.map(async (page) => {
            const raw = await getRawMdxForSlug(page.slug);
            if (raw === null) {
                throw new Error(`Missing docs content for sidebar route: ${page.href}`);
            }
            return raw.trim();
        })
    );

    return documents.join("\n\n---\n\n") + "\n";
}
