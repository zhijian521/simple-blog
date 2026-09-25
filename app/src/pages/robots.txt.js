import config from "../../site.config.mjs";

export function GET() {
    const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${config.url}/sitemap-index.xml`, ""].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
