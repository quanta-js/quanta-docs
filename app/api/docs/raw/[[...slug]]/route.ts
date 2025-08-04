import { NextResponse } from "next/server";
import { getRawMdxForSlug } from "@/lib/markdown";

export async function GET(
    request: Request,
    { params }: { params: { slug: string[] } }
) {
    const paramSlug = (await params).slug;
    const slug = paramSlug ? paramSlug.join("/") : "";
    const rawMdx = await getRawMdxForSlug(slug);
    if (!rawMdx) {
        return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse(rawMdx, {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
