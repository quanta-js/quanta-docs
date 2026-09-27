import { renderLlmsFull } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
    return new Response(await renderLlmsFull(), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
