// 代码块语法高亮。
//
// 用 Shiki（Astro 自带的渲染器）的同步核心 + JS 正则引擎：颜色在构建期就写进 HTML，
// 运行时零 JS、零外部请求，也不需要额外的客户端代码。
//
// 刻意不用主题自带的背景色：底色与字体仍由站点样式决定，所以这里用
// defaultColor: false，输出只带颜色变量（--shiki-light），
// 由 main.css 里的 .prose pre.shiki 规则把变量落到文字颜色上。

import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import html from "shiki/langs/html.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import typescript from "shiki/langs/typescript.mjs";
import githubLight from "shiki/themes/github-light.mjs";

const THEME = "github-light";

const highlighter = createHighlighterCoreSync({
    themes: [githubLight],
    langs: [bash, html, javascript, json, typescript],
    engine: createJavaScriptRegexEngine(),
});

const languages = new Set(highlighter.getLoadedLanguages());

// markdown-it 交给我们的代码是转义后的实体，Shiki 需要原始文本
const unescapeHtml = (text) =>
    text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

/**
 * 把正文里的 <pre><code class="language-xxx"> 替换成 Shiki 高亮后的结构。
 * 没有对应语法的语言（例如 txt）保持原样，不猜也不报错。
 */
export function highlightCode(html) {
    return html.replace(/<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g, (block, lang, code) => {
        if (!languages.has(lang)) {
            return block;
        }

        try {
            return highlighter.codeToHtml(unescapeHtml(code), { lang, themes: { light: THEME }, defaultColor: false });
        } catch {
            return block;
        }
    });
}
