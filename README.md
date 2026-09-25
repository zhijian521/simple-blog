# Simple Blog

一个极简的静态个人博客：Astro + Markdown，零原生依赖（不需要 Python、node-gyp 或 C++ 编译工具链）。

- 文章与素材都放在仓库根目录的 `docs/`，应用代码在 `app/`，两者互不干扰
- 首页：介绍 + 项目列表 + 最新文章
- 归档：分页列表，显示时间和摘要
- 自带 SEO：canonical、Open Graph、Twitter Card、JSON-LD、sitemap、robots.txt、RSS
- 极简版式：无页头页脚、无边框、居中窄栏、正文左对齐

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

站点域名也可以用环境变量覆盖，便于同一份代码在不同环境构建。两种写法都支持：

```bash
# 方式一：shell 环境变量
SITE_URL=https://your-domain.com npm run build
```

```bash
# 方式二：在 app/ 下建 .env（可参考 app/.env.example）
SITE_URL=https://your-domain.com
```

环境变量优先于 `site.config.mjs` 里的 `url`。如果最终仍是默认的 `example.com`，构建时会打印提醒。

## 写文章

文章放在 `docs/blog/`，一篇文章一个 Markdown 文件。文件名或 front matter 里的 `slug` 决定文章地址，最终生成在 `/blog/<slug>/`。

```markdown
---
title: 文章标题
slug: my-post
summary: 一句话摘要，会显示在列表和搜索结果里
publishedAt: 2026-06-28 12:00:00
category: 项目实战
tags: [Astro, 前端]
coverImage: images/cover.webp
status: published
---

正文……
```

front matter 同时兼容两种写法：

| 用途 | 简写                                | Obsidian 导出写法 |
| ---- | ----------------------------------- | ----------------- |
| 标题 | `title`                             | `title`           |
| 地址 | `slug`（缺省时用文件名）            | `slug`            |
| 摘要 | `description`                       | `summary`         |
| 日期 | `date`                              | `publishedAt`     |
| 标签 | `tags`                              | `tags`            |
| 分类 | —                                   | `category`        |
| 封面 | —                                   | `coverImage`      |
| 状态 | `status`，非 `published` 不生成页面 | `status`          |

内容约定：

- 图片放 `docs/images/`，视频放 `docs/videos/`，构建前会自动同步到站点静态目录。
- 正文里的图片写成相对路径 `images/xxx.webp` 即可，构建时会改写为 `/images/xxx.webp`，并自动补上宽高和懒加载。
- `- [ ]` / `- [x]` 任务清单会渲染成勾选框。
- 正文里的 `---` 按「纯留白」处理，不画横线。
- 正文中的原始 HTML 会保留（`html: true`），请只写自己信任的内容。

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
│  ├─ src/
│  │  ├─ lib/posts.js       读取 docs/blog 并渲染 Markdown
│  │  ├─ layouts/Base.astro 全站布局与 SEO meta
│  │  ├─ components/        PostList、Pagination
│  │  ├─ pages/             首页、文章页、归档页、robots.txt、rss.xml
│  │  └─ styles/main.css    全站样式
│  ├─ assets/logo.png       图标与分享图的源文件（不参与部署）
│  └─ public/               图标与分享图（会被部署）
├─ docs/                    ★ 你的内容
│  ├─ blog/                 Markdown 文章
│  ├─ images/               图片
│  └─ videos/               视频
├─ .nvmrc
└─ .prettierrc.json
```

## 技术栈

Astro 7、Markdown、gray-matter、markdown-it、@astrojs/sitemap。没有数据库，没有服务端，没有需要本地编译的依赖。
