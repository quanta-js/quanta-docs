import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Author,
  BlogMdxFrontmatter,
  getAllBlogsFrontmatter,
} from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuantaJS Blogs - Latest Updates and Insights",
  description: "Stay up to date with the latest QuantaJS developments, tutorials, and insights from the team. Learn about state management, React integration, Next.js integration, performance optimization, testing, and best practices.",
  keywords: [
    "QuantaJS",
    "blog",
    "tutorials",
    "state management",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "web development",
    "programming",
    "frontend development",
  ],
  alternates: {
    canonical: "https://quantajs.com/blogs",
  },
  openGraph: {
    title: "QuantaJS Blogs - Latest Updates and Insights",
    description: "Stay up to date with the latest QuantaJS developments, tutorials, and insights. Learn about state management, React integration, and best practices.",
    url: "https://quantajs.com/blogs",
    type: "website",
    siteName: "QuantaJS",
    images: [
      {
        url: "https://quantajs.com/img/quantajs_banner.png",
        width: 1200,
        height: 630,
        alt: "QuantaJS Blog - Latest Updates and Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantaJS Blogs - Latest Updates and Insights",
    description: "Stay up to date with the latest QuantaJS developments, tutorials, and insights.",
    images: ["https://quantajs.com/img/quantajs_banner.png"],
  },
};

export default async function BlogIndexPage() {
  const blogs = (await getAllBlogsFrontmatter()).sort(
    (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
  );
  return (
    <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="sm:text-3xl text-2xl font-extrabold">
          QuantaJS Blogs
        </h1>
        <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
          Latest updates, tutorials, and insights about QuantaJS state management. From package updates to integration guides and best practices.
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-5">
        {blogs.map((blog) => (
          <ThreeDBlogCard {...blog} slug={blog.slug} key={blog.slug} />
        ))}
      </div>
    </div>
  );
}

function AvatarGroup({ users, max = 4 }: { users: Author[]; max?: number }) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.username}
          className={`inline-block border-2 w-9 h-9 border-background ${index !== 0 ? "-ml-3" : ""
            } `}
        >
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="-ml-3 inline-block border-2 border-background hover:translate-y-1 transition-transform">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function ThreeDBlogCard({
  date,
  title,
  description,
  slug,
  cover,
  authors,
}: BlogMdxFrontmatter & { slug: string }) {
  return (
    <Link href={`/blogs/${slug}`} className="group">
      <CardContainer className="inter-var transform hover:-translate-y-1 hover:shadow-xl transition-all w-96 h-auto rounded-xl">
        <CardBody className="bg-gray-50 relative dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-6 border w-96 h-auto">
          {/* Title */}
          <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white sm:min-h-24">
            {title}
          </CardItem>
          {/* Cover Image */}
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={cover}
              alt={title}
              width={400}
              height={180}
              quality={80}
              className="w-full h-[180px] object-cover rounded-lg"
            />
          </CardItem>
          {/* Description */}
          <CardItem translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
            <p className="text-wrap h-20 truncate">{description}</p>
          </CardItem>
          {/* Footer: date and authors */}
          <div className="flex items-center justify-between w-full mt-6">
            <CardItem translateZ="30" as="span" className="text-[13px] text-muted-foreground">
              Published on {formatDate2(date)}
            </CardItem>
            <CardItem translateZ="30">
              <AvatarGroup users={authors} />
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  );
}
