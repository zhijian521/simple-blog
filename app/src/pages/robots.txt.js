// /robots.txt 端点：允许全站抓取，并声明 sitemap 地址
import config from "../../site.config.mjs";

export function GET() {
    // @astrojs/sitemap 生成的是 sitemap-index.xml（不是 sitemap.xml），写错爬虫会 404
    const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${config.url}/sitemap-index.xml`, ""].join("\n");

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
