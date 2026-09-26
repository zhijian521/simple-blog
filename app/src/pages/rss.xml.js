// /rss.xml 端点：构建期读取全部已发布文章，生成 RSS 2.0。
// 不引 feed 库：字段少到手写更可控，也避免多一个依赖。

import config, { absoluteUrl } from "../../site.config.mjs";
import { getPosts } from "../lib/posts.js";

// & 必须最先替换，否则后面生成的 &lt; 会被二次转义成 &amp;lt;
const escapeXml = (value) =>
    String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function GET() {
    const posts = getPosts();
    const latest = posts[0]?.date;

    const items = posts
        .map((post) => {
            const url = absoluteUrl(post.url);
            const categories = post.tags.map((tag) => `            <category>${escapeXml(tag)}</category>`);

            return [
                "        <item>",
                `            <title>${escapeXml(post.title)}</title>`,
                `            <link>${escapeXml(url)}</link>`,
                `            <guid isPermaLink="true">${escapeXml(url)}</guid>`,
                `            <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
                post.description ? `            <description>${escapeXml(post.description)}</description>` : "",
                ...categories,
                "        </item>",
            ]
                .filter(Boolean)
                .join("\n");
        })
        .join("\n");

    // 用最新文章日期而不是构建时间，避免每次构建都变更导致缓存失效。
    // 一篇文章都没有时退回 1970-01-01，lastBuildDate 不允许为空。
    const lastBuildDate = latest ? new Date(`${latest}T00:00:00Z`).toUTCString() : new Date(0).toUTCString();

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "    <channel>",
        `        <title>${escapeXml(config.name)}</title>`,
        `        <link>${escapeXml(config.url)}/</link>`,
        `        <description>${escapeXml(config.description)}</description>`,
        `        <language>${escapeXml(config.locale)}</language>`,
        `        <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
        `        <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />`,
        items,
        "    </channel>",
        "</rss>",
        "",
    ].join("\n");

    return new Response(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
