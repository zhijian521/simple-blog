# ✨ 耶温博客

简约优雅的静态博客系统，记录思考，分享知识

---

耶温博客是一个轻量级、高性能的静态博客系统，采用 Vue 3 和 Vite 构建。支持 Markdown 撰写、全文搜索、响应式设计，开箱即用。

---

## 快速开始

### 安装

```bash
git clone https://github.com/yourusername/simple-blog.git
cd simple-blog
npm install
```

### 开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建

```bash
npm run build
npm run preview
```

---

## 撰写文章

在 `blogs/` 目录下创建 Markdown 文件：

```markdown
---
id: a1b2c3d4
title: 你的文章标题
date: 2024-01-01
category: 技术
excerpt: 文章简介
author: 耶温
tags:
  - JavaScript
  - Vue
---

# 文章内容

使用 **Markdown** 格式编写你的文章。
```

文章必须有唯一的 `id` 字段，使用 `npm run ensure-ids` 可自动生成。

---

## 配置

### 站点信息

编辑 `src/constants/index.ts` 修改站点配置：

```typescript
export const SITE_CONFIG = {
  title: '你的博客名称',
  description: '你的博客描述',
  author: '你的名字',
  url: 'https://yourblog.com',
}
```

### 主题颜色

编辑 `src/styles/variables.css` 自定义主题：

```css
:root {
  --color-text: #3a3a3a;
  --color-bg: #ffffff;
  --color-accent: #1a1a1a;
}
```

---

## 部署

项目构建为 `dist/` 目录下的静态文件，可部署到：

- **Vercel** - [vercel.com](https://vercel.com)
- **Netlify** - [netlify.com](https://netlify.com)
- **Cloudflare Pages** - [pages.cloudflare.com](https://pages.cloudflare.com)

---

## 技术栈

[![Vue](https://img.shields.io/badge/-Vue-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue Router](https://img.shields.io/badge/-Vue_Router-42b883?logo=vue.js&logoColor=white)](https://router.vuejs.org/)
[![markdown-it](https://img.shields.io/badge/-Markdown--it-083fa1?logo=markdown&logoColor=white)](https://github.com/markdown-it/markdown-it)
[![DOMPurify](https://img.shields.io/badge/-DOMPurify-4a5c6c?logo=html5&logoColor=white)](https://github.com/cure53/DOMPurify)
[![Shiki](https://img.shields.io/badge/-Shiki-21262a?logo=javascript&logoColor=white)](https://shiki.style/)

---

## 脚本命令

| 命令                       | 说明              |
| -------------------------- | ----------------- |
| `npm run dev`              | 启动开发服务器    |
| `npm run build`            | 生产构建          |
| `npm run ensure-ids`       | 生成文章 ID       |
| `npm run fetch-git`        | 获取 Git 活动数据 |
| `npm run generate-sitemap` | 生成 sitemap      |

---

## 许可证

[MIT License](LICENSE)

---

**Made with ❤️ by 耶温**
