import fs from "node:fs";
import path from "node:path";

/**
 * 站点配置
 *
 * 克隆本项目后，通常只需要修改这个文件，再替换 docs/ 下的文章和图片即可。
 * 所有页面、SEO meta、sitemap、RSS 都从这里读取，避免同一个值散落在多个文件里。
 */
const config = {
    // 部署后的正式域名。用于 canonical、sitemap、RSS 和分享卡片。
    // 末尾不要带斜杠。也可以用环境变量 SITE_URL 覆盖（shell 变量或 app/.env 都可以）。
    url: "https://yuwb.dev",

    // 站点名。会出现在浏览器标题后缀、结构化数据和 RSS 里。
    name: "语无边",

    // 首页介绍区显示的身份，和站点名排在同一行：语无边 · 开发工程师
    role: "开发工程师",

    // 文章作者署名，用于结构化数据。
    author: "语无边",

    // 作者签名行，与个人页、结构化数据共用
    authorTagline: "前端开发 · 全栈 · 简约设计 · 造物",

    // 作者简介，写入 Person 结构化数据
    authorBio:
        "喜欢简洁的设计，也喜欢安静地写点代码。偶尔捣鼓些小工具，把一闪而过的想法变成看得见的东西。这里没有宏大的叙事，只有一些零散的记录和简单的快乐。",

    // 作者主页，作为 Person 的 sameAs，帮助搜索引擎归并实体
    github: "https://github.com/zhijian521",

    // 站点描述。首页的 meta description，也是没有摘要的文章的兜底描述。
    description:
        "语无边的个人技术博客 — 追求简洁设计与美好事物，以代码与文字安静造物。涵盖前端开发、TypeScript、Node.js、CesiumJS 三维可视化、SEO 优化与建站部署。",

    // 文章列表页（归档）的描述
    blogDescription:
        "语无边的技术博客，追求简洁设计与美好事物，安静造物。分享前端开发、TypeScript、Node.js、三维可视化、SEO 优化与建站部署的实践记录。",

    // 全站关键词，与实际发布的文章主题保持一致。文章页会自动追加该文的标签与分类。
    // 说明：Google 已不读 meta keywords，但百度等中文搜索引擎仍会参考。
    keywords: [
        "简静造物",
        "语无边",
        "前端开发",
        "全栈开发",
        "TypeScript",
        "Node.js",
        "CesiumJS",
        "三维可视化",
        "WebGL",
        "SEO",
        "性能优化",
        "腾讯云",
        "服务器部署",
        "内网开发",
        "VS Code",
        "浏览器 API",
        "简约设计",
        "技术博客",
        "个人博客",
    ],

    // 语言与主题色
    locale: "zh-CN",
    themeColor: "#f8f8f5",

    // 社交分享默认图，放在 app/public/ 下，建议 1200×630。
    ogImage: "/og.png",

    // 站点图标，放在 app/public/ 下。
    favicon: "/favicon-32.png",
    appleTouchIcon: "/apple-touch-icon.png",

    // 内容目录，相对 app/ 定位。
    contentDir: "../docs",

    // 文章所在的子目录（相对 contentDir）
    postsDir: "blog",

    // 文章地址前缀。文章会生成在 /blog/<slug>/，归档仍在 /page/N/。
    postsBase: "/blog",

    // 首页最多展示多少篇文章（不足则全部展示，并且不显示「归档」入口）
    postsOnHome: 10,

    // 归档每页条数
    postsPerArchivePage: 10,

    // 首页项目列表。href 为空时只显示文字，不可点击。
    projects: [
        {
            title: "simple-blog",
            description: "一个用来记录笔记、项目和日常思考的个人站点。",
            href: "https://github.com/zhijian521/simple-blog",
        },
        {
            title: "cesium-example",
            description: "一个基于 CesiumJS 的三维地球可视化示例集，零依赖、零构建。",
            href: "https://github.com/zhijian521/cesium-example",
        },
    ],
};

// npm 脚本会把工作目录设为 app/，内容目录以它为基准。
// 这样即使 Astro 打包改写了模块位置，路径依然稳定。
const appDir = process.cwd();

// 域名优先取环境变量，便于同一份代码在不同环境构建。
// shell 变量和 app/.env 都可以：Astro 会在配置求值之前把 .env 注入 process.env。
const url = (process.env.SITE_URL || config.url).replace(/\/+$/, "");

// 用字符串拼接生成绝对地址，而不是 new URL()：部署在子路径
// （例如 https://name.github.io/blog）时前者才不会丢掉前缀。
export const absoluteUrl = (target) => `${url}${encodeURI(target.startsWith("/") ? target : `/${target}`)}`;

const docsDir = path.resolve(appDir, config.contentDir);

if (!fs.existsSync(docsDir)) {
    throw new Error(`找不到内容目录：${docsDir}\n请在 app/ 目录下通过 npm 脚本运行，例如：cd app && npm run build`);
}

export default { ...config, url, appDir, docsDir };
