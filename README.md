# Simple Blog

一个极简的静态个人博客：Astro + Markdown，零原生依赖，运行时零 JS。文章与素材在 `docs/`，应用代码在 `app/`，两者互不干扰。

首页是「简介 + 项目 + 最新文章」，另有分页归档；自带 canonical、Open Graph、JSON-LD、sitemap、robots.txt 与 RSS。版式刻意做减法：无页头页脚、无栅格线框、居中窄栏、全站不用粗体。字体自托管（霞鹜文楷 + IBM Plex Mono），不请求任何外部 CDN。

技术上用 Astro 7、markdown-it + gray-matter、Shiki（构建期代码高亮）、subset-font（构建期裁剪字体）；开发期用 Prettier。没有数据库、没有服务端、没有需要本地编译的依赖。

## 快速开始

```bash
git clone https://github.com/zhijian521/simple-blog.git
cd simple-blog/app
npm install
npm run dev        # http://localhost:4321
```

需要 Node 22.12 或更高版本（`app/package.json` 的 `engines` 里写着要求）。

常用命令都在 `app/` 下执行：`npm run build` 构建到 `app/dist/`，`npm run preview` 本地预览，`npm run fonts` 重新裁剪字体子集，`npm run format` 格式化。

## 配置

所有站点配置都在 [`app/site.config.mjs`](app/site.config.mjs) 一个文件里，每一项都有注释，改完即生效，不需要动页面代码。域名可以用环境变量覆盖，便于同一份代码在不同环境构建：

```bash
SITE_URL=https://your-domain.com npm run build
```

## 写文章

文章放 `docs/blog/`，一篇文章一个 Markdown 文件，地址是 `/blog/<slug>/`。

```markdown
---
title: 文章标题
slug: my-post
description: 一句话摘要，会显示在列表、搜索结果和分享卡片里
date: 2026-06-28
category: 技术笔记
tags: [Astro, 前端]
---

正文……
```

- `slug` 必填，只允许小写字母、数字与连字符；`date` 必须补零写成 `YYYY-MM-DD`。
- `status` 不是 `published` 就不发布；`coverImage` 只用于分享卡片（1200×630，**不显示在页面上**）；`updated` 可选，写进结构化数据的 `dateModified`。
- 格式写错会**直接让构建失败并指出文件名**——这是有意的，比生成一堆坏链接强。

配图与排版上踩过的坑：

- 图片放 `docs/images/`，正文写相对路径 `images/xxx.webp`。文件名只用 `[a-z0-9._-]`：**带空格时 markdown 会整行不解析**，中文名则读不到宽高。只有 `.webp` 和 `.png` 会**自动补宽高**，其它格式要自己写 `width`/`height`。
- 每张图都写有意义的 `alt`，不要留文件名；**`alt` 里不能写反斜杠**（`C:\dev\nvm` 会变成 `C:evvm`）。视频要写绝对路径 `/videos/x.mp4`。
- 任务清单 `- [ ]` / `- [x]` 会渲染成勾选框，但列表项之间**不能有空行**。
- 代码围栏标上语言才会高亮，支持 `bash`、`html`、`javascript`、`json`、`typescript`（`ts`）；正文标题从哪一级开始都行，构建时会归一化成 h2 起步。
- 正文里的原始 HTML 会原样保留，请只写自己信任的内容。

## 字体

两套字体都是**按站内实际用字裁剪过的子集**，各自只有一个文件、可以整份 preload：霞鹜文楷（正文与标题，约 250KB）、IBM Plex Mono（代码，约 15KB）。子集覆盖不到的字会退回系统字体（emoji 就是如此，走系统的彩色字体）。

文章里出现新汉字就要重新裁剪，否则那个字会静默掉回系统字体：

```bash
npm run fonts
```

`prebuild` 会检查覆盖情况，**缺字时让构建失败**并列出缺的字（确实想先跳过，加 `--allow-missing`）。首次裁剪要联网下载完整字体并缓存到 `app/.cache/fonts/`；升级或更换字体改 `app/scripts/build-font-subset.mjs` 顶部的 `FONTS`。

排版参数（基准字号 18px、行高、栏宽、段间距）都定义在 `app/src/styles/main.css` 的 `:root` 里，改那一处即可整体调整。

## 部署

`app/dist/` 是纯静态产物，传到任意静态托管或服务器即可。部署前把 `site.config.mjs` 里的 `url` 改成正式域名，否则 canonical、sitemap 与分享卡片会指向占位域名。

产物包含 HTML、`sitemap-index.xml`、`robots.txt`、`rss.xml`、`manifest.json`，以及带内容 hash 的 `_astro/`。缓存策略与安全响应头（`Cache-Control`、CSP 等）不在产物里，属于托管层配置——自建服务器时记得给 `_astro/*` 设长期缓存，否则每次导航都会回源校验那份 250KB 字体。

## 目录结构

```text
simple-blog/
├─ app/                    Astro 应用
│  ├─ site.config.mjs      ★ 站点配置，克隆后主要改这里
│  ├─ src/lib/posts.js     读取 docs/blog 并渲染 Markdown
│  ├─ src/lib/highlight.js 构建期用 Shiki 给代码块着色
│  ├─ src/styles/          main.css 与生成的 fonts.css
│  └─ scripts/             同步图片、裁剪字体子集
├─ docs/                   ★ 你的内容：blog/ images/ videos/
└─ LICENSE
```

## 许可

代码（`app/`）采用 [MIT 许可](LICENSE)。字体（`app/src/assets/fonts/`）是第三方资源，采用 SIL OFL 1.1，**不受 MIT 覆盖**，再分发时请保留各自的 `OFL.txt`。文章内容（`docs/`）版权归作者所有。
