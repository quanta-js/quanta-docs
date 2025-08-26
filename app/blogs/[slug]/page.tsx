import { Typography } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Author,
  getAllBlogStaticPaths,
  getBlogFrontmatter,
  getCompiledBlogForSlug,
} from "@/lib/markdown";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug } = params;
  const res = await getBlogFrontmatter(slug);
  if (!res) return {};
  const { title, description } = res;
  return {
    title: `${title} | QuantaJS Blog`,
    description,
    openGraph: {
      title: `${title} | QuantaJS Blog`,
      description,
      type: "article",
      siteName: "QuantaJS",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | QuantaJS Blog`,
      description,
    },
  };
}

export async function generateStaticParams() {
  const val = await getAllBlogStaticPaths();
  if (!val) return [];
  return val.map((it) => ({ slug: it }));
}

export default async function BlogPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const res = await getCompiledBlogForSlug(slug);
  if (!res) notFound();

  // Force client-side rendering for the persistence blog post to avoid SSR issues
  if (slug === 'persistence-in-real-world') {
    return (
      <div className="lg:w-[70%] sm:w-[95%] md:w-[80%] mx-auto">
        <Link
          className={buttonVariants({
            variant: "link",
            className: "!mx-0 !px-0 mb-7 !-ml-1 hover:text-primary transition-colors",
          })}
          href="/blogs"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to QuantaJS Blog
        </Link>
        <div className="flex flex-col gap-3 pb-7 w-full mb-2">
          <p className="text-muted-foreground text-sm">
            {formatDate(res.frontmatter.date)}
          </p>
          <h1 className="sm:text-3xl text-2xl font-extrabold">
            {res.frontmatter.title}
          </h1>
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Posted by</p>
            <Authors authors={res.frontmatter.authors} />
          </div>
        </div>
        <div className="!w-full">
          <div className="w-full mb-7">
            <Image
              src={res.frontmatter.cover}
              alt={`Cover image for ${res.frontmatter.title}`}
              width={700}
              height={400}
              className="w-full h-[400px] rounded-lg border object-cover shadow-sm"
            />
          </div>
          <div className="blog-prose">
            <Typography>{res.content}</Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[70%] sm:w-[95%] md:w-[80%] mx-auto">
      <Link
        className={buttonVariants({
          variant: "link",
          className: "!mx-0 !px-0 mb-7 !-ml-1 hover:text-primary transition-colors",
        })}
        href="/blogs"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back to QuantaJS Blog
      </Link>
      <div className="flex flex-col gap-3 pb-7 w-full mb-2">
        <p className="text-muted-foreground text-sm">
          {formatDate(res.frontmatter.date)}
        </p>
        <h1 className="sm:text-3xl text-2xl font-extrabold">
          {res.frontmatter.title}
        </h1>
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Posted by</p>
          <Authors authors={res.frontmatter.authors} />
        </div>
      </div>
      <div className="!w-full">
        <div className="w-full mb-7">
          <Image
            src={res.frontmatter.cover}
            alt={`Cover image for ${res.frontmatter.title}`}
            width={700}
            height={400}
            className="w-full h-[400px] rounded-lg border object-cover shadow-sm"
          />
        </div>
        <div className="blog-prose">
          <Typography>{res.content}</Typography>
        </div>
      </div>
    </div>
  );
}

function Authors({ authors }: { authors: Author[] }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      {authors.map((author) => {
        return (
          <Link
            href={author.handleUrl}
            className="flex items-center gap-2"
            key={author.username}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="text-sm font-medium">{author.username}</p>
              <p className="font-code text-[13px] text-muted-foreground">
                @{author.handle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}