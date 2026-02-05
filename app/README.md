# ✨ Simple Blog

> 简约优雅的静态博客系统，基于 Vue 3 + Vite + TypeScript 构建

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ✨ 特性

- **🚀 极速构建** - 基于 Vite，毫秒级热更新，秒级冷启动
- **📝 Markdown 支持** - 完整的 Markdown 语法支持，代码高亮，数学公式
- **🔍 全文搜索** - 基于标题、标签和简介的即时搜索
- **💬 评论系统** - 集成 Giscus，基于 GitHub Discussions 的评论功能
- **🎨 精美动效** - Canvas 水墨涟漪、雪花飘落等动画特效
- **📱 响应式设计** - 完美适配桌面端、平板和移动端
- **⚡ PWA 支持** - 离线访问，添加到主屏幕，类原生应用体验
- **🔒 安全防护** - XSS 防护，路径遍历防护，内容净化
- **📊 SEO 优化** - Sitemap 自动生成，Open Graph 支持
- **🎯 TypeScript** - 完整类型支持，提升开发体验

---

## 📸 预览

### 首页

> 水墨风格背景，Git 活动贡献图，优雅的文章卡片展示

### 文章详情

> 完整的 Markdown 渲染，代码语法高亮，目录导航

### 搜索功能

> `Cmd/Ctrl + K` 快捷键唤起，多关键词搜索，即时结果

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 安装

```bash
# 克隆项目
git clone https://github.com/zhijian521/simple-blog.git
cd simple-blog

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器（自动执行 Git 活动数据获取和文章 ID 检查）
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果

### 构建

```bash
# 生产构建（自动执行 Git 活动数据获取、文章 ID 检查和 sitemap 生成）
npm run build

# 预览生产构建
npm run preview
```

---

## 📝 撰写文章

### 创建文章

在 `docs/` 目录下创建 Markdown 文件：

```bash
docs/
├── category/
│   └── article.md
└── another-article.md
```

图片资源统一放在 `images/` 目录，Markdown 中使用 `/images/xxx.png` 引用。

### Front-matter 配置

```markdown
---
id: a1b2c3d4 # 文章唯一标识（8位字符，可自动生成）
title: 文章标题 # 必需
date: 2025-01-20 # 必需
category: 分类名称 # 可选，从目录路径自动推断
excerpt: 文章简介 # 可选，用于列表展示和搜索
author: 作者名称 # 可选，默认为站点作者
tags: # 可选，用于搜索和分类
  - JavaScript
  - Vue
---

# 文章标题

