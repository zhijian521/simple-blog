// 按站内实际用到的字符裁剪字体，生成自托管子集与 @font-face 规则。
//
// 两个字体族：
//   正文/标题 —— 霞鹜文楷（比例体），字符集 = docs/ 与 app/ 里的全部用字
//   代码/行内码 —— IBM Plex Mono（等宽，只有拉丁字形），字符集 = 代码里的非中日韩字符
//   代码里的中文由 --font-mono 的第二顺位「霞鹜文楷」接住，不需要额外的中文字体
//
// 为什么要裁剪：官方分片版是按字频切成 97 片/字族，一篇中文长文会命中 24～56 片
// （首访 1.2～2.7MB），字体替换时会明显闪一下。按内容裁成子集后正文约 253KB、
// 等宽约 30KB，且各自只有一个文件，可以整份 preload。
//
//   node scripts/build-font-subset.mjs          重新生成
//   node scripts/build-font-subset.mjs --check  只检查现有子集是否覆盖全部用字
//
// 首次生成会从网络下载完整字体（24MB / 136KB）到 app/.cache/fonts/，之后复用缓存。
// 受限网络下先设置 HTTPS_PROXY 与 NODE_USE_ENV_PROXY=1。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const FONTS = [
    {
        family: "LXGW WenKai",
        dir: "lxgw-wenkai",
        out: "lxgw-wenkai-site.woff2",
        file: "LXGWWenKai-Regular.ttf",
        version: "v1.522",
        url: "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf",
        charset: "site",
    },
    {
        family: "IBM Plex Mono",
        dir: "ibm-plex-mono",
        out: "ibm-plex-mono-site.woff2",
        file: "IBMPlexMono-Regular.ttf",
        version: "google/fonts@main",
        url: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf",
        license: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/ibmplexmono/OFL.txt",
        charset: "code",
    },
];

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootDir = path.resolve(appDir, "..");
const docsDir = path.join(rootDir, "docs");
const cacheDir = path.join(appDir, ".cache", "fonts");
const cssPath = path.join(appDir, "src", "styles", "fonts.css");

// 正文兜底字符：ASCII、常用标点、全角形式等；真正的用字从内容里扫出来。
const TEXT_BUFFER = [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x2000, 0x206f],
    [0x3000, 0x303f],
    [0xff00, 0xff5e],
];

// 等宽族的字符范围：Plex Mono 只覆盖拉丁与常用符号，中文交给文楷。
const MONO_RANGES = [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x2000, 0x206f],
    [0x2190, 0x21ff],
];

// 这些区段属于中日韩，等宽族不申请，交给文楷渲染
const CJK_RANGES = [
    [0x2e80, 0x2eff],
    [0x3000, 0x303f],
    [0x3040, 0x30ff],
    [0x3400, 0x4dbf],
    [0x4e00, 0x9fff],
    [0xf900, 0xfaff],
    [0xfe30, 0xfe4f],
    [0xff00, 0xffef],
    [0x20000, 0x3ffff],
];

const walk = (dir, exts, files = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, exts, files);
        else if (exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
    }
    return files;
};

const readSiteText = () => {
    const files = [
        ...walk(docsDir, [".md"]),
        ...walk(path.join(appDir, "src"), [".astro", ".js"]),
        path.join(appDir, "site.config.mjs"),
    ];
    return files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
};

// 等宽字体只用在代码块与行内代码上，按这些位置的真实字符裁剪即可。
const readCodeText = () => {
    const parts = [];
    for (const file of walk(docsDir, [".md"])) {
        const markdown = fs.readFileSync(file, "utf8");
        for (const block of markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) parts.push(block[1]);
        for (const span of markdown.matchAll(/`([^`\n]+)`/g)) parts.push(span[1]);
    }
    return parts.join("\n");
};

const addRanges = (set, ranges) => {
    for (const [from, to] of ranges) for (let code = from; code <= to; code++) set.add(code);
};

const inRanges = (code, ranges) => ranges.some(([from, to]) => code >= from && code <= to);

const charset = (kind) => {
    const points = new Set();

    if (kind === "site") {
        addRanges(points, TEXT_BUFFER);
        for (const char of readSiteText()) points.add(char.codePointAt(0));
        return points;
    }

    addRanges(points, MONO_RANGES);
    for (const char of readCodeText()) {
        const code = char.codePointAt(0);
        if (!inRanges(code, CJK_RANGES)) points.add(code);
    }
    return points;
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

const download = async (url, target) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`下载失败：${url} → HTTP ${response.status}（受限网络可设置 HTTPS_PROXY 与 NODE_USE_ENV_PROXY=1）`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buffer);
    return buffer;
};

const ensureFile = async (url, target, label) => {
    if (fs.existsSync(target)) return fs.readFileSync(target);
    process.stdout.write(`[fonts] 下载 ${label} ... `);
    const buffer = await download(url, target);
    console.log(`${(buffer.length / 1024).toFixed(0)} KB`);
    return buffer;
};

const parsedRanges = () => {
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

const sitePoints = charset("site");

if (process.argv.includes("--check")) {
    const covered = parsedRanges();
    const missing = [...sitePoints].filter((point) => !covered.some(([from, to]) => point >= from && point <= to));
    if (missing.length === 0) {
        console.log(`[fonts] 子集覆盖完整：${sitePoints.size} 个码点全部命中`);
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

const blocks = [];

for (const font of FONTS) {
    const points = font.charset === "site" ? sitePoints : charset("code");
    const ranges = toRanges(points);
    const ttf = await ensureFile(font.url, path.join(cacheDir, font.file), `${font.file}（${font.version}）`);
    const output = await subsetFont(ttf, String.fromCodePoint(...points), { targetFormat: "woff2" });

    const dir = path.join(appDir, "src", "assets", "fonts", font.dir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, font.out), output);
    fs.writeFileSync(path.join(dir, "VERSION"), `${font.version}\n`, "utf8");
    if (font.license) await ensureFile(font.license, path.join(dir, "OFL.txt"), `${font.dir}/OFL.txt`);

    blocks.push(
        [
            "@font-face {",
            `    font-family: "${font.family}";`,
            "    font-style: normal;",
            "    font-weight: 400;",
            "    font-display: swap;",
            `    src: url("../assets/fonts/${font.dir}/${font.out}") format("woff2");`,
            `    unicode-range: ${formatRanges(ranges)};`,
            "}",
        ].join("\n"),
    );

    console.log(`[fonts] ${font.out}: ${points.size} 个码点 / ${ranges.length} 段 unicode-range / ${(output.length / 1024).toFixed(0)} KB`);
}

fs.writeFileSync(
    cssPath,
    [
        "/* 由 scripts/build-font-subset.mjs 生成，请勿手改。 */",
        "/* 字符集来自 docs/ 与 app/ 的实际用字，重新生成：npm run fonts */",
        "",
        blocks.join("\n\n"),
        "",
    ].join("\n"),
    "utf8",
);

console.log("[fonts] fonts.css 已更新");
