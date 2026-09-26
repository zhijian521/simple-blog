# Simple Blog

一个极简的静态个人博客：Astro + Markdown，零原生依赖（不需要 Python、node-gyp 或 C++ 编译工具链）。

- 文章与素材都放在仓库根目录的 `docs/`，应用代码在 `app/`，两者互不干扰
- 首页：站点介绍（简介 + RSS / GitHub 入口）+ 项目列表 + 最新文章，文章条目含标题、日期与摘要
- 归档：分页列表，显示时间和摘要
- 自带 SEO：canonical、Open Graph、Twitter Card、JSON-LD、sitemap、robots.txt、RSS
- 极简版式：无页头页脚、无边框、居中窄栏、正文左对齐
- 自托管字体：霞鹜文楷（LXGW WenKai）简体版，按 `unicode-range` 分片，浏览器只下载用到的分片

## 快速开始

```bash
git clone https://github.com/zhijian521/simple-blog.git
cd simple-blog/app
npm install
npm run dev
```

打开 http://localhost:4321 。

构建静态文件：

```bash
cd app
npm run build     # 输出到 app/dist/
npm run preview   # 本地预览构建结果
```

需要 Node 22.12 或更高版本，仓库根目录的 `.nvmrc` 已固定推荐版本：

```bash
nvm use
```

## 配置

**所有站点配置都在 [`app/site.config.mjs`](app/site.config.mjs) 一个文件里**，改完即可，不需要动页面代码。

| 配置项                       | 说明                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `url`                        | 部署后的正式域名，用于 canonical、sitemap、RSS、分享卡片。末尾不要带斜杠       |
| `name`                       | 站点名，出现在浏览器标题后缀和结构化数据里                                     |
| `role`                       | 首页介绍区的身份，与站点名同行显示：`语无边 · 开发工程师`                      |
| `author`                     | 文章作者署名                                                                   |
| `description`                | 站点描述，用作首页 meta description 和文章摘要兜底                             |
| `locale`                     | 语言，默认 `zh-CN`                                                             |
| `themeColor`                 | 浏览器主题色                                                                   |
| `ogImage`                    | 社交分享默认图，放在 `app/public/`，建议 1200×630                              |
| `favicon` / `appleTouchIcon` | 站点图标，放在 `app/public/`                                                   |
| `contentDir`                 | 内容目录，相对 `app/`，默认 `../docs`                                          |
| `postsDir`                   | 文章所在的子目录，相对 `contentDir`，默认 `blog`                               |
| `postsBase`                  | 文章地址前缀，默认 `/blog`，即文章生成在 `/blog/<slug>/`                       |
| `postsOnHome`                | 首页最多展示多少篇。文章不超过此数时，首页不显示「归档」入口，也不会生成归档页 |
| `postsPerArchivePage`        | 归档每页条数                                                                   |
| `projects`                   | 首页项目列表，每项为 `{ title, description, href }`，`href` 留空则只显示文字   |

站点域名也可以用环境变量覆盖，便于同一份代码在不同环境构建：

```bash
SITE_URL=https://your-domain.com npm run build
```

也可以写在 `app/.env` 里（Astro 会自动读取）：

```bash
SITE_URL=https://your-domain.com
```

环境变量优先于 `site.config.mjs` 里的 `url`。如果最终仍是默认的 `example.com`，构建时会打印提醒。

## 写文章

文章放在 `docs/blog/`，一篇文章一个 Markdown 文件。文件名或 front matter 里的 `slug` 决定文章地址，最终生成在 `/blog/<slug>/`。

```markdown
---
title: 文章标题
slug: my-post
description: 一句话摘要，会显示在列表、搜索结果和分享卡片里
date: 2026-06-28
category: 项目实战
tags: [Astro, 前端]
coverImage: images/cover.webp
status: published
---

正文……
```

front matter 字段：

| 字段         | 说明                                              |
| ------------ | ------------------------------------------------- |
| `title`      | 文章标题，缺省时用 slug                           |
| `slug`       | 文章地址，缺省时用文件名                          |
| `description` | 一句话摘要，用于列表、meta description 与分享卡片 |
| `date`       | 发布日期，格式 `YYYY-MM-DD`，也是列表排序依据     |
| `tags`       | 标签，用于关键词与结构化数据                      |
| `category`   | 分类，写入结构化数据的 `articleSection`           |
| `coverImage` | 封面图，相对 `docs/` 的路径，如 `images/cover.webp` |
| `status`     | 非 `published` 不生成页面                         |

内容约定：

- 图片放 `docs/images/`，视频放 `docs/videos/`，构建前会自动同步到站点静态目录。
- 正文里的图片写成相对路径 `images/xxx.webp` 即可，构建时会改写为 `/images/xxx.webp`，并自动补上宽高和懒加载。
- `- [ ]` / `- [x]` 任务清单会渲染成勾选框。
- 代码块用围栏加语言标注（如 ts、bash、html、json），构建时由 Shiki 着色；不标语言的围栏按纯文本显示。主题是 `github-light`，换主题改 `app/src/lib/highlight.js` 顶部常量。
- 正文里的 `---` 按「纯留白」处理，不画横线。
- 正文中的原始 HTML 会保留（`html: true`），请只写自己信任的内容。

