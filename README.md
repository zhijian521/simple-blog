# Simple Blog

一个基于 Nuxt 3、Vue 3、TypeScript 和 Nuxt Content 的静态个人博客。

## 目录结构

- `app/`：Nuxt 应用代码、页面、组件、样式和依赖配置。
- `docs/notes/`：Markdown 笔记，构建时由 Nuxt Content 读取。
- `docs/images/`：博客图片素材。
- `docs/videos/`：博客视频素材。

## 开发

```bash
cd app
npm install
npm run dev
```

## 构建

```bash
cd app
npm run generate
```

静态文件会输出到 `app/.output/public`，可以直接部署到支持静态文件的服务器。

## 内容

- 文章放在 `docs/notes/*.md`，字段约定见 `app/content.config.ts`。
- 图片和视频分别放在 `docs/images/`、`docs/videos/`。
- 项目列表和首页介绍在 `app/pages/index.vue`。
- 正式部署时在 `app/.env` 设置 `NUXT_PUBLIC_SITE_URL`，用于 canonical 和结构化数据。