文章内容...
```

### 自动补全 Front-matter

开发模式下，保存新文章时会自动补全缺失字段：

- ✅ `title` - 从文件名推断
- ✅ `date` - 当前日期
- ✅ `category` - 从目录路径推断
- ✅ `id` - 随机生成 8 位 ID

```bash
# 手动生成文章 ID（如果需要）
npm run ensure-ids
```

### Markdown 语法支持

- 标准 Markdown 语法
- 代码块语法高亮（支持 47+ 编程语言）
- 数学公式（LaTeX）
- 表格、任务列表
- HTML 嵌入（自动净化，防止 XSS）

---

## ⚙️ 配置

### 站点信息

编辑 `config/site.config.ts`：

```typescript
export const SITE_CONFIG = {
  title: '你的博客名称',
  description: '你的博客描述',
  author: '你的名字',
  email: 'your@email.com',
  url: 'https://yourblog.com',
}
```

### 主题颜色

编辑 `app/src/styles/variables.css`：

```css
:root {
  /* 文字颜色 */
  --color-text: #3a3a3a;
  --color-text-light: #666666;

  /* 背景颜色 */
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f5f5;

  /* 主题色 */
  --color-primary: #1a1a1a;
  --color-accent: #4a90e2;

  /* 边框和阴影 */
  --color-border: #e0e0e0;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 评论系统（Giscus）

编辑 `config/giscus.config.ts`：

```typescript
export const GISCUS_CONFIG = {
  repo: 'your-username/your-repo',
  repoId: 'R_kgDO...',
  categoryId: 'DIC_kgDO...',
  theme: 'fro',
  mapping: 'pathname',
  inputPosition: 'bottom',
  lazyLoad: false,
} as const
```

**配置步骤：**

1. 在 GitHub 仓库启用 Discussions
2. 访问 [giscus.app](https://giscus.app) 获取配置参数
3. 安装 [Giscus GitHub App](https://github.com/apps/giscus)
4. 更新配置文件

---

## 🛠️ 可用脚本

| 命令                       | 说明                         |
| -------------------------- | ---------------------------- |
| `npm run dev`              | 启动开发服务器（端口 3000）  |
| `npm run build`            | 生产构建到 `dist/` 目录      |
| `npm run preview`          | 预览生产构建                 |
| `npm run fetch-git`        | 获取 Git 提交活动数据        |
| `npm run ensure-ids`       | 为缺失 ID 的文章生成唯一标识 |
| `npm run generate-sitemap` | 生成 sitemap.xml             |
| `npm run sync-images`      | 同步 images 到 app/public    |
| `npm run lint`             | 代码检查                     |
| `npm run lint:fix`         | 自动修复代码问题             |
| `npm run format`           | 格式化代码                   |
| `npm run format:check`     | 检查代码格式                 |

---

## 📦 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zhijian521/simple-blog)

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动构建和部署

---

## 🏗️ 项目结构

```
simple-blog/
├── docs/                     # Markdown 文章目录
├── images/                   # 文章图片（顶层）
├── app/                      # 应用代码与构建脚本
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── public/               # 静态资源
│   │   └── git-activity.json # Git 活动数据
│   ├── scripts/              # 构建脚本
│   │   ├── fetch-git-activity.ts
│   │   ├── ensure-article-ids.ts
│   │   ├── generate-sitemap.ts
│   │   └── sync-images.ts
│   ├── src/
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # Vue 组件
│   │   │   ├── article/      # 文章相关组件
│   │   │   ├── comments/     # 评论系统
│   │   │   ├── effects/      # Canvas 动画
│   │   │   └── ui/           # 通用 UI 组件
│   │   ├── composables/      # Vue Composables
│   │   ├── config/           # 配置文件
│   │   ├── constants/        # 常量定义
│   │   ├── pages/            # 页面组件
│   │   ├── router/           # 路由配置
│   │   ├── styles/           # 样式文件
│   │   ├── types/            # TypeScript 类型
│   │   ├── utils/            # 工具函数
│   │   └── main.ts           # 应用入口
│   ├── env.d.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── index.html
├── config/                   # 站点/评论配置
│   ├── site.config.ts
│   └── giscus.config.ts
└── vercel.json
```

---

## 🎨 核心功能

### Canvas 动画特效

- **水滴涟漪** - 优雅的水墨风格背景动画
- **雪花飘落** - 响应式雪花数量，适配不同屏幕

### 文章搜索

- `Cmd/Ctrl + K` 全局快捷键
- 多关键词搜索（空格分隔）
- 搜索标题、标签、简介
- 300ms 防抖优化

### PWA 支持

- 离线访问
- 添加到主屏幕
- Service Worker 自动更新
- 预缓存核心资源

### Git 活动展示

- 类似 GitHub 的贡献图
- 最近 30 天提交记录
- 自动获取和更新

---

## 🔒 安全特性

- **XSS 防护** - 使用 DOMPurify 净化 HTML 内容
- **路径遍历防护** - 严格的文章 slug 验证
- **CSP 支持** - 内容安全策略配置
- **HTTPS 强制** - 生产环境强制使用 HTTPS

---

## 📚 技术栈

### 核心

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite 6](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript 5](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vue Router 4](https://router.vuejs.org/) - 官方路由管理器

### 内容处理

- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器
- [Shiki](https://shiki.style/) - 代码语法高亮
- [front-matter](https://github.com/jxom/front-matter) - YAML 元数据解析
- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML 净化

### 功能特性

- [vite-ssg](https://github.com/antfu/vite-ssg) - 静态站点生成
- [vite-plugin-pwa](https://github.com/antfu/vite-plugin-pwa) - PWA 支持
- [Giscus](https://giscus.app) - 评论系统
- [Vercel Analytics](https://vercel.com/analytics) - 网站分析

### 开发工具

- [ESLint](https://eslint.org/) - 代码检查
- [Prettier](https://prettier.io/) - 代码格式化
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript 执行

---

## 🤝 贡献

欢迎贡献 Issue、Pull Request 和代码建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

**提交规范：**

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - 修复 Bug
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建/工具链更新

---

## 📄 许可证

[MIT License](LICENSE) © [耶温](https://github.com/zhijian521)

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Antfu](https://github.com/antfu) - 开源项目和工具
- [Shiki](https://shiki.style/) - 代码语法高亮
- [Giscus](https://giscus.app) - 评论系统

---

## 📮 联系方式

- **作者:** 耶温
- **GitHub:** [@zhijian521](https://github.com/zhijian521)
- **邮箱:** yuwb0521@yeah.net

---

**Made with ❤️ by [耶温](https://github.com/zhijian521)**
