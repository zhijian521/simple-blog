import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { highlightCode } from "./highlight.js";
import config from "../../site.config.mjs";

const postsPath = path.join(config.docsDir, config.postsDir);
const imagesPath = path.join(config.docsDir, "images");
const postsBase = config.postsBase.replace(/\/+$/, "");

const markdown = new MarkdownIt({ html: true, linkify: true });

// 正文标题整体降级，保证页面里只有模板那一个 h1。
// 以正文出现的最小标题级别为基准，把它降到 h2，其余同级位移，
// 这样用 # 开头的文章和用 ## 开头的文章都会得到 h2 → h3 的连续层级。
markdown.core.ruler.push("normalize_heading_level", (state) => {
    const levels = state.tokens.filter((token) => token.type === "heading_open").map((token) => Number(token.tag.slice(1)));

    if (levels.length === 0) {
        return;
    }

    const shift = 2 - Math.min(...levels);

    if (shift === 0) {
        return;
    }

    for (const token of state.tokens) {
        if (token.type === "heading_open" || token.type === "heading_close") {
            const level = Number(token.tag.slice(1));
            token.tag = `h${Math.min(Math.max(level + shift, 1), 6)}`;
        }
    }
});

// front matter 的 date 统一写成 YYYY-MM-DD；
// js-yaml 会把它解析成 Date，这里再规整回字符串。
const toDateString = (value) => {
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }

    return String(value ?? "").slice(0, 10);
};

const toTagList = (value) => {
    if (Array.isArray(value)) {
        return value.map(String);
    }

    return value === undefined || value === null || value === "" ? [] : [String(value)];
};

const toAssetUrl = (value) => {
    if (typeof value !== "string" || value.length === 0) {
        return undefined;
    }

    if (/^https?:\/\//.test(value)) {
        return value;
    }

    return value.startsWith("/") ? value : `/${value.replace(/^\.\//, "")}`;
};

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
            // 允许 images/ 下的子目录，同时避免跳出 docs/images
            const file = path.resolve(config.docsDir, src.slice(1));
            size = file.startsWith(imagesPath) ? readWebpSize(fs.readFileSync(file)) : undefined;
        } catch {
            size = undefined;
        }

        sizeCache.set(src, size);
    }

    return sizeCache.get(src);
};

const withImageAttrs = (tag, index) => {
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    const size = src ? imageSize(src) : undefined;
    const attrs = [];

    if (size) {
        attrs.push(`width="${size.width}"`, `height="${size.height}"`);
    }

    // 正文首图往往是最大的内容块，让它优先加载；其余图片懒加载 + 异步解码
    if (index === 0) {
        attrs.push('loading="eager"', 'fetchpriority="high"', 'decoding="async"');
    } else {
        attrs.push('loading="lazy"', 'decoding="async"');
    }

    return tag.replace(/\s*\/?>$/, ` ${attrs.join(" ")}>`);
};

// 导出内容里的图片是相对路径 images/xxx.webp，站点需要 /images/xxx.webp
// 同时把 Obsidian 的任务清单语法渲染成勾选框
const prepareHtml = (html) => {
    let index = 0;

    return html
        .replace(/(\s(?:src|href)=")(?:\.\/)?images\//g, "$1/images/")
        .replace(/<li>\[ \] /g, '<li class="task">')
        .replace(/<li>\[[xX]\] /g, '<li class="task task--done">')
        .replace(/<img\b[^>]*>/g, (tag) => withImageAttrs(tag, index++));
};

const readPostFile = (filename) => {
    const source = fs.readFileSync(path.join(postsPath, filename), "utf8");

    try {
        return matter(source);
    } catch (error) {
        throw new Error(`${filename} 的 front matter 解析失败：${error.message}`);
    }
};

// 挡住“构建成功但产出错误 URL”的情况
const readSlug = (filename, data) => {
    const slug = String(data.slug || path.basename(filename, ".md"));

    if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
        throw new Error(`${filename} 的 slug 非法：${slug}`);
    }

    return slug;
};

const readDate = (filename, data) => {
    const date = toDateString(data.date);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`${filename} 缺少合法的日期（date，格式 YYYY-MM-DD），当前值：${date || "空"}`);
    }

    return date;
};

export function getPosts() {
    if (!fs.existsSync(postsPath)) {
        throw new Error(`找不到文章目录：${postsPath}`);
    }

    const posts = fs
        .readdirSync(postsPath)
        .filter((filename) => filename.endsWith(".md"))
        .map((filename) => {
            const { data, content } = readPostFile(filename);
            const slug = readSlug(filename, data);

            return {
                file: filename,
                slug,
                url: `${postsBase}/${slug}/`,
                title: String(data.title || slug),
                description: data.description,
                date: readDate(filename, data),
                tags: toTagList(data.tags),
                category: data.category,
                cover: toAssetUrl(data.coverImage),
                status: String(data.status || "published"),
                html: highlightCode(prepareHtml(markdown.render(content))),
            };
        })
        .filter((post) => post.status === "published");

    const seen = new Map();

    for (const post of posts) {
        const previous = seen.get(post.slug);

        if (previous) {
            throw new Error(`slug 重复：${post.slug}（${previous} 和 ${post.file}）`);
        }

        seen.set(post.slug, post.file);
    }

    return posts.sort((a, b) => b.date.localeCompare(a.date));
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
