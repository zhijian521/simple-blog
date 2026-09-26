import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { highlightCode } from "../src/lib/highlight.js";
import { getPosts } from "../src/lib/posts.js";

const POSTS_DIR = fileURLToPath(new URL("../../docs/blog/", import.meta.url));

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 浏览器解码字符引用是「单遍左到右扫描」：替换出来的 & 不会参与后续匹配。
// 所以这里必须用一次 replace 完成，链式多次 replace 会多解一层——
// 例如 &#x26;amp;lt; 浏览器看到的是 &amp;lt;，链式解码会错成 &lt;。
const NAMED_ENTITIES = { lt: "<", gt: ">", quot: '"', apos: "'", amp: "&" };

const decodeEntities = (text) =>
    text.replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, body) => {
        if (body.startsWith("#x") || body.startsWith("#X")) return String.fromCodePoint(parseInt(body.slice(2), 16));
        if (body.startsWith("#")) return String.fromCodePoint(Number(body.slice(1)));
        return NAMED_ENTITIES[body] ?? match;
    });

const textOf = (html) => decodeEntities(html.replace(/<[^>]+>/g, ""));

test("实体解码顺序：&amp; 必须最后替换，否则字面量会被还原成标签", () => {
    const cases = [
        'const a = "&amp;lt;";',
        "// 比较 a < b && c > d",
        'const t = "<script>alert(1)</script>";',
        "const q = '单引号 & 双引号\"';",
        "const re = /&lt;pre&gt;/g;",
    ];

    for (const source of cases) {
        const html = highlightCode(`<pre><code class="language-javascript">${escapeHtml(source)}</code></pre>`);
        assert.equal(textOf(html), source, `回环失败：${source}`);
    }
});

test("输出里只出现白名单标签", () => {
    const html = highlightCode(`<pre><code class="language-html">${escapeHtml("<div class='x'>text</div>")}</code></pre>`);
    const tags = [...html.matchAll(/<\/?([a-z0-9]+)/g)].map((m) => m[1]);
    for (const tag of tags) assert.ok(["pre", "code", "span"].includes(tag), `出现了预期外的标签：${tag}`);
});

test("所有代码块都可聚焦，且不会重复加 tabindex", () => {
    const highlighted = highlightCode(`<pre><code class="language-json">{"a":1}</code></pre>`);
    const plain = highlightCode('<pre><code class="language-txt">目录树</code></pre>');
    const bare = highlightCode("<pre><code>没有语言</code></pre>");

    for (const html of [highlighted, plain, bare]) {
        const pres = html.match(/<pre\b[^>]*>/g) ?? [];
        assert.equal(pres.length, 1);
        assert.match(pres[0], /tabindex="0"/, `未补上 tabindex：${pres[0]}`);
        assert.equal((html.match(/tabindex/g) ?? []).length, 1, "tabindex 被重复添加");
    }
});

test("未知语言保持纯文本，不做高亮也不报错", () => {
    const html = highlightCode('<pre><code class="language-txt">hello &lt;world&gt;</code></pre>');
    assert.doesNotMatch(html, /class="shiki/);
    assert.match(html, /tabindex="0"/);
});

test("语法错误不会让构建失败，文本也原样保留", () => {
    const html = highlightCode('<pre><code class="language-json">{ 不是合法 JSON }</code></pre>');
    // 注意要断言解码后的文本：Shiki 会把内容拆进多个 span，直接对整段 HTML 做子串匹配会假失败
    assert.equal(textOf(html), "{ 不是合法 JSON }");
});

test("真实语料：每个带语言的代码块内容逐字保真", () => {
    let checked = 0;
    for (const file of fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith(".md"))) {
        const markdown = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
        for (const match of markdown.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)) {
            const lang = match[1].trim().split(/\s+/)[0];
            if (!lang) continue;
            const source = match[2].replace(/\n$/, "");
            const html = highlightCode(`<pre><code class="language-${lang}">${escapeHtml(source)}</code></pre>`);
            assert.equal(textOf(html), source, `${file} 里的 ${lang} 代码块内容被改动`);
            checked += 1;
        }
    }
    assert.ok(checked >= 28, `真实语料应有 28 个以上带语言的代码块，实际 ${checked}`);
});

test("真实语料：颜色替换生效，且旧的低对比度颜色不再出现", () => {
    const html = getPosts()
        .map((post) => post.html)
        .join("\n");

    assert.doesNotMatch(html, /#6a737d|#22863a|#d73a49|#e36209/i, "仍在使用白底配色下的低对比度颜色");
    assert.match(html, /#57606a/i, "注释色未替换为达标值");
});
