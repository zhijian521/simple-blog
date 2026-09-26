// 文章读取与渲染的唯一入口：扫 docs/blog/*.md，解析 front matter，用 markdown-it
// 渲染后用 Shiki 高亮代码块，并给图片补上真实宽高。
//
// 这里也是「构建成功但产出错误 URL」的唯一防线：日期格式、slug 合法性、slug 重复
// 都在这一步拦住，出错直接让构建失败，而不是生成一批坏链接。

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
// 三种容器各自读字节，不引图像库：
//   VP8  有损，26/28 字节起各 2 字节小端宽高，高 2 位是缩放系数，故 & 0x3fff
//   VP8L 无损，21 字节起 32 位小端：低 14 位宽、接着 14 位高，存的是「实际值 - 1」
//   VP8X 扩展，24/27 字节起各 3 字节小端，同样存「实际值 - 1」
const readWebpSize = (buffer) => {
    // 少于 30 字节连 VP8X 头都放不下，先挡掉，避免按固定偏移读出垃圾值
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

// png 的宽高固定在 IHDR 里（第 16/20 字节，大端），同样不需要图像库
const readPngSize = (buffer) => {
    if (buffer.length < 24 || buffer.readUInt32BE(0) !== 0x89504e47) {
        return undefined;
    }

    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

// 目前只有 webp 与 png 能直接读出尺寸；jpg 等其它格式一律返回 undefined，
// 调用方要自己写 width/height（README 的写作约定里也这么要求）
const readImageSize = (buffer) => (buffer.toString("ascii", 0, 4) === "RIFF" ? readWebpSize(buffer) : readPngSize(buffer));

const MIME_BY_EXTENSION = { png: "image/png", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg" };

// 给 og:image:type 用；认不出的扩展名就交给爬虫自己判断
const imageMime = (src) => MIME_BY_EXTENSION[path.extname(src).slice(1).toLowerCase()];

// 一次构建里 getPosts() 会被 astro.config、各页面的 getStaticPaths 反复调用，
// 缓存避免同一张图被同步读盘多次
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
            size = file.startsWith(imagesPath) ? readImageSize(fs.readFileSync(file)) : undefined;
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
//
// 三个 replace 的顺序不能调换：
//   1. 先改写 images/ 前缀，因为 imageSize() 只认 /images/ 开头的 src
//   2. 任务清单只匹配紧凑写法（<li>[ ] ），松散列表会被包成 <li><p>[ ]，
//      这种情况宁可不转换，也不误伤正文里的方括号
//   3. 最后才补 width/height，晚于第 1 步才拿得到尺寸
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

const readDate = (filename, data, field = "date") => {
    const date = toDateString(data[field]);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`${filename} 缺少合法的日期（${field}，格式 YYYY-MM-DD），当前值：${date || "空"}`);
    }

    return date;
};

// updated 是可选的修订日期，写了就用于结构化数据的 dateModified。
// 格式要求与 date 一致：写错同样拦住构建，而不是悄悄忽略。
const readUpdated = (filename, data) => {
    if (data.updated === undefined || data.updated === null || data.updated === "") {
        return undefined;
    }

    return readDate(filename, data, "updated");
};

/**
 * 读取全部已发布文章，按日期倒序返回。
 * 日期格式、slug 合法性、slug 重复校验失败时直接抛错，让构建失败。
 */
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
            const cover = toAssetUrl(data.coverImage);
            const coverSize = cover ? imageSize(cover) : undefined;

            return {
                file: filename,
                slug,
                url: `${postsBase}/${slug}/`,
                title: String(data.title || slug),
                description: data.description,
                date: readDate(filename, data),
                updated: readUpdated(filename, data),
                tags: toTagList(data.tags),
                category: data.category,
                cover,
                // 社交卡片要靠真实尺寸决定裁切，读不到就不输出，交给爬虫自己抓
                coverWidth: coverSize?.width,
                coverHeight: coverSize?.height,
                coverType: cover ? imageMime(cover) : undefined,
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

    // date 已规整成 YYYY-MM-DD，字符串倒序就是时间倒序，
    // 不用再建 Date 对象，也就不会引入时区偏移
    return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** 把 YYYY-MM-DD 格式化成「2026年6月28日」；无法解析时原样返回 */
export function formatDate(date) {
    const parsed = new Date(`${date}T00:00:00Z`);

    if (Number.isNaN(parsed.getTime())) {
        return String(date);
    }

    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        // date 按 UTC 零点解析，这里必须钉死 UTC，
        // 否则 UTC-x 时区的读者会看到前一天
        timeZone: "UTC",
    }).format(parsed);
}
