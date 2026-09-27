import { NextResponse } from 'next/server';
import { getAllBlogsFrontmatter } from '@/lib/markdown';
import { page_routes } from '@/lib/routes-config';

const baseUrl = 'https://quantajs.com';

export const dynamic = 'force-static';
export const runtime = 'nodejs';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      url: '/',
      changefreq: 'daily' as const,
      priority: 1.0,
      lastmod: today,
    },
    {
      url: '/blogs',
      changefreq: 'weekly' as const,
      priority: 0.8,
      lastmod: today,
    },
  ];

  // The sidebar is the canonical list of docs pages. Using it here avoids a
  // recursive process.cwd() filesystem walk that makes Next trace the project.
  const docPages = page_routes.map((page) => ({
    url: `/docs${page.href}`,
    changefreq: 'weekly' as const,
    priority: 0.7,
    lastmod: today,
  }));

  const blogs = await getAllBlogsFrontmatter();
  const blogPages = blogs.map((blog) => ({
    url: `/blogs/${blog.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.8,
    lastmod: blog.date || today,
  }));

  const allPages = [...staticPages, ...docPages, ...blogPages];

  let sitemapString = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapString += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of allPages) {
    let url = page.url.replace(/\\/g, '/');
    if (url.endsWith('/') && url !== '/') {
      url = url.slice(0, -1);
    }
    sitemapString += '  <url>\n';
    sitemapString += `    <loc>${baseUrl}${url}</loc>\n`;
    sitemapString += `    <lastmod>${page.lastmod}</lastmod>\n`;
    sitemapString += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemapString += `    <priority>${page.priority}</priority>\n`;
    sitemapString += '  </url>\n';
  }

  sitemapString += '</urlset>';

  return new NextResponse(sitemapString, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
