<div align="center">

# ✨ 耶温博客

**简约优雅的静态博客系统，记录思考，分享知识**

[![Vue](https://img.shields.io/badge/Vue-3.4-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[![demo](https://img.shields.io/badge/博客-在线访问-orange.svg)](https://blog.yuwb.cn)

</div>

---

## 📖 简介

耶温博客是一个轻量级、高性能的静态博客系统，采用 Vue 3 和 Vite 构建，提供现代化的开发体验和优化的生产构建。

**适用场景**：个人博客、技术写作、文档站点、以及所有重视内容而非复杂性的场景。

---

## ✨ 特性

### 核心功能

- 📝 **Markdown 支持** - 使用 Markdown 编写文章，支持 front-matter 元数据
- 🔍 **全文搜索** - 快速搜索文章标题、标签和简介，支持快捷键
- 📱 **完全响应式** - 在所有设备上完美显示
- 🔒 **安全优先** - DOMPurify 净化防止 XSS 攻击
- 🎯 **类型安全** - 使用 TypeScript 提供更好的开发体验
- ⚡ **开箱即用** - 零配置，无需繁琐设置

### 视觉效果

- 🎨 **水墨涟漪** - 首页水墨风格背景动画
- ❄️ **雪花飘落** - 冬日主题雪花效果
- 🪟 **透明玻璃** - macOS 风格 Dock 导航菜单
- 🌊 **液态玻璃态** - 现代化的 Glassmorphism 设计语言
- ✨ **平滑动画** - 精心设计的过渡和交互效果

### 增强功能

- 📊 **Git 活动图** - 类似 GitHub 的贡献度热力图
- 📰 **最新文章** - 首页底部显示最新文章列表
- 🔗 **智能路由** - 文章列表、详情页无缝导航
- 🌐 **SEO 优化** - 自动生成 sitemap，优化搜索引擎收录
- 📱 **PWA 支持** - 可安装到桌面，支持离线访问

---

## 🎯 技术栈

| 技术                                                                            | 版本  | 用途          |
| :------------------------------------------------------------------------------ | :---- | :------------ |
| ![Vue](https://img.shields.io/badge/-Vue-42b883?logo=vue.js)                    | 3.4+  | 渐进式框架    |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript)  | 5.3+  | 类型安全      |
| ![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite)                    | 5.0+  | 构建工具      |
| ![Vue Router](https://img.shields.io/badge/-Vue_Router-42b883?logo=vue.js)      | 4.2+  | 路由管理      |
| ![markdown-it](https://img.shields.io/badge/-Markdown--it-083fa1?logo=markdown) | 14.0+ | Markdown 解析 |
| ![DOMPurify](https://img.shields.io/badge/-DOMPurify-4a5c6c?logo=html5)         | 3.3+  | XSS 防护      |
| ![Shiki](https://img.shields.io/badge/-Shiki-21262a?logo=javascript)            | 3.21+ | 代码高亮      |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/simple-blog.git
cd simple-blog

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器（端口 3000）
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建

```bash
# 生产构建
npm run build

# 预览生产构建
npm run preview
```

---

## 📝 撰写文章

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

**注意**：

- 每篇文章必须有唯一的 `id` 字段（8 位字母数字）
- 使用 `npm run ensure-ids` 自动为文章生成 ID
- 开发时创建新文件会自动添加 ID

**文章目录结构**：

```
blogs/
├── 技术/
│   ├── Vue/
│   │   └── vue-composition-api.md
│   └── TypeScript/
│       └── ts-best-practices.md
└── 生活/
    └── about-me.md
```

---

## 📁 项目结构

```
simple-blog/
├── blogs/                  # 📝 Markdown 文章
├── public/                 # 🖼️ 静态资源
├── scripts/                # 🔧 构建脚本
│   ├── fetch-git-activity.cjs     # Git 活动数据获取
│   ├── ensure-article-ids.js      # 文章 ID 管理
│   └── generate-sitemap.cjs        # Sitemap 生成
├── src/
│   ├── components/
│   │   ├── effects/       # ✨ Canvas 动画特效
│   │   │   ├── InkBackground.vue      # 水墨涟漪效果
│   │   │   └── SnowfallEffect.vue     # 雪花飘落效果
│   │   ├── icons/         # 🎨 图标组件
│   │   ├── article/       # 📄 文章相关组件
│   │   └── ui/            # 🎛️ UI 组件
│   │       ├── Dock.vue                # macOS 风格 Dock 导航
│   │       ├── SearchModal.vue        # 搜索模态框
│   │       ├── GitActivityChart.vue   # Git 活动图
│   │       └── LatestArticles.vue     # 最新文章列表
│   ├── composables/     # 🔧 Vue Composition 函数
│   │   ├── ripple/        # 涟漪动画逻辑
│   │   ├── snowfall/      # 雪花动画逻辑
│   │   └── common/       # 共享 composables
│   ├── pages/            # 📄 页面组件
│   │   ├── HomePage.vue            # 首页
│   │   ├── ArticlesPage.vue         # 文章列表页
│   │   └── ArticleDetailPage.vue    # 文章详情页
│   ├── router/          # 🛣️ Vue Router 配置
│   ├── styles/          # 🎨 全局样式
│   │   ├── variables.css  # 设计变量
│   │   ├── base.css       # Reset 和基础样式
│   │   └── common.css     # 通用组件样式
│   ├── types/           # 📋 TypeScript 类型定义
│   ├── utils/           # 🛠️ 工具函数
│   ├── constants/       # ⚙️ 应用配置
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🎨 自定义

### 站点配置

编辑 `src/constants/index.ts`：

```typescript
export const SITE_CONFIG = {
  title: '你的博客名称',
  description: '你的博客描述',
  keywords: '关键词1, 关键词2',
  author: '你的名字',
  url: 'https://yourblog.com',
  icp: {
    number: '你的ICP备案号',
    url: 'https://beian.miit.gov.cn/',
  },
  copyright: {
    startYear: 2024,
    owner: '你的网站名称',
  },
}
```

### 主题变量

编辑 `src/styles/variables.css`：

```css
:root {
  /* 颜色 */
  --color-text: #3a3a3a;
  --color-text-light: #666666;
  --color-bg: #ffffff;
  --color-accent: #1a1a1a;

  /* 间距 */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* 字体 */
  --font-size-base: 1rem;
  --font-weight-medium: 400;
}
```

---

## 🚢 部署

### 静态托管

项目构建为 `dist/` 目录下的静态文件，可部署到任何静态托管服务：

| 服务                 | 状态    | 链接                                 |
| :------------------- | :------ | :----------------------------------- |
| **Vercel**           | ✅ 推荐 | [部署](https://vercel.com)           |
| **Netlify**          | ✅ 支持 | [部署](https://netlify.com)          |
| **Cloudflare Pages** | ✅ 支持 | [部署](https://pages.cloudflare.com) |

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

---

## 📜 可用脚本

| 命令                       | 说明                        |
| :------------------------- | :-------------------------- |
| `npm run dev`              | 启动开发服务器（端口 3000） |
| `npm run build`            | 生产构建                    |
| `npm run preview`          | 预览生产构建                |
| `npm run fetch-git`        | 获取 Git 活动数据           |
| `npm run ensure-ids`       | 确保所有文章都有 ID         |
| `npm run generate-sitemap` | 生成 sitemap.xml            |
| `npm run format`           | 使用 Prettier 格式化代码    |
| `npm run format:check`     | 检查代码格式                |
| `npm run lint`             | 使用 ESLint 检查代码        |
| `npm run lint:fix`         | 自动修复代码问题            |

---

## 🎯 核心特性详解

### Canvas 动画系统

项目包含两个独立的 Canvas 动画模块：

**水滴涟漪** (`InkBackground.vue`)

- 模拟水墨在纸上晕染的效果
- 粒子随机生成和扩散
- 半透明叠加产生层次感

**雪花飘落** (`SnowfallEffect.vue`)

- 自然的雪花下落动画
- 响应式雪花数量（根据屏幕宽度自动调整）
- 不同大小的雪花营造景深感

### 搜索功能

- **快捷键支持**：
  - `Cmd/Ctrl + K` - 全局快捷键
  - `Q` - 独立快捷键（智能检测输入状态）
- **搜索范围**：文章标题、标签、简介
- **性能优化**：300ms 防抖，预转换小写
- **用户体验**：自动聚焦、ESC 关闭、点击跳转

### Git 活动图

- 类似 GitHub 的贡献度热力图
- 显示最近 30 天的提交记录
- 数据自动获取和更新

### PWA 支持

- 可安装到桌面
- 支持离线访问
- 自动更新机制

---


## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 💖 致谢

- [Vue.js](https://vuejs.org/) - 渐进式框架
- [Vite](https://vitejs.dev/) - 新一代前端工具
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器
- 所有贡献者和支持者

---

<div align="center">

**Made with ❤️ by 耶温**

[⬆ 返回顶部](#-耶温博客)

</div>
