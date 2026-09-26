# Simple Blog

一个极简的静态个人博客：Astro + Markdown，零原生依赖（不需要 Python、node-gyp 或 C++ 编译工具链）。

- 文章与素材都放在仓库根目录的 `docs/`，应用代码在 `app/`，两者互不干扰
- 首页：站点介绍（简介 + RSS / GitHub 入口）+ 项目列表 + 最新文章，文章条目含标题、日期与摘要
- 归档：分页列表，显示时间和摘要
- 自带 SEO：canonical、Open Graph、Twitter Card、JSON-LD、sitemap、robots.txt、RSS
- 极简版式：无页头页脚、无栅格线框、居中窄栏、正文左对齐；图片与代码块只有一道极浅的描边
- 自托管字体：霞鹜文楷（正文）与 IBM Plex Mono（代码），按站内实际用字裁剪成子集，运行时不请求任何外部 CDN

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

全部脚本（都在 `app/` 下执行）：

| 命令                             | 作用                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                    | 开发服务器；会先同步图片并检查字体子集覆盖                 |
| `npm run build`                  | 构建到 `app/dist/`；同样先做同步与字体检查                 |
| `npm run preview`                | 本地预览构建产物                                           |
| `npm run fonts`                  | 按站内用字重新裁剪字体子集（文章引入新汉字后要跑）         |
| `npm test`                       | 单元测试（Node 内置 `node --test`，零额外框架）            |
| `npm run format` / `format:check`| 用 Prettier 格式化 / 只检查（不覆盖 `docs/` 里的文章）     |

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
| `authorTagline`              | 作者签名行，首页简介开头与结构化数据共用                                       |
| `authorBio`                  | 作者简介，写入 Person 结构化数据                                               |
| `github`                     | 作者主页，作为 Person 的 `sameAs`，帮助搜索引擎归并实体                        |
| `description`                | 站点描述。用于首页 meta description 与 RSS 的 channel 描述；文章摘要来自各篇文章自己的 `description` |
| `blogDescription`            | 归档页的 meta description                                                      |
| `keywords`                   | 全站关键词数组；文章页会自动追加该文的标签与分类                               |
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

环境变量优先于 `site.config.mjs` 里的 `url`。如果把 `url` 填成 `example.com` 这类占位域名，构建时会打印提醒。

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
| `slug`       | 文章地址。**建议显式声明**：缺省时用文件名，而文件名通常是中文。只允许小写字母、数字与连字符 |
| `description` | 一句话摘要，用于列表、meta description 与分享卡片 |
| `date`       | 发布日期，格式 `YYYY-MM-DD`（必须补零），也是列表排序依据 |
| `updated`    | 可选，修订日期，写入结构化数据的 `dateModified`；不写则用 `date` |
| `tags`       | 标签，用于关键词与结构化数据                      |
| `category`   | 分类，写入结构化数据的 `articleSection`           |
| `coverImage` | 社交分享图，相对 `docs/` 的路径。**只用于分享卡片与结构化数据，不显示在页面上**；比例应为 1200×630 |
| `status`     | 非 `published` 不生成页面                         |

内容约定：

