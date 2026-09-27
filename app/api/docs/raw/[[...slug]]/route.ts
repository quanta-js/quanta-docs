import { NextRequest, NextResponse } from "next/server";
import { getRawMdxForSlug } from "@/lib/markdown";
import { page_routes } from "@/lib/routes-config";

export const dynamic = "force-static";

export function generateStaticParams() {
  return page_routes.map(({ href }) => ({
    slug: href.split("/").filter(Boolean),
  }));
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug?: string[] }> }
) {
  const params = await context.params;
  const slug = params.slug?.join("/") || "";
  const rawMdx = await getRawMdxForSlug(slug);

  if (!rawMdx) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(rawMdx, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
