import { NextRequest, NextResponse } from "next/server";
import { getRawMdxForSlug } from "@/lib/markdown";

export async function GET(
  req: NextRequest,
  context: { params: { slug?: string[] } }
) {
  const slug = context.params.slug?.join("/") || "";
  const rawMdx = await getRawMdxForSlug(slug);

  if (!rawMdx) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(rawMdx, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