## 字体

两套自托管字体，运行时不请求任何外部 CDN：

- **正文、标题、列表**：霞鹜文楷（LXGW WenKai）简体版，比例体
- **代码块与行内代码**：IBM Plex Mono，代码里的中文由 `--font-mono` 的第二顺位文楷接住，不需要额外的中文字体

字体不是整套塞进去的，而是**按站内实际用字裁剪过的子集**：

| 文件 | 覆盖 | 体积 |
| --- | --- | --- |
| `app/src/assets/fonts/lxgw-wenkai/lxgw-wenkai-site.woff2` | `docs/` 与 `app/` 里出现的全部用字（1471 个码点） | 252 KB |
| `app/src/assets/fonts/ibm-plex-mono/ibm-plex-mono-site.woff2` | 代码里的拉丁字符与符号（423 个码点） | 15 KB |

- 为什么裁剪：官方分片版是按字频切成 97 片/字族，一篇中文长文会命中 24–56 片（首访 1.2–2.7MB），字体替换那一下非常明显；裁成子集后每页只下 252KB（含代码的页面再加 15KB），各自只有一个文件，可以整份 preload
- `app/src/styles/fonts.css` 由脚本生成（两条 `@font-face`，带精确的 `unicode-range`），由 `main.css` 用 `@import` 引入；子集覆盖不到的字符会退回系统字体，不会出现豆腐块
- `Base.astro` 里正文子集每页都 preload，等宽子集只在含代码的页面 preload，避免没有代码的页面白下
- 两套字体都是 SIL OFL 1.1，`OFL.txt` 分别放在各自目录里
- 排版参数：正文 16px / 行高 1.8 / 段间距 1.05rem / 栏宽 680px；全站不用粗体（`font-synthesis: none`），层级靠字号与间距区分

新文章如果用到子集里没有的字，`npm run dev` 与 `npm run build` 会在同步/构建前提示，运行下面这条重新裁剪即可：

```bash
cd app
npm run fonts
```

首次运行会下载完整字体（文楷 24MB、Plex Mono 136KB）缓存到 `app/.cache/fonts/`（已 ignore），之后复用；受限网络下先设置 `HTTPS_PROXY` 与 `NODE_USE_ENV_PROXY=1`。升级字体或换字体，改 `scripts/build-font-subset.mjs` 顶部的 `FONTS` 常量。

## 部署

`app/dist/` 是纯静态产物，可直接部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 或任意静态服务器。

部署前记得在 `app/site.config.mjs` 里把 `url` 改成正式域名，否则 canonical、sitemap 和分享卡片会指向占位域名。

构建产物包含：

| 文件                                 | 用途                      |
| ------------------------------------ | ------------------------- |
| `sitemap-index.xml`、`sitemap-0.xml` | 站点地图                  |
| `robots.txt`                         | 爬虫规则，含 sitemap 地址 |
| `rss.xml`                            | RSS 订阅源                |

## 目录结构

```text
simple-blog/
├─ app/                     Astro 应用
│  ├─ site.config.mjs       ★ 站点配置，克隆后主要改这里
│  ├─ astro.config.mjs      Astro 配置（站点地址、sitemap）
│  ├─ scripts/sync-media.js 构建前同步 docs 里的图片和视频
│  ├─ scripts/build-font-subset.mjs 按站内用字裁剪字体子集、检查覆盖
│  ├─ src/
│  │  ├─ lib/posts.js       读取 docs/blog 并渲染 Markdown
│  │  ├─ lib/highlight.js   构建期用 Shiki 给代码块着色
│  │  ├─ layouts/Base.astro 全站布局与 SEO meta
│  │  ├─ components/        PostList、Pagination
│  │  ├─ pages/             首页、文章页、归档页、robots.txt、rss.xml
│  │  ├─ styles/main.css    全站样式
│  │  ├─ styles/fonts.css   字体子集的 @font-face 规则（脚本生成）
│  │  └─ assets/fonts/      自托管字体子集与 OFL 授权
│  ├─ assets/logo.png       图标与分享图的源文件（不参与部署）
│  └─ public/               图标与分享图（会被部署）
├─ docs/                    ★ 你的内容
│  ├─ blog/                 Markdown 文章
│  ├─ images/               图片
│  └─ videos/               视频
├─ .nvmrc
├─ .prettierrc.json
├─ .prettierignore
└─ .gitattributes
```

## 技术栈

Astro 7、Markdown、gray-matter、markdown-it、@astrojs/sitemap、Shiki（构建期代码高亮，运行时零 JS）。字体自托管且按内容裁剪成子集，没有数据库，没有服务端，没有需要本地编译的依赖。
