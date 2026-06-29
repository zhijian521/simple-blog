# Simple Blog

基于 Next.js 的极简个人博客，静态导出，Markdown 写作。

水墨宣纸 · 朱砂点睛 · 零圆角，复用 [zhijian](https://github.com/zhijian521/zhijian) 的设计系统与组件。

## 技术栈

- **Next.js 15** + React 19，`output: 'export'` 静态导出
- **TypeScript** 严格模式
- **gray-matter** 解析 Markdown front-matter
- **react-markdown** + remark-gfm + rehype-highlight 渲染正文
- **CSS Modules**，组件级样式隔离

## 快速开始

```bash
npm install
npm run dev      # 本地开发 http://localhost:3000
npm run build    # 静态导出到 out/
```

`out/` 目录即可直接部署到任意静态托管（Vercel / GitHub Pages / 对象存储）。

> 建议使用 Node 20 LTS 运行。Node 25 的 dev 模式有 `localStorage` 兼容问题，可切换到 Node 20 规避。

## 写作

文章放在 `docs/` 下，Markdown 文件带 front-matter：

```markdown
---
title: 文章标题
slug: url-slug
status: published
summary: 一句话摘要
category: 技术笔记
tags: [前端, Next.js]
publishedAt: 2026-06-28 12:00:00
coverImage: images/cover-48.webp
---

正文内容……
```

字段说明：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `slug` | 是 | URL 标识，`/blog/<slug>` |
| `status` | 否 | `published` 才会发布，缺省视为已发布 |
| `summary` | 否 | 摘要，用于列表与首页 |
| `category` | 否 | 单层分类，如「技术笔记」「项目实战」 |
| `tags` | 否 | 标签数组 |
| `publishedAt` | 否 | 发布时间 `YYYY-MM-DD HH:mm:ss` |
| `coverImage` | 否 | 封面图相对路径，如 `images/cover-48.webp` |

图片放在 `public/images/`，Markdown 中用 `images/xxx.webp` 引用（运行时自动转为 `/images/xxx.webp` 绝对路径）。

## 目录结构

```
simple-blog/
├── docs/                # Markdown 文章
├── public/              # 静态资源（图片、favicon、manifest）
│   └── images/
└── src/
    ├── app/             # 路由页面（首页 / 文章列表 / 文章详情 / 404）
    ├── components/
    │   ├── site/        # 业务组件（文章视图、卡片、导航壳层等）
    │   └── ui/          # 基础组件（按钮、标签、图标、分页等）
    └── lib/             # 数据层与工具（posts.ts / format-date.ts / site.ts）
```

## 站点配置

编辑 `src/lib/site.ts` 修改站点名称、描述、URL、导航等元信息。

## License

MIT