- 图片放 `docs/images/`，视频放 `docs/videos/`，构建前会自动同步到站点静态目录。
- 图片文件名只用 `[a-z0-9._-]`：**带空格时 markdown 根本不会解析这行**，中文名虽然能显示但读不到宽高。
- 正文里的图片写成相对路径 `images/xxx.webp` 即可，构建时会改写为 `/images/xxx.webp`，并自动补上宽高和懒加载。**只有 `.webp` 与 `.png` 能自动读到尺寸**，其它格式要自己写 `width`/`height`。
- 每张图都要写有意义的 `alt`，不要留文件名。**`alt` 里不要写反斜杠**：markdown-it 会把反斜杠和它后面那个字符一起吃掉，`C:\dev\nvm` 会变成 `C:evvm`。
- 视频要写绝对路径 `/videos/x.mp4`，相对路径不会被改写。
- `- [ ]` / `- [x]` 任务清单会渲染成勾选框，但**列表项之间不能有空行**，否则会退化成松散列表、不转换。
- 代码块用围栏加语言标注，支持 `bash`、`html`、`javascript`、`json`、`typescript`（`ts`）；不标语言或标了不支持的语言会按纯文本显示，不报错。
- 主题是 `github-light`，且把 4 个在浅灰底上对比度不足的颜色替换成了同色相的更深值。换主题要同时改 `app/src/lib/highlight.js` 里的 import、`themes` 数组里的变量与 `THEME` 常量，并重新确认对比度。
- 正文里的 `---` 按「纯留白」处理，不画横线。
- 正文中的原始 HTML 会保留（`html: true`），请只写自己信任的内容。

更细的写作约定（含全部已知的坑）另见 [`docs/写作规范.md`](docs/写作规范.md)。

## 字体

两套自托管字体，运行时不请求任何外部 CDN：

- **正文、标题、列表**：霞鹜文楷（LXGW WenKai）简体版，比例体
- **代码块与行内代码**：IBM Plex Mono，代码里的中文由 `--font-mono` 的第二顺位文楷接住，不需要额外的中文字体

字体不是整套塞进去的，而是**按站内实际用字裁剪过的子集**：

| 文件 | 覆盖 | 体积 |
| --- | --- | --- |
| `app/src/assets/fonts/lxgw-wenkai/lxgw-wenkai-site.woff2` | 已发布文章 + 会渲染的模板字面量 + CSS 里的 `content`（1460 个码点） | 250 KB |
| `app/src/assets/fonts/ibm-plex-mono/ibm-plex-mono-site.woff2` | 代码块与行内码里的非中日韩字符（423 个码点） | 15 KB |

- 为什么裁剪：官方分片版是按字频切成 97 片/字族，一篇中文长文会命中 24–56 片（首访 1.2–2.7MB），字体替换那一下非常明显；裁成子集后每页只下 250KB（含代码的页面再加 15KB），各自只有一个文件，可以整份 preload
- 字符集只扫**会渲染出文字**的地方：已发布文章、`.astro`/`.js` 里剥掉注释后的字面量、`site.config.mjs`，以及 CSS 的 `content: "…"`（任务清单的 ☐/☑ 就是这么进来的）。源码注释里的字不算——否则白涨体积，还会把真正缺字的告警淹掉
- `app/src/styles/fonts.css` 由脚本生成（两条 `@font-face`，带精确的 `unicode-range`），由 `main.css` 用 `@import` 引入；子集覆盖不到的字符会退回系统字体（emoji 就是如此，走系统的彩色 emoji 字体），不会出现豆腐块
- `Base.astro` 里正文子集每页都 preload，等宽子集只在含代码的页面 preload，避免没有代码的页面白下
- 两套字体都是 SIL OFL 1.1，`OFL.txt` 分别放在各自目录里；脚本只自动刷新 Plex Mono 的授权文件，文楷那份是手工放进仓库的
- 排版参数：正文 18px（基准字号，定义在 `main.css` 的 `:root`）/ 行高 1.8 / 段间距 1.05rem / 栏宽 680px；全站不用粗体（`font-synthesis: none`），层级靠字号与间距区分

新文章如果用到子集里没有的字，`prebuild` 会**直接失败并列出缺的字**（不会静默回退成系统字体），按提示重新裁剪即可：

```bash
cd app
npm run fonts
```

确实想带着回退字形先构建，用 `node scripts/build-font-subset.mjs --check --allow-missing`。

首次运行会下载完整字体（文楷 24MB、Plex Mono 136KB）缓存到 `app/.cache/fonts/`（已 ignore），之后复用；受限网络下先设置 `HTTPS_PROXY` 与 `NODE_USE_ENV_PROXY=1`。升级字体或换字体，改 `scripts/build-font-subset.mjs` 顶部的 `FONTS` 常量。

