/* eslint-disable @typescript-eslint/no-explicit-any */

interface StructuredDataProps {
  type: 'WebSite' | 'Article' | 'TechArticle' | 'BlogPosting' | 'SoftwareApplication';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Helper function to generate WebSite structured data
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QuantaJS',
    url: 'https://quantajs.com',
    description: 'A compact, scalable, and developer-friendly state management library for JavaScript and TypeScript',
    publisher: {
      '@type': 'Organization',
      name: 'QuantaJS',
      url: 'https://quantajs.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://quantajs.com/docs?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Helper function to generate Article structured data for docs
export function generateArticleStructuredData(
  title: string,
  description: string,
  url: string,
  datePublished?: string,
  dateModified?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'QuantaJS',
      url: 'https://quantajs.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'QuantaJS',
      url: 'https://quantajs.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quantajs.com/img/q_logo_dark.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Helper function to generate BlogPosting structured data
export function generateBlogPostingStructuredData(
  title: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified?: string,
  author?: { name: string; url?: string }[],
  image?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: author?.map(a => ({
      '@type': 'Person',
      name: a.name,
      url: a.url,
    })) || {
      '@type': 'Organization',
      name: 'QuantaJS',
    },
    publisher: {
      '@type': 'Organization',
      name: 'QuantaJS',
      url: 'https://quantajs.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quantajs.com/img/q_logo_dark.svg',
      },
    },
    image: image || 'https://quantajs.com/img/quantajs_banner.png',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Helper function to generate SoftwareApplication structured data
export function generateSoftwareApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QuantaJS',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: 'A compact, scalable, and developer-friendly state management library for JavaScript and TypeScript',
    url: 'https://quantajs.com',
    author: {
      '@type': 'Organization',
      name: 'QuantaJS',
      url: 'https://quantajs.com',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    softwareVersion: '2.0.0-beta',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  };
}

