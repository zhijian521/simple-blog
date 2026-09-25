import config, { absoluteUrl } from "../../site.config.mjs";
import { getPosts } from "./posts.js";

const escapeXml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

export function buildFeed() {
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

    // 用最新文章日期而不是构建时间，避免每次构建都变更导致缓存失效
    const lastBuildDate = latest ? new Date(`${latest}T00:00:00Z`).toUTCString() : new Date(0).toUTCString();

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "    <channel>",
        `        <title>${escapeXml(config.name)}</title>`,
        `        <link>${escapeXml(config.url)}</link>`,
        `        <description>${escapeXml(config.description)}</description>`,
        `        <language>${escapeXml(config.locale)}</language>`,
        `        <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
        `        <atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />`,
        items,
        "    </channel>",
        "</rss>",
        "",
    ].join("\n");
}

export function feedResponse() {
    return new Response(buildFeed(), {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
