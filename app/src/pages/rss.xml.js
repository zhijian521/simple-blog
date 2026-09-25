import config, { absoluteUrl } from "../../site.config.mjs";
import { getNotes } from "../lib/notes.js";

const escapeXml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

export function GET() {
    const notes = getNotes();
    const latest = notes[0]?.date;

    const items = notes
        .map((note) => {
            const url = absoluteUrl(note.url);

            return [
                "        <item>",
                `            <title>${escapeXml(note.title)}</title>`,
                `            <link>${escapeXml(url)}</link>`,
                `            <guid isPermaLink="true">${escapeXml(url)}</guid>`,
                `            <pubDate>${new Date(`${note.date}T00:00:00Z`).toUTCString()}</pubDate>`,
                note.description ? `            <description>${escapeXml(note.description)}</description>` : "",
                "        </item>",
            ]
                .filter(Boolean)
                .join("\n");
        })
        .join("\n");

    // 用最新文章日期而不是构建时间，避免每次构建都变更导致缓存失效
    const lastBuildDate = latest ? new Date(`${latest}T00:00:00Z`).toUTCString() : new Date(0).toUTCString();

    const body = [
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

    return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
