// 按站内实际用到的字符裁剪霞鹜文楷，生成自托管字体子集与 @font-face 规则。
//
// 为什么要裁剪：官方的分片 webfont 是按字频切的 97 片/字族，一篇中文长文会命中
// 24～56 片（首访 1.2～2.7MB），字体替换那一瞬间就非常明显。按内容裁成子集后
// 正文族约 235KB、等宽族约 74KB，且各自只有一个文件，可以整份 preload。
//
//   node scripts/build-font-subset.mjs          重新生成
//   node scripts/build-font-subset.mjs --check  只检查现有子集是否覆盖全部用字
//
// 首次生成会从 GitHub 下载完整字体（约 25MB/个）到 app/.cache/fonts/，之后复用缓存。
// 需要能访问 GitHub；在受限网络下可以先设置 HTTPS_PROXY + NODE_USE_ENV_PROXY=1。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const FONT_VERSION = "v1.522";
const RELEASE = `https://github.com/lxgw/LxgwWenKai/releases/download/${FONT_VERSION}`;

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = path.resolve(appDir, "..");
const docsDir = path.join(rootDir, "docs");
const cacheDir = path.join(appDir, ".cache", "fonts");
const fontDir = path.join(appDir, "src", "assets", "fonts", "lxgw-wenkai");
const cssPath = path.join(appDir, "src", "styles", "fonts.css");

const REGULAR = { id: "regular", file: "LXGWWenKai-Regular.ttf", out: "lxgw-wenkai-site.woff2", family: "LXGW WenKai" };
const MONO = { id: "mono", file: "LXGWWenKaiMono-Regular.ttf", out: "lxgw-wenkai-mono-site.woff2", family: "LXGW WenKai Mono" };

// 兜底字符：ASCII、常用标点、全角形式等。真正的用字从内容里扫出来。
const BUFFER = [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x2000, 0x206f],
    [0x3000, 0x303f],
    [0xff00, 0xff5e],
];

const walk = (dir, exts, files = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, exts, files);
        else if (exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
    }
    return files;
};

const readText = () => {
    const files = [
        ...walk(docsDir, [".md"]),
        ...walk(path.join(appDir, "src"), [".astro", ".js"]),
        path.join(appDir, "site.config.mjs"),
    ];
    return files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
};

// 等宽字体只用在代码块和行内代码上，按这些位置的真实字符裁剪即可。
const readCodeText = () => {
    const parts = [];
    for (const file of walk(docsDir, [".md"])) {
        const markdown = fs.readFileSync(file, "utf8");
        for (const block of markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) parts.push(block[1]);
        for (const span of markdown.matchAll(/`([^`\n]+)`/g)) parts.push(span[1]);
    }
    return parts.join("\n");
};

const addRange = (set, [from, to]) => {
    for (let code = from; code <= to; code++) set.add(code);
};

const toRanges = (points) => {
    const sorted = [...points].sort((a, b) => a - b);
    const ranges = [];
    for (const point of sorted) {
        const last = ranges[ranges.length - 1];
        if (last && point === last[1] + 1) last[1] = point;
        else ranges.push([point, point]);
    }
    return ranges;
};

const hex = (code) => code.toString(16).toUpperCase().padStart(4, "0");
const formatRanges = (ranges) => ranges.map(([from, to]) => (from === to ? `U+${hex(from)}` : `U+${hex(from)}-${hex(to)}`)).join(", ");

const charset = (text) => {
    const points = new Set();
    for (const range of BUFFER) addRange(points, range);
    for (const char of text) points.add(char.codePointAt(0));
    return points;
};

const ensureTtf = async (font) => {
    const target = path.join(cacheDir, font.file);
    if (fs.existsSync(target)) return fs.readFileSync(target);
    const url = `${RELEASE}/${font.file}`;
    process.stdout.write(`[fonts] 下载 ${font.file} (${FONT_VERSION}) ... `);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`下载失败：${url} → HTTP ${response.status}（受限网络可设置 HTTPS_PROXY 与 NODE_USE_ENV_PROXY=1）`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(target, buffer);
    console.log(`${(buffer.length / 1048576).toFixed(1)} MB`);
    return buffer;
};

const parseExistingRanges = () => {
    if (!fs.existsSync(cssPath)) return [];
    const css = fs.readFileSync(cssPath, "utf8");
    const ranges = [];
    for (const match of css.matchAll(/unicode-range:\s*([^;}]+)/g)) {
        for (const part of match[1].split(",")) {
            const token = part.trim().replace(/^U\+/i, "");
            const [from, to] = token.split("-");
            const start = parseInt(from, 16);
            const end = to ? parseInt(to, 16) : start;
            if (Number.isFinite(start)) ranges.push([start, Number.isFinite(end) ? end : start]);
        }
    }
    return ranges;
};

const regularText = readText();
const regularPoints = charset(regularText);
// 等宽族只用在代码块与行内代码上，按这些位置的真实字符裁剪，能少下 200KB+ 的正文汉字
const monoPoints = charset(readCodeText());

if (process.argv.includes("--check")) {
    const covered = parseExistingRanges();
    const missing = [...regularPoints].filter((point) => !covered.some(([from, to]) => point >= from && point <= to));
    if (missing.length === 0) {
        console.log(`[fonts] 子集覆盖完整：${regularPoints.size} 个码点全部命中`);
    } else {
        const sample = missing.slice(0, 40).map((point) => String.fromCodePoint(point)).join("");
        console.warn(
            `[fonts] 有 ${missing.length} 个新字符不在现有字体子集里，这些字会退回系统字体。\n` +
                `        例如：${sample}\n` +
                `        运行 npm run fonts 重新裁剪即可。`,
        );
    }
    process.exit(0);
}

const report = [];
for (const [font, points] of [
    [REGULAR, regularPoints],
    [MONO, monoPoints],
]) {
    const ttf = await ensureTtf(font);
    const ranges = toRanges(points);
    const output = await subsetFont(ttf, String.fromCodePoint(...points), { targetFormat: "woff2" });
    fs.mkdirSync(fontDir, { recursive: true });
    fs.writeFileSync(path.join(fontDir, font.out), output);
    report.push({ font, ranges, size: output.length });
    console.log(`[fonts] ${font.out}: ${points.size} 个码点 / ${ranges.length} 段 unicode-range / ${(output.length / 1024).toFixed(0)} KB`);
}

const blocks = report.map(
    ({ font, ranges }) =>
        [
            "@font-face {",
            `    font-family: "${font.family}";`,
            "    font-style: normal;",
            "    font-weight: 400;",
            "    font-display: swap;",
            `    src: url("../assets/fonts/lxgw-wenkai/${font.out}") format("woff2");`,
            `    unicode-range: ${formatRanges(ranges)};`,
            "}",
        ].join("\n"),
);

fs.writeFileSync(
    cssPath,
    [
        `/* 由 scripts/build-font-subset.mjs 生成（霞鹜文楷 ${FONT_VERSION}），请勿手改。 */`,
        `/* 字符集来自 docs/ 与 app/ 的实际用字，重新生成：npm run fonts */`,
        "",
        blocks.join("\n\n"),
        "",
    ].join("\n"),
    "utf8",
);

fs.writeFileSync(path.join(fontDir, "VERSION"), `${FONT_VERSION}\n`, "utf8");
console.log(`[fonts] fonts.css 已更新（${report.reduce((sum, item) => sum + item.ranges.length, 0)} 段 unicode-range）`);
