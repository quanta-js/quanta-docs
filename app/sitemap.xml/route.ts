import { NextResponse } from 'next/server';
import { SitemapStream, streamToPromise } from 'sitemap';
import { readdirSync, statSync } from 'fs';
import path from 'path';

// Base URL for your site
const baseUrl = 'https://quantajs.com';

// Function to get all MDX slugs from contents/docs/
function getDocSlugs() {
  const docsDir = path.join(process.cwd(), 'contents', 'docs');
  const slugs: { url: string; changefreq: 'weekly'; priority: number; lastmod: string }[] = [];

  function traverseDir(currentPath: string, urlBase: string) {
    const items = readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);
      const relativePath = path.relative(docsDir, fullPath);

      if (item.isDirectory()) {
        // Recursively traverse subdirectories
        traverseDir(fullPath, `${urlBase}/${item.name}`);
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        const stats = statSync(fullPath);
        const slug = relativePath.replace(/index\.mdx$/, '');
        slugs.push({
          url: `/docs/${slug}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: stats.mtime.toISOString().split('T')[0], // File last modified date
        });
      }
    }
  }

  try {
    traverseDir(docsDir, '');
    return slugs;
  } catch (error) {
    console.error('Error reading docs directory:', error);
    return [];
  }
}

export async function GET() {
  // Static pages
  const staticPages = [
    {
      url: '/',
      changefreq: 'daily' as const,
      priority: 1.0,
      lastmod: '2025-03-10',
    },
    // Add other static pages (e.g., /about) here
  ];

  // Dynamic pages from contents/docs/
  const dynamicPages = getDocSlugs();

  // Combine all pages
  const allPages = [...staticPages, ...dynamicPages];

  // Generate sitemap with namespaces
  const sitemap = new SitemapStream({
    hostname: baseUrl
  });

  allPages.forEach((page) => sitemap.write(page));
  sitemap.end();

  const sitemapString = await streamToPromise(sitemap).then((data) => data.toString());

  return new NextResponse(sitemapString, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}

export const runtime = 'nodejs';