import { NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { getAllBlogsFrontmatter } from '@/lib/markdown';

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
        let slug = relativePath.replace(/index\.mdx$/, '');
        // Convert Windows backslashes to forward slashes and remove trailing slashes
        slug = slug.replace(/\\/g, '/').replace(/\/+$/, '');
        const url = slug ? `/docs/${slug}` : '/docs';
        slugs.push({
          url: url,
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

// Function to get all blog slugs
async function getBlogSlugs() {
  try {
    const blogs = await getAllBlogsFrontmatter();
    const blogDir = path.join(process.cwd(), 'contents', 'blogs');
    
    return blogs.map((blog) => {
      const blogFile = path.join(blogDir, `${blog.slug}.mdx`);
      let lastmod = blog.date || new Date().toISOString().split('T')[0];
      
      try {
        const stats = statSync(blogFile);
        lastmod = stats.mtime.toISOString().split('T')[0];
      } catch {
        // Use date from frontmatter if file stats unavailable
      }
      
      return {
        url: `/blogs/${blog.slug}`,
        changefreq: 'monthly' as const,
        priority: 0.8,
        lastmod,
      };
    });
  } catch (error) {
    console.error('Error reading blogs directory:', error);
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
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      url: '/blogs',
      changefreq: 'weekly' as const,
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0],
    },
  ];

  // Dynamic pages from contents/docs/
  const dynamicPages = getDocSlugs();
  
  // Blog posts
  const blogPages = await getBlogSlugs();

  // Combine all pages
  const allPages = [...staticPages, ...dynamicPages, ...blogPages];

  // Generate sitemap manually to avoid trailing slashes
  let sitemapString = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapString += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allPages.forEach((page) => {
    // Ensure URL uses forward slashes and remove trailing slash (except for root)
    let url = page.url.replace(/\\/g, '/');
    if (url.endsWith('/') && url !== '/') {
      url = url.slice(0, -1);
    }
    sitemapString += `  <url>\n`;
    sitemapString += `    <loc>${baseUrl}${url}</loc>\n`;
    sitemapString += `    <lastmod>${page.lastmod}</lastmod>\n`;
    sitemapString += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemapString += `    <priority>${page.priority}</priority>\n`;
    sitemapString += `  </url>\n`;
  });
  
  sitemapString += '</urlset>';

  return new NextResponse(sitemapString, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}

export const runtime = 'nodejs';