## 部署

`app/dist/` 是纯静态产物，可直接部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 或任意静态服务器。

部署前记得在 `app/site.config.mjs` 里把 `url` 改成正式域名，否则 canonical、sitemap 和分享卡片会指向占位域名。

构建产物包含：

| 文件                                 | 用途                      |
| ------------------------------------ | ------------------------- |
| `index.html`、`page/1/index.html`    | 首页与归档页              |
| `blog/<slug>/index.html`             | 每篇文章一个页面          |
| `404.html`                           | 404 页（已加 `noindex`，不会被收录） |
| `sitemap-index.xml`、`sitemap-0.xml` | 站点地图                  |
| `robots.txt`                         | 爬虫规则，含 sitemap 地址 |
| `rss.xml`                            | RSS 订阅源                |
| `manifest.json`                      | PWA 清单（本站无客户端 JS）|
| `images/`、`_astro/`                 | 图片与带内容 hash 的 CSS / 字体 |

**自建 nginx 部署时，缓存策略与安全响应头需要额外配置**（`Cache-Control`、CSP、`X-Content-Type-Options`、
`rss.xml` 的 `Content-Type`、www 跳转等），可直接复制 [`部署清单.md`](部署清单.md) 里的配置与验证命令。

## 目录结构

```text
simple-blog/
├─ app/                     Astro 应用
│  ├─ site.config.mjs       ★ 站点配置，克隆后主要改这里
│  ├─ astro.config.mjs      Astro 配置（站点地址、sitemap、docs 的 dev 热更新）
│  ├─ .prettierrc.json      格式化规则（含必需的 prettier-plugin-astro）
│  ├─ .prettierignore       排除 dist/、.astro/ 与生成的 fonts.css
│  ├─ scripts/sync-media.js 构建前同步 docs 里的图片和视频
│  ├─ scripts/build-font-subset.mjs 按站内用字裁剪字体子集、检查覆盖
│  ├─ tests/                node:test 单元测试（posts.js 与 highlight.js）
│  ├─ src/
│  │  ├─ lib/posts.js       读取 docs/blog 并渲染 Markdown
│  │  ├─ lib/highlight.js   构建期用 Shiki 给代码块着色
│  │  ├─ layouts/Base.astro 全站布局与 SEO meta
│  │  ├─ components/        PostList、Pagination
│  │  ├─ pages/             首页、文章页、归档页、404、robots.txt、rss.xml、manifest.json
│  │  ├─ styles/main.css    全站样式
│  │  ├─ styles/fonts.css   字体子集的 @font-face 规则（脚本生成，勿手改）
│  │  └─ assets/fonts/      自托管字体子集与 OFL 授权
│  ├─ assets/logo.png       图标与分享图的源文件（不参与部署）
│  └─ public/               图标与分享图（会被部署）
├─ docs/                    ★ 你的内容
│  ├─ blog/                 Markdown 文章（只有这里会被发布）
│  ├─ images/               图片
│  ├─ videos/               视频
│  └─ 写作规范.md           写文章与改代码的约定，含全部已知的坑
├─ .github/workflows/ci.yml 构建 + 格式 + 测试 + 产物断言
├─ 部署清单.md              nginx 配置、部署流程与上线后验证命令
├─ .nvmrc
└─ .gitattributes
```

## 技术栈

Astro 7、Markdown、gray-matter、markdown-it、@astrojs/sitemap、Shiki（构建期代码高亮，运行时零 JS）、subset-font（构建期裁剪字体，纯 JS/WASM，不需要本地编译）。开发期用 Prettier（含 `prettier-plugin-astro`）与 Node 内置的 `node --test`。没有数据库，没有服务端，没有需要本地编译的依赖。
