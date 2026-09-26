// 按站内实际用到的字符裁剪字体，生成自托管子集与 @font-face 规则。
//
// 两个字体族：
//   正文/标题 —— 霞鹜文楷（比例体），字符集 = 已发布文章 + 会渲染的模板字面量 + CSS content
//   代码/行内码 —— IBM Plex Mono（等宽，只有拉丁字形），字符集 = 代码块与行内码里的非中日韩字符
//   代码里的中文由 --font-mono 的第二顺位「霞鹜文楷」接住，不需要额外的中文字体
//
// 为什么要裁剪：官方分片版是按字频切成 97 片/字族，一篇中文长文会命中 24–56 片
// （首访 1.2–2.7MB），字体替换时会明显闪一下。按内容裁成子集后正文约 253KB、
// 等宽约 15KB，且各自只有一个文件，可以整份 preload。
//
//   node scripts/build-font-subset.mjs                          重新生成
//   node scripts/build-font-subset.mjs --check                  检查覆盖，缺字退出码 1
//   node scripts/build-font-subset.mjs --check --allow-missing  缺字只警告，不拦构建
//
// 首次生成会从网络下载完整字体（24MB / 136KB）到 app/.cache/fonts/，之后复用缓存。
// 受限网络下先设置 HTTPS_PROXY 与 NODE_USE_ENV_PROXY=1。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";

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
// 内容目录跟着 site.config.mjs 走，避免配置改了这里还在扫 docs/。
// 注意：site.config.mjs 用 process.cwd() 定位内容目录，所以本脚本必须经 npm 脚本在 app/ 下运行。
const docsDir = path.resolve(appDir, config.contentDir);
const postsDir = path.join(docsDir, config.postsDir);
const stylesDir = path.join(appDir, "src", "styles");
const cacheDir = path.join(appDir, ".cache", "fonts");
const cssPath = path.join(stylesDir, "fonts.css");

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

// 源码注释不会渲染到页面上，却会把大量只出现在中文注释里的字带进子集：
// 既白涨体积，又会把真正缺字的告警淹掉，所以先剥掉注释再扫。
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(?<!:)\/\/[^\n]*/g, "");

// 只扫已发布的文章和会渲染出文字的源码；docs/ 下不发布的说明性文档不参与。
const readSiteText = () => {
    const files = [...walk(postsDir, [".md"]), ...walk(path.join(appDir, "src"), [".astro", ".js"]), path.join(appDir, "site.config.mjs")];
    return files.map((file) => stripComments(fs.readFileSync(file, "utf8"))).join("\n");
};

// CSS 里只有 content: "…" 的字符会出现在页面上（例如任务清单的 ☐ / ☑），
// 属性名和注释都不渲染，所以单独挑出 content 字符串，而不是扫整个 CSS。
const readCssContentText = () => {
    const parts = [];
    for (const file of walk(stylesDir, [".css"])) {
        for (const match of fs.readFileSync(file, "utf8").matchAll(/content:\s*"([^"]*)"/g)) parts.push(match[1]);
    }
    return parts;
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
        for (const char of readSiteText() + readCssContentText()) points.add(char.codePointAt(0));
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

// --check 靠反解自己生成的 fonts.css 判断覆盖范围，
// 所以那个文件里 unicode-range 的写法（U+ 前缀、大写、逗号分隔）不能被改动。
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
        const sample = missing
            .slice(0, 40)
            .map((point) => String.fromCodePoint(point))
            .join("");
        console.warn(
            `[fonts] 有 ${missing.length} 个新字符不在现有字体子集里，这些字会退回系统字体。\n` +
                `        例如：${sample}\n` +
                `        运行 npm run fonts 重新裁剪即可。`,
        );
    }

    // 缺字默认判失败：这道检查只有在能拦住回归时才有意义。
    // 确实要带着回退字形继续构建时，加 --allow-missing 降级为警告。
    process.exit(missing.length > 0 && !process.argv.includes("--allow-missing") ? 1 : 0);
}

// 只有真正要生成时才加载 subset-font。它是 devDependency，而 --check 必须在
// 只装了生产依赖的环境里也能跑，否则 npm ci --omit=dev 之后 prebuild 会直接崩。
const { default: subsetFont } = await import("subset-font");

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
    // 只有 IBM Plex Mono 配了 license 下载地址；文楷的 OFL.txt 是手工放进仓库的，
    // 不会被这个脚本刷新
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
