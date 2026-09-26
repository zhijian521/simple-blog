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

// github-light 的配色是按白底调的，而本站代码块底色是 --color-code(#eceae0)，
// 其中 4 个 token 在浅灰底上达不到 4.5:1。这里换成同色相、更深的实测合格值：
// 注释 3.99→5.30、字符串 3.84→6.13、关键字 3.79→5.35、数字 2.89→5.36。
// 键必须小写，Shiki 内部按 toLowerCase() 查表。
const COLOR_FIXES = {
    "#6a737d": "#57606a",
    "#22863a": "#116329",
    "#d73a49": "#b62324",
    "#e36209": "#a04100",
};

// markdown-it 交给我们的代码是转义后的实体，Shiki 需要原始文本。
// 替换顺序不能改：&amp; 必须最后换，否则 &amp;lt; 会先变成 &lt;，
// 下一轮又被还原成 <，把代码里的字面量当成真标签。
const unescapeHtml = (text) =>
    text
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");

// 代码块在窄屏下靠横向滚动阅读，而浏览器只允许键盘滚动可聚焦的滚动区域；
// Shiki 会给它生成的 <pre> 加 tabindex，未高亮的块得自己补，否则同一篇文章里两种行为。
const makeFocusable = (html) => html.replace(/<pre(?![^>]*\stabindex=)/g, '<pre tabindex="0"');

/**
 * 把正文里的 <pre><code class="language-xxx"> 替换成 Shiki 高亮后的结构。
 * 没有对应语法的语言（例如 txt）保持原样，不猜也不报错。
 */
export function highlightCode(html) {
    const highlighted = html.replace(/<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g, (block, lang, code) => {
        if (!languages.has(lang)) {
            return block;
        }

        try {
            return highlighter.codeToHtml(unescapeHtml(code), {
                lang,
                themes: { light: THEME },
                defaultColor: false,
                colorReplacements: COLOR_FIXES,
            });
        } catch {
            return block;
        }
    });

    return makeFocusable(highlighted);
}
