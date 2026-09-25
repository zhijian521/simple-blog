import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({ html: true, linkify: true });
const notesDir = path.resolve("..", "docs", "notes");

// 兼容两种 front matter 写法：
// 站点早期文章用 date / description，Obsidian 导出用 publishedAt / summary。
const toDateString = (value) => {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return String(value ?? "").slice(0, 10);
};

const toAssetUrl = (value) => {
    if (typeof value !== "string" || value.length === 0) {
        return undefined;
    }

    return value.startsWith("/") ? value : `/${value.replace(/^\.\//, "")}`;
};

// 导出内容里的图片是相对路径 images/xxx.webp，站点需要 /images/xxx.webp
// 同时把 Obsidian 的任务清单语法渲染成勾选框
const imagesDir = path.resolve("..", "docs", "images");

// 读取 webp 真实尺寸。带上 width/height 后浏览器会预先留出空间，
// 图片加载完成时不会把下方内容顶下去，滚动才不会有跳动感。
const readWebpSize = (buffer) => {
    if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
        return undefined;
    }

    const format = buffer.toString("ascii", 12, 16);

    if (format === "VP8 ") {
        return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }

    if (format === "VP8L") {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }

    if (format === "VP8X") {
        return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
    }

    return undefined;
};

const sizeCache = new Map();

const imageSize = (src) => {
    if (!src.startsWith("/images/")) {
        return undefined;
    }

    if (!sizeCache.has(src)) {
        let size;

        try {
            size = readWebpSize(fs.readFileSync(path.join(imagesDir, path.basename(src))));
        } catch {
            size = undefined;
        }

        sizeCache.set(src, size);
    }

    return sizeCache.get(src);
};

const withImageAttrs = (tag) => {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    const size = src ? imageSize(src) : undefined;
    const attrs = [];

    if (size) {
        attrs.push(`width="${size.width}"`, `height="${size.height}"`);
    }

    // 图片都在正文里，懒加载 + 异步解码可以避免滚动时占用主线程
    attrs.push('loading="lazy"', 'decoding="async"');

    return tag.replace(/\s*\/?>$/, ` ${attrs.join(" ")}>`);
};

const prepareHtml = (html) =>
    html
        .replace(/(\s(?:src|href)=")(?:\.\/)?images\//g, "$1/images/")
        .replace(/<li>\[ \] /g, '<li class="task">')
        .replace(/<li>\[[xX]\] /g, '<li class="task task--done">')
        .replace(/<img\b[^>]*>/g, withImageAttrs);

export function getNotes() {
    return fs
        .readdirSync(notesDir)
        .filter((filename) => filename.endsWith(".md"))
        .map((filename) => {
            const { data, content } = matter(fs.readFileSync(path.join(notesDir, filename), "utf8"));
            const slug = String(data.slug || path.basename(filename, ".md"));

            return {
                slug,
                url: `/notes/${slug}/`,
                title: String(data.title || slug),
                description: data.description || data.summary,
                date: toDateString(data.date ?? data.publishedAt),
                tags: data.tags || [],
                category: data.category,
                cover: toAssetUrl(data.coverImage),
                status: String(data.status || "published"),
                html: prepareHtml(markdown.render(content)),
            };
        })
        .filter((note) => note.status === "published")
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(date) {
    const parsed = new Date(`${date}T00:00:00Z`);

    if (Number.isNaN(parsed.getTime())) {
        return String(date);
    }

    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(parsed);
}
