import DocsBreadcrumb from "@/components/docs-breadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getDocsForSlug } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import { CopyButton } from "@/components/CopyButton";
import { Pencil } from "lucide-react";
import { StructuredData, generateArticleStructuredData } from "@/components/structured-data";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;
  const pathName = slug.join('/');
  const sourcePath = pathName ? `${pathName}/index.mdx` : "index.mdx";
  const editUrl = `https://github.com/quanta-js/quanta-docs/edit/master/contents/docs/${sourcePath}`;

  const res = await getDocsForSlug(pathName);
  if (!res) notFound();

  const url = `https://quantajs.com/docs/${pathName}`;
  const structuredData = generateArticleStructuredData(
    res.frontmatter.title,
    res.frontmatter.description || `Learn about ${res.frontmatter.title} in QuantaJS`,
    url
  );

  return (
    <>
      <StructuredData type="TechArticle" data={structuredData} />
      <div className="flex items-start gap-10">
        <div className="flex-[4.5] py-10">
          <div className="flex items-center justify-between mb-4">
            <DocsBreadcrumb paths={slug} />
            <CopyButton />
          </div>
          <Typography>
            {/* <h1 className="sm:text-3xl text-2xl !-mt-0.5">
              {res.frontmatter.title}
            </h1>
            <p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
              {res.frontmatter.description}
            </p> */}
            <div>{res.content}</div>
            <div className="mt-10 border-t pt-4">
              <a
                href={editUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit this page on GitHub
              </a>
            </div>
            <Pagination pathname={pathName} />
          </Typography>
        </div>
        <Toc path={pathName} />
      </div>
    </>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;

  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getDocsForSlug(pathName);
  if (!res) return {};
  const { frontmatter } = res;
  
  const title = `${frontmatter.title} | QuantaJS Documentation`;
  const description = frontmatter.description || `Learn about ${frontmatter.title} in QuantaJS - a modern state management library for JavaScript and TypeScript.`;
  const url = `https://quantajs.com/docs/${pathName}`;
  
  // Generate keywords based on title and path
  const keywords = [
    "QuantaJS",
    frontmatter.title,
    "state management",
    "javascript",
    "typescript",
    "documentation",
    "tutorial",
    "guide",
    ...pathName.split("/").filter(Boolean),
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "QuantaJS Documentation",
      images: [
        {
          url: "https://quantajs.com/img/quantajs_banner.png",
          width: 1200,
          height: 630,
          alt: `${frontmatter.title} - QuantaJS Documentation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://quantajs.com/img/quantajs_banner.png"],
    },
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}
