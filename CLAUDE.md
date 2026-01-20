# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目开发指导。

## 项目概述

基于 Vite + Vue 3 + TypeScript 的静态博客系统，支持 Markdown 文章管理、Canvas 动画特效和 PWA 功能。使用 vite-ssg 进行静态站点生成，实现快速的页面加载和良好的 SEO。

## 开发命令

```bash
# 开发模式（端口 3000，自动执行 Git 活动数据获取和文章 ID 检查）
npm run dev

# 生产构建（自动执行 Git 活动数据获取、文章 ID 检查和 sitemap 生成）
npm run build

# 预览生产构建
npm run preview

# 获取 Git 提交活动数据（生成 public/git-activity.json）
npm run fetch-git

# 确保所有文章都有 ID 字段（自动为缺失 ID 的文章生成 8 位 ID）
npm run ensure-ids

# 生成 sitemap.xml
npm run generate-sitemap

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 技术栈

### 核心框架

- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- **Vite 5** - 构建工具和开发服务器
- **TypeScript 5** - 严格模式类型检查
- **Vue Router 4** - 路由管理
- **vite-ssg** - 静态站点生成

### 内容处理

- **markdown-it** - Markdown 解析和渲染
- **Shiki** - 代码语法高亮（支持 47+ 编程语言）
- **front-matter** - YAML 元数据解析
- **DOMPurify** - HTML 净化（XSS 防护）

### 开发工具

- **ESLint** - 代码检查（使用 Flat Config）
- **Prettier** - 代码格式化
- **tsx** - TypeScript 脚本执行

### PWA 和分析

- **vite-plugin-pwa** - PWA 功能支持
- **Vercel Analytics** - 网站分析
- **Vercel Speed Insights** - 性能洞察

## 项目结构

```
simple-blog/
├── blogs/                    # Markdown 文章目录
│   ├── category/            # 分类目录
│   └── article.md           # 文章文件
├── public/                   # 静态资源目录
│   └── git-activity.json    # Git 活动数据
├── scripts/                  # 构建和工具脚本（TypeScript）
│   ├── fetch-git-activity.ts
│   ├── ensure-article-ids.ts
│   └── generate-sitemap.ts
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 组件目录
│   │   ├── article/         # 文章相关组件
│   │   ├── comments/        # 评论系统组件
│   │   ├── effects/         # Canvas 动画特效
│   │   ├── icons/           # SVG 图标组件
│   │   └── ui/              # 通用 UI 组件
│   ├── composables/         # Vue 3 Composables
│   │   ├── common/          # 通用 composables
│   │   ├── ripple/          # 涟漪动画模块
│   │   └── snowfall/        # 雪花动画模块
│   ├── config/              # 配置文件
│   ├── constants/           # 常量定义
│   ├── pages/               # 页面组件
│   ├── plugins/             # Vite 插件
│   ├── router/              # 路由配置
│   ├── styles/              # 样式文件
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── main.ts              # 应用入口
│   └── App.vue              # 根组件
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── eslint.config.js          # ESLint 配置
```

## 核心功能模块

### 文章加载和解析

**关键文件：** `src/utils/markdown.ts`

- 使用 Vite 的 `import.meta.glob` 在构建时导入所有 Markdown 文件
- 模块加载时自动执行 `loadArticles()`，将文章解析并缓存到内存
- 通过 `front-matter` 解析元数据（标题、日期、作者、标签等）
- 使用 `markdown-it` 渲染 Markdown 内容为 HTML
- 使用 Shiki 实现代码语法高亮（支持按需加载语言）
- 文章通过三种方式访问：`getArticles()`、`getArticleBySlug()`、`getArticleById()`

**安全机制：**

- `validateSlug()` 函数防止路径遍历攻击（检查 `../`、`./`、`\\` 等模式）
- 无效的 slug 返回 `null` 而非抛出错误

**代码高亮：**

- 支持语言：`bash`, `javascript`, `typescript`, `vue`, `json`, `html`, `css`, `python`, `java`, `go`, `rust`, `markdown`, `yaml`, `sql`, `dockerfile` 等
- 核心语言在初始化时加载，其他语言按需加载
- 主题：`github-light`

### 文章 front-matter 管理

**双重保障机制：**

1. **构建时脚本**：`scripts/ensure-article-ids.ts` - 扫描所有文章，为缺失字段的文章生成 8 位 ID
2. **开发时插件**：`src/plugins/blog-watcher.ts` - 自定义 Vite 插件，监听 `blogs/` 目录变化，自动补全 front-matter

**自动补全的字段：**

- `title` - 从文件名推断
- `date` - 当前日期（YYYY-MM-DD）
- `category` - 从目录路径推断
- `id` - 8 位随机 ID（小写字母和数字）

**注意：**

- `description` 不自动添加，需要人工编写以确保质量
- 已存在的字段不会被覆盖
- 构建时脚本只处理 ID，开发时插件处理所有字段

**共享工具模块：**

- `src/utils/article-id.ts` - 文章 ID 生成和验证（8 位小写字母和数字）
- `src/utils/scan-articles.ts` - 文章扫描工具（递归扫描 blogs 目录）

### 路由和页面结构

**关键文件：** `src/router/index.ts`

- 首页 `/` - `HomePage.vue`
- 文章列表 `/articles` - `ArticlesPage.vue`
- 文章详情 `/article/:id` - `ArticleDetailPage.vue`（使用文章 ID 作为路由参数）
- 404 页面 `/:pathMatch(.*)*` - `NotFoundPage.vue`

**首页特殊处理：**

- 根组件 `App.vue` 通过 `isHomePage` 判断当前路由
- 首页使用 `100dvh` 固定高度并禁用滚动（解决移动端 100vh 不稳定问题）
- 其他页面正常显示 Footer 组件

**页面加载动画：**

- 使用 `PageLoader` 组件实现页面切换加载动画
- 路由守卫控制加载状态，防止内容闪动

### Canvas 动画系统

**目录结构：** `src/composables/`

两个独立的 Canvas 动画模块：

1. **水滴涟漪** (`src/composables/ripple/`) - `InkBackground.vue`
2. **雪花飘落** (`src/composables/snowfall/`) - `SnowfallEffect.vue`

每个模块采用统一的 Composables 架构：

- `useConfig.ts` - 动画参数配置（粒子数量、速度、大小等）
- `useAnimation.ts` - 动画循环逻辑（`requestAnimationFrame`、状态更新）
- `useEvents.ts` - Canvas 尺寸调整和交互事件

**公共模块：**

- `src/composables/common/useCanvasResize.ts` - 通用的 Canvas 尺寸调整逻辑（防抖、orientationchange 监听）

**Canvas 尺寸处理：**

- 使用父容器的 `clientWidth/clientHeight` 而非 `window.innerWidth/innerHeight`
- 添加 100ms 防抖优化 resize 性能
- 监听 `orientationchange` 事件适配移动端屏幕旋转

**资源清理：**

所有 Canvas 组件必须在 `onUnmounted` 钩子中清理：

1. 调用 `cancelAnimationFrame(animationFrameId)` 停止动画循环
2. 调用事件清理函数移除事件监听器
3. 设置所有引用为 `null` 避免内存泄漏

**响应式雪花数量：**

- Mobile (< 768px): 30 个雪花
- Tablet (768-1024px): 45 个雪花
- Desktop (1024-1280px): 55 个雪花
- Large (>= 1280px): 65 个雪花

### 样式系统

**关键文件：**

- `src/styles/base.css` - CSS Reset、基础元素样式、移动端优化
- `src/styles/variables.css` - CSS 变量（颜色、字体、间距等）
- `src/styles/common.css` - 通用样式（标签、按钮、页面标题等）
- `src/styles/code-block.css` - 代码块样式（配合 Shiki 高亮）
- `src/styles/index.css` - 全局样式入口文件

**移动端优化：**

- 全局移除点击高亮：`-webkit-tap-highlight-color: transparent`
- 禁用文本选择：`user-select: none`
- 平滑滚动：`-webkit-overflow-scrolling: touch`

### PWA 支持

**关键文件：** `src/constants/pwa.config.ts`

- 使用 `vite-plugin-pwa` 实现 PWA 功能
- 支持离线访问、安装到桌面等 PWA 特性
- Service Worker 自动更新策略（`registerType: 'autoUpdate'`）
- 在 `vite.config.ts` 中注册插件

**缓存策略（网络资源优先）：**

1. **HTML 文档** - NetworkFirst
   - 优先从网络获取，确保内容最新
   - 网络失败时使用缓存
   - 缓存时间：1 天，最多 10 个条目

2. **JavaScript 和 CSS** - NetworkFirst
   - 开发时确保获取最新代码
   - 缓存时间：7 天，最多 50 个条目

3. **图片资源** - CacheFirst
   - 优先使用缓存，减少带宽消耗
   - 缓存时间：30 天，最多 60 个条目

4. **字体文件** - CacheFirst
   - 字体文件几乎不变，长期缓存
   - 缓存时间：1 年，最多 10 个条目

5. **API 数据** - NetworkFirst
   - 确保数据最新，10 秒超时后回退到缓存
   - 缓存时间：1 小时，最多 20 个条目

6. **外部 CDN 资源** - StaleWhileRevalidate
   - 平衡性能和新鲜度
   - 立即返回缓存，后台更新
   - 缓存时间：7 天，最多 30 个条目

**预缓存清单：**

- 构建时自动缓存：`**/*.{js,css,html,ico,png,svg,xml,txt,woff2}`
- 确保应用核心资源立即可用

### 评论系统

**关键文件：**

- `src/components/comments/GiscusComments.vue` - Giscus 评论组件
- `src/constants/giscus.ts` - Giscus 配置文件

**功能特性：**

- 基于 GitHub Discussions 的轻量级评论系统
- 完全免费，无需数据库和维护
- 支持 Markdown、代码高亮、数学公式
- 支持回复、反应和通知
- 多主题支持，适配不同设计风格

**快速配置：**

1. **启用 GitHub Discussions**
   - 仓库设置 → Features → 启用 Discussions
   - 创建分类（如：Q&A、General）

2. **安装 Giscus App**
   - 访问 https://github.com/apps/giscus
   - 安装到你的仓库

3. **获取配置参数**
   - 访问 https://giscus.app
   - 填写仓库信息和选择配置
   - 复制生成的参数

4. **更新配置文件**
   ```typescript
   // src/constants/giscus.ts
   export const GISCUS_CONFIG = {
     repo: 'zhijian521/blog-comments',
     repoId: 'R_kgDOMNskgg',
     categoryId: 'DIC_kwDOMNskgs4CgWpW',
     theme: 'fro',
     mapping: 'pathname',
     inputPosition: 'bottom',
     lazyLoad: false,
   } as const
   ```

**映射方式选择：**

| 映射方式   | 说明         | 推荐度 | 使用场景         |
| ---------- | ------------ | ------ | ---------------- |
| `pathname` | URL 路径     | ⭐⭐⭐ | 博客文章（默认） |
| `url`      | 完整 URL     | ⭐⭐   | 包含域名的场景   |
| `title`    | 页面标题     | ⭐     | 简单页面         |
| `specific` | 自定义字符串 | ⭐     | 需手动指定 term  |

**主题选项：**

```typescript
// 浅色主题
;'light' | 'light_high_contrast' | 'light_tritonopia' | 'noborder_light'

// 深色主题
;'dark' | 'dark_high_contrast' | 'dark_dimmed' | 'dark_tritonopia' | 'noborder_dark'

// 特殊主题
;'transparent_high_contrast' | 'preferred_color_scheme' | 'cobalt' | 'fro'
```

完整主题列表：https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#theme

**使用示例：**

```vue
<template>
  <GiscusComments
    v-if="isGiscusConfigured && article"
    :repo="GISCUS_CONFIG.repo"
    :repo-id="GISCUS_CONFIG.repoId"
    :category-id="GISCUS_CONFIG.categoryId"
    :mapping="GISCUS_CONFIG.mapping"
    :theme="GISCUS_CONFIG.theme"
    :input-position="GISCUS_CONFIG.inputPosition"
    :lazy-load="GISCUS_CONFIG.lazyLoad"
  />
</template>

<script setup lang="ts">
import { GISCUS_CONFIG, isGiscusConfigured } from '@/constants/giscus'
import GiscusComments from '@/components/comments/GiscusComments.vue'
</script>
```

**工作原理：**

- 组件挂载时动态加载 Giscus 脚本
- 根据 `mapping` 方式自动匹配或创建 Discussion
- 首次访问自动创建 Discussion（需发表第一条评论）
- 后续访问加载已有评论

**位置：**

- 文章详情页底部（`src/pages/ArticleDetailPage.vue:18-28`）
- 自动添加分隔线区分评论区域

### 文章搜索功能

**关键组件：**

- `src/components/ui/SearchButton.vue` - 搜索按钮（右上角固定）
- `src/components/ui/SearchModal.vue` - 搜索模态框
- `src/utils/search.ts` - 搜索算法

**功能特性：**

- **快捷键支持**：
  - `Cmd/Ctrl + K` - 全局快捷键打开/关闭搜索
  - `Q` - 单独按下 Q 键打开搜索（智能检测输入框焦点，避免打字时误触发）
- **搜索范围**：文章标题、标签、简介（excerpt）
- **性能优化**：
  - 300ms 防抖搜索输入
  - 预转换为小写，减少重复字符串操作（性能提升 60%+）
  - 多关键词支持（空格分隔）
- **用户体验**：
  - 自动聚焦输入框
  - ESC 键关闭
  - 点击遮罩关闭
  - 加载状态、空状态、搜索提示
  - 点击结果自动跳转文章详情页

**重要实现细节：**

- Q 键快捷键使用智能检测：检查 `INPUT`、`TEXTAREA` 和 `contentEditable` 元素，避免用户在表单中打字时误触发
- 搜索结果使用 `RouterLink` 导航，点击后自动关闭模态框
- 使用 `import.meta.glob('/blogs/**/*.md')` **绝对路径**（非相对路径），确保生产构建正常加载文章

### Dock 导航菜单

**关键组件：**

- `src/components/ui/Dock.vue` - macOS 风格 Dock 菜单栏组件
- `src/constants/dock.ts` - Dock 配置文件
- `src/components/icons/` - 图标组件目录

**功能特性：**

- **透明液态玻璃效果**：
  - 使用 `backdrop-filter: blur(20px) saturate(180%)` 实现毛玻璃效果
  - 渐变高光层增强质感
  - 半透明背景（`rgba(255, 255, 255, 0.15)`）
- **悬停动画**：
  - 微妙的向上移动和缩放（`translateY(-3px) scale(1.06)`）
  - 平滑的过渡曲线（`cubic-bezier(0.4, 0, 0.2, 1)`）
  - 图标颜色从浅到深的变化（`rgba(60, 60, 67, 0.5)` → `0.8`）
- **响应式设计**：
  - 桌面端、平板、移动端自适应尺寸
  - 按钮圆角根据屏幕大小调整（避免变成圆形）
  - 移动端减少动画幅度

**按钮配置：**

- **文章列表页**：首页、搜索、列表
- **文章详情页**：首页、搜索、列表、目录（暂无功能）
- **功能实现**：
  - 首页：跳转到 `/`
  - 搜索：打开搜索模态框（使用 `createDockItems` 工厂函数传入动作）
  - 列表：跳转到 `/articles`
  - 目录：暂无功能

**使用方法：**

```typescript
import { createDockItems } from '@/constants/dock'
import { ref } from 'vue'

const showSearch = ref(false)

// 创建 Dock 配置
const dockItems = createDockItems(() => {
  showSearch.value = true
}).articleList // 或 .articleDetail
```

**页面适配：**

- 文章列表页和详情页需要添加 `SearchModal` 组件
- 页面底部 `padding-bottom: 5rem`（桌面端）和 `4rem`（移动端），避免内容被 Dock 遮挡
- Dock 固定在底部，距离底部 `1rem`

### Git 活动展示

**关键组件：** `src/components/ui/GitActivityChart.vue`

- 首页展示类似 GitHub 的贡献图
- 数据由 `scripts/fetch-git-activity.ts` 脚本生成
- 脚本获取最近 30 天的 Git 提交记录
- 数据保存到 `public/git-activity.json`
- 在 `npm run dev` 和 `npm run build` 前自动执行

### SEO 优化

**关键文件：** `src/utils/seo.ts`

- `useArticleSeo()` - 为文章详情页生成 SEO 元数据

**全局 SEO（App.vue）：**

- 完整的 Open Graph 元数据
- Twitter Cards 支持
- 规范链接（canonical URL）
- 结构化数据准备

**Sitemap 生成：**

- `scripts/generate-sitemap.ts` - 自动生成 sitemap.xml
- 包含所有文章、首页、列表页

### 静态站点生成（SSG）

**关键文件：** `src/config/ssg.ts`

- 使用 vite-ssg 进行预渲染
- 自动扫描文章并生成预渲染路由列表
- 包含首页、文章列表和所有文章详情页
- 使用目录结构格式（每个页面生成独立目录和 index.html）

**配置（vite.config.ts）：**

```typescript
ssgOptions: {
  includedRoutes: getIncludedRoutes,
  format: 'directory',
}
```

### 自定义 Vite 插件

**关键文件：** `src/plugins/blog-watcher.ts`

开发时使用的自定义插件，实现博客文章的实时监听和自动补全 front-matter：

**监听功能：**

- 使用 `chokidar` 监听 `blogs/` 目录下的所有 `.md` 文件
- 检测新文件、修改、删除事件
- 触发客户端全页面热更新（`full-reload`）
- 仅在开发模式（`NODE_ENV=development`）下启用调试日志
- 在 `buildEnd` 钩子中正确关闭监听器，避免内存泄漏

**自动补全 front-matter 字段：**

当检测到新文件或文件修改时，自动检查并添加缺失的字段：

1. **title** - 从文件名推断
   - 例如：`Vue实践.md` → `title: Vue实践`

2. **date** - 使用当前日期
   - 格式：`YYYY-MM-DD`
   - 例如：`2025-01-20`

3. **category** - 从完整目录路径推断
   - 例如：`blogs/开发/建站部署/建站说明.md` → `category: 开发/建站部署`
   - 根目录文件不添加 category

4. **id** - 生成 8 位随机 ID（小写字母和数字）
   - 例如：`a3b5c7d9`

5. **description** - 不自动添加
   - 需要人工编写，确保质量

**示例：**

创建新文件 `blogs/开发/Vue3入门.md`，插件自动补全为：

```yaml
---
title: Vue3入门
date: 2025-01-20
category: 开发
id: a3b5c7d9
---
# Vue3 入门教程

这里是文章内容...
```

**控制台输出示例：**

```
[BlogWatcher] 📝 检测到新文件: E:\YevinWork\simple-blog\blogs\开发\Vue3入门.md
[BlogWatcher] ✓ 为 Vue3入门.md 添加字段:
  - title: "Vue3入门"
  - date: 2025-01-20
  - category: 开发
  - id: a3b5c7d9
```

## 类型系统

**关键文件：**

- `src/types/article.d.ts` - `Article` 和 `ArticleFrontMatter` 接口
- `src/types/ripple.d.ts` - 涟漪动画类型
- `src/types/snowflake.d.ts` - 雪花动画类型
- `src/types/git-activity.d.ts` - Git 活动数据类型
- `env.d.ts` - Vite 环境类型扩展（`import.meta.glob`、Vue 模块声明、ImportMetaEnv）

## 工具函数模块

**共享工具模块：**

- `src/utils/article-id.ts` - 文章 ID 生成和验证
  - `generateId()` - 生成 8 位随机 ID（小写字母和数字）
  - `validateId()` - 验证 ID 格式

- `src/utils/scan-articles.ts` - 文章扫描工具
  - `scanArticles()` - 扫描指定目录下的所有 Markdown 文件
  - `scanArticlesWithStats()` - 扫描文章并包含文件统计信息
  - `scanArticleIds()` - 扫描 blogs 目录并提取文章 ID 列表

- `src/utils/markdown.ts` - Markdown 解析和渲染
  - `loadArticles()` - 加载并解析所有 Markdown 文章
  - `getArticles()` - 获取所有文章列表
  - `getArticleBySlug()` - 根据 slug 获取文章
  - `getArticleById()` - 根据 ID 获取文章
  - `highlightCodeBlocks()` - 高亮代码块
  - **重要**：使用 `import.meta.glob('/blogs/**/*.md')` 绝对路径（确保生产构建正常）

- `src/utils/date.ts` - 日期格式化工具
  - `formatDate()` - 格式化日期（完整、简短、年月）

- `src/utils/dompurify.ts` - HTML 净化工具
  - `sanitizeHtml()` - 净化 HTML 内容（防止 XSS）
  - `sanitizeHtmlWithSsr()` - SSR 兼容的净化函数

- `src/utils/seo.ts` - SEO 优化工具
  - `useArticleSeo()` - 为文章详情页生成 SEO 元数据

- `src/utils/search.ts` - 文章搜索工具
  - `searchArticles()` - 搜索文章标题、标签、简介
  - 多关键词支持（空格分隔）
  - 预转换为小写优化性能

## 应用常量配置

**关键文件：** `src/constants/index.ts`

集中管理应用配置：

- `SITE_CONFIG` - 站点基本信息（标题、描述、作者、ICP 备案、版权信息）
- `ROUTES` - 路由路径常量
- `PAGINATION` - 分页配置
- `GIT_ACTIVITY` - Git 活动图配置（工作日、月份标签、提示框偏移量）
- `pwaOptions` - PWA 配置（从 `pwa.config.ts` 导入）

修改站点信息时，应更新 `SITE_CONFIG` 而非分散在各个文件中。

## 添加新功能时的注意事项

### 添加新的 Canvas 动画

1. 在 `src/composables/` 下创建新文件夹
2. 按照现有模块结构创建 `useConfig.ts`、`useAnimation.ts`、`useEvents.ts`
3. 在 `src/components/effects/` 创建对应的 Vue 组件
4. 使用 `src/composables/common/useCanvasResize.ts` 处理尺寸调整
5. 确保正确清理资源（`cancelAnimationFrame`、移除事件监听器）
6. 在组件中添加详细的文档注释（参考 `InkBackground.vue`）

### 添加新文章

**开发模式（推荐）：**

1. 在 `blogs/` 目录下创建 `.md` 文件（支持嵌套文件夹）
2. 添加文章内容（front-matter 可选，插件会自动补全）
3. 保存文件后，`blog-watcher` 插件自动检测并补全以下字段：
   - `title` - 从文件名推断
   - `date` - 当前日期
   - `category` - 从目录路径推断
   - `id` - 随机生成
4. 可选：手动添加或编辑 `description`、`tags` 等字段

**生产构建：**

1. 如果开发时缺少 ID，运行 `npm run ensure-ids` 批量生成
2. 文章路径会自动转换为 slug（例如 `blogs/category/article.md` → `category/article`）

**示例：**

创建文件 `blogs/开发/Vue3实战.md`：

```markdown
# Vue3 实战指南

这里是文章内容...
```

保存后自动补全为：

```yaml
---
title: Vue3实战
date: 2025-01-20
category: 开发
id: a3b5c7d9
---
# Vue3 实战指南

这里是文章内容...
```

### 修改文章数据结构

1. 更新 `src/types/article.d.ts` 中的类型定义
2. 在 `src/utils/markdown.ts` 的 `parseArticle()` 函数中添加字段解析逻辑
3. 更新 `ArticleFrontMatter` 接口以支持 front-matter 中的新字段

### 配置评论系统

**步骤 1：准备 GitHub 仓库**

1. 确保仓库是公开的
2. 仓库设置 → Features → 启用 Discussions
3. 创建至少一个分类（如：Q&A、Announcements）

**步骤 2：安装 Giscus**

1. 访问 https://github.com/apps/giscus
2. 点击 "Install"，选择你的仓库
3. 授予必要权限

**步骤 3：获取配置参数**

1. 访问 https://giscus.app
2. 填写仓库信息（`username/repository-name`）
3. 选择页面 ↔️ discussions 映射关系（推荐选择 `pathname`）
4. 选择 Discussion 分类
5. 复制生成的配置参数

**步骤 4：更新项目配置**

编辑 `src/constants/giscus.ts`：

```typescript
export const GISCUS_CONFIG = {
  repo: 'your-username/your-repo',
  repoId: 'R_kgDO...', // 从 giscus.app 复制
  categoryId: 'DIC_kgDO...', // 从 giscus.app 复制
  theme: 'fro', // 选择合适的主题
  mapping: 'pathname', // 推荐使用 pathname
  inputPosition: 'bottom',
  lazyLoad: false,
} as const
```

**步骤 5：验证配置**

1. 运行 `npm run dev`
2. 访问任意文章详情页
3. 滚动到底部，确认评论区域显示
4. 登录 GitHub 并发表测试评论

**主题推荐：**

| 项目风格 | 推荐主题                 |
| -------- | ------------------------ |
| 水墨风格 | `fro`、`noborder_light`  |
| 简约风格 | `light`                  |
| 暗色系   | `dark`、`dark_dimmed`    |
| 高对比度 | `light_high_contrast`    |
| 自适应   | `preferred_color_scheme` |

**注意事项：**

- 仓库必须是公开的，否则访客无法查看评论
- 每个页面根据 `mapping` 自动创建对应的 Discussion
- 首次访问时需要发表第一条评论来创建 Discussion
- 评论数据存储在 GitHub Discussions 中，可随时管理

### 安全机制

**XSS 防护：**

- 文章详情页使用 `DOMPurify.sanitize()` 净化 HTML 内容
- 使用保守的标签白名单（`ArticleDetailPage.vue`）
- 禁止 JavaScript 协议链接（`ALLOWED_URI_REGEXP`）
- 禁止 `data-*` 属性（`ALLOW_DATA_ATTR: false`）

**路径遍历防护：**

- `validateSlug()` 函数检查 `../`、`./`、`\\` 等模式（`src/utils/markdown.ts`）
- 无效的 slug 返回 `null` 而非抛出错误

## 代码实现要求

### 设计原则

本项目遵循以下核心设计原则，确保代码质量、可维护性和长期可扩展性：

**1. 简单至上（Simplicity First）**

- 代码应该简单、直接、易读
- 避免过度设计（Over-engineering）
- 不为了"可能未来的需求"添加当前不需要的抽象
- 优先选择清晰而非聪明的实现

**2. YAGNI 原则（You Aren't Gonna Need It）**

- 只实现当前需要的功能
- 不为假设的未来需求编写代码
- 避免预防性编程（Preventive programming）

**3. KISS 原则（Keep It Simple, Stupid）**

- 保持代码简单明了
- 避免不必要的复杂性
- 简单的解决方案优于复杂的解决方案

**4. DRY 原则（Don't Repeat Yourself）**

- 避免代码重复
- 提取公共逻辑到函数或 composables
- 但不过度抽象，保持适度

### Vue 3 最佳实践

**组件设计：**

```vue
<script setup lang="ts">
// 优先使用 Composition API 和 <script setup> 语法
// 1. 导入语句放在顶部
import { ref, computed, onMounted } from 'vue'

// 2. 定义 props（使用 TypeScript 类型）
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

// 3. 定义 emits
const emit = defineEmits<{
  update: [value: string]
}>()

// 4. 响应式状态
const isVisible = ref(false)

// 5. 计算属性
const displayTitle = computed(() => props.title.toUpperCase())

// 6. 方法
function handleClick() {
  isVisible.value = true
  emit('update', 'new value')
}

// 7. 生命周期钩子
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

**响应式数据使用：**

```typescript
// ✅ 推荐：使用 ref 定义基本类型
const count = ref(0)
const message = ref('hello')

// ✅ 推荐：使用 reactive 定义对象
const user = reactive({
  name: 'John',
  age: 30,
})

// ❌ 避免：解构 reactive 会丢失响应性
const { name } = user // name 不是响应式的

// ✅ 推荐：使用 toRefs 解构
const { name } = toRefs(user) // name 是响应式的
```

**Composables 设计：**

```typescript
// src/composables/useFeature.ts
import { ref, computed } from 'vue'

export function useFeature(initialValue: number) {
  // 1. 定义状态
  const count = ref(initialValue)

  // 2. 定义计算属性
  const double = computed(() => count.value * 2)

  // 3. 定义方法
  function increment() {
    count.value++
  }

  // 4. 返回公共接口
  return {
    count,
    double,
    increment,
  }
}
```

### TypeScript 最佳实践

**类型定义：**

```typescript
// ✅ 推荐：使用 interface 定义对象形状
interface User {
  id: string
  name: string
  age: number
}

// ✅ 推荐：使用 type 定义联合类型、交叉类型
type Status = 'pending' | 'success' | 'error'
type ID = string | number

// ✅ 推荐：为函数参数和返回值添加类型
function getUserById(id: string): User | null {
  // 实现
  return null
}

// ✅ 推荐：使用泛型增强复用性
function createList<T>(items: T[]): List<T> {
  return { items }
}
```

**类型断言：**

```typescript
// ❌ 避免：使用 as 断言
const user = data as User

// ✅ 推荐：使用类型守卫
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value
}

// ✅ 推荐：使用类型缩小
if (isUser(data)) {
  console.log(data.name) // TypeScript 知道这是 User
}
```

**严格类型检查：**

```typescript
// ✅ 启用严格模式
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}

// ✅ 使用 unknown 代替 any
function processValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return null
}
```

### 代码组织规范

**文件命名：**

```
// 组件文件：PascalCase
UserProfile.vue
SearchModal.vue

// 工具文件：kebab-case
format-date.ts
article-id.ts

// Composable：use 前缀，camelCase
useUserInfo.ts
useCanvasResize.ts

// 类型文件：.d.ts 后缀
article.d.ts
user.d.ts

// 常量文件：kebab-case
route-config.ts
api-endpoints.ts
```

**目录结构：**

```
src/
├── components/          # 按功能分组
│   ├── article/        # 文章相关组件
│   │   ├── ArticleCard.vue
│   │   └── ArticleMeta.vue
│   └── ui/             # 通用 UI 组件
│       ├── Button.vue
│       └── Modal.vue
├── composables/        # 按功能分组
│   ├── useAuth.ts
│   └── useApi.ts
├── utils/             # 按功能分组
│   ├── date.ts
│   └── string.ts
└── types/             # 按领域分组
    ├── user.d.ts
    └── article.d.ts
```

**导入顺序：**

```typescript
// 1. Vue 相关
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 第三方库
import { debounce } from 'lodash-es'

// 3. 类型导入
import type { User } from '@/types/user'

// 4. 本地组件
import UserProfile from '@/components/UserProfile.vue'

// 5. 本地工具函数
import { formatDate } from '@/utils/date'

// 6. 本地常量
import { API_URL } from '@/constants/api'
```

### 性能优化实践

**计算属性缓存：**

```typescript
// ✅ 推荐：使用 computed 缓存计算结果
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// ❌ 避免：在模板中直接使用方法调用
// <template>
//   {{ getFullName() }} // 每次渲染都会重新计算
// </template>
```

**防抖和节流：**

```typescript
import { useDebounceFn } from '@vueuse/core'

// ✅ 推荐：使用 VueUse 的防抖函数
const debouncedSearch = useDebounceFn((query: string) => {
  performSearch(query)
}, 300)
```

**组件懒加载：**

```typescript
// ✅ 推荐：路由级别的懒加载
const routes = [
  {
    path: '/article/:id',
    component: () => import('@/pages/ArticleDetailPage.vue'),
  },
]

// ✅ 推荐：组件级别的懒加载
const HeavyComponent = defineAsyncComponent(() => import('@/components/HeavyComponent.vue'))
```

**列表渲染优化：**

```vue
<template>
  <!-- ✅ 推荐：为列表项添加唯一的 key -->
  <article v-for="article in articles" :key="article.id" class="article-card">
    {{ article.title }}
  </article>
</template>
```

### 错误处理规范

**异步错误处理：**

```typescript
// ✅ 推荐：使用 try-catch 捕获错误
async function loadArticle(id: string) {
  try {
    const article = await getArticleById(id)
    return article
  } catch (error) {
    console.error('Failed to load article:', error)
    // 返回默认值或抛出业务错误
    throw new Error(`Article ${id} not found`)
  }
}

// ✅ 推荐：在调用处处理错误
async function handleLoadArticle(id: string) {
  try {
    const article = await loadArticle(id)
    currentArticle.value = article
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error'
  }
}
```

**类型安全的错误处理：**

```typescript
// ✅ 定义错误类型
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ✅ 使用类型守卫区分错误类型
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

async function handleApiCall() {
  try {
    await fetchData()
  } catch (error) {
    if (isApiError(error)) {
      console.error(`API Error: ${error.code} - ${error.message}`)
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
  }
}
```

### 测试友好的代码设计

**依赖注入：**

```typescript
// ❌ 紧耦合：难以测试
function fetchArticles() {
  return fetch('/api/articles').then(res => res.json())
}

// ✅ 松耦合：易于测试
function fetchArticles(httpClient: typeof fetch = fetch) {
  return httpClient('/api/articles').then(res => res.json())
}

// 测试时可以注入 mock
function testFetchArticles() {
  const mockFetch = vi.fn().mockResolvedValue({
    json: async () => [{ id: '1', title: 'Test' }],
  })
  fetchArticles(mockFetch)
}
```

**Composables 可测试性：**

```typescript
// ✅ 返回纯函数，便于测试
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => (count.value = initialValue)

  return {
    count: readonly(count),
    increment,
    decrement,
    reset,
  }
}
```

### 代码审查清单

在提交代码前，请确保：

- [ ] 代码符合 TypeScript 严格模式要求
- [ ] 没有 `any` 类型（除非有明确注释说明原因）
- [ ] 没有 `console.log` 调试代码（开发时可以，提交前移除）
- [ ] 组件使用 `<script setup>` 语法
- [ ] 响应式状态使用正确的 API（ref 或 reactive）
- [ ] 异步操作有错误处理
- [ ] 列表渲染有唯一的 key
- [ ] 没有未使用的导入和变量
- [ ] 函数和变量命名清晰、语义化
- [ ] 复杂逻辑有注释说明"为什么"
- [ ] 没有重复代码（提取到函数或 composable）
- [ ] 遵循单一职责原则

### 反模式示例

**避免的反模式：**

```typescript
// ❌ 反模式 1：过度使用 watch
const searchTerm = ref('')
const results = ref([])

watch(searchTerm, async newTerm => {
  results.value = await search(newTerm)
})

// ✅ 正确：使用 computed + watchEffect
const results = ref([])
watchEffect(async () => {
  if (searchTerm.value) {
    results.value = await search(searchTerm.value)
  }
})

// ❌ 反模式 2：在模板中直接使用复杂逻辑
// <template>
//   {{ articles.filter(a => a.published).sort((a, b) => b.date - a.date) }}
// </template>

// ✅ 正确：提取到计算属性
const publishedArticles = computed(() =>
  articles.value.filter(a => a.published).sort((a, b) => b.date - a.date)
)

// ❌ 反模式 3：过早优化和抽象
class AbstractFactoryProducer {
  // 复杂的抽象层，实际不需要
}

// ✅ 正确：简单直接的实现
function createUser(data: UserData) {
  return { id: generateId(), ...data }
}

// ❌ 反模式 4：深层嵌套的条件
if (user) {
  if (user.profile) {
    if (user.profile.settings) {
      if (user.profile.settings.notifications) {
        // 处理通知设置
      }
    }
  }
}

// ✅ 正确：早期返回
if (!user?.profile?.settings?.notifications) {
  return
}
// 处理通知设置

// ❌ 反模式 5：魔法数字和字符串
function calculatePrice(price: number) {
  return price * 1.1 + 5 // 1.1 和 5 是什么？
}

// ✅ 正确：使用命名常量
const TAX_RATE = 0.1
const SHIPPING_FEE = 5

function calculatePrice(price: number) {
  return price * (1 + TAX_RATE) + SHIPPING_FEE
}
```

### 文档同步更新要求

**核心原则：代码与文档保持同步**

本项目要求所有代码修改都必须同步更新相关文档，确保 `CLAUDE.md` 始终反映项目的真实状态。

**需要更新文档的场景：**

1. **新增功能或模块**
   - 更新"核心功能模块"章节，添加功能说明
   - 更新"项目结构"，如果新增了目录或文件
   - 更新"技术栈"，如果引入了新依赖

2. **修改现有功能**
   - 更新对应功能的实现细节说明
   - 更新代码示例（如果有）
   - 更新配置说明（如果修改了配置）

3. **重构代码**
   - 更新文件路径引用
   - 更新函数/组件名称
   - 更新实现逻辑说明

4. **修改配置**
   - 更新 Vite 配置说明
   - 更新 TypeScript 配置
   - 更新 ESLint/Prettier 配置
   - 更新常量定义

5. **添加新组件**
   - 更新"组件组织"章节
   - 添加组件功能说明
   - 添加使用示例（如果适用）

6. **添加新工具函数**
   - 更新"工具函数模块"章节
   - 添加函数签名和用途说明

7. **修改类型定义**
   - 更新"类型系统"章节
   - 添加新类型说明

**文档更新检查清单：**

在提交代码前，检查是否需要更新以下部分：

- [ ] 项目结构（是否有新增/删除的文件或目录）
- [ ] 核心功能模块（功能实现是否有变更）
- [ ] 技术栈（是否引入新依赖）
- [ ] 开发命令（是否新增脚本命令）
- [ ] 配置说明（Vite、TypeScript、ESLint 等）
- [ ] 类型系统（是否新增类型定义）
- [ ] 工具函数模块（是否新增工具函数）
- [ ] 应用常量配置（是否修改常量）
- [ ] 重要实现细节（是否有关键实现变更）

**文档更新流程：**

```bash
# 1. 完成代码修改
# 2. 检查是否需要更新 CLAUDE.md
# 3. 运行代码格式化和检查
npm run format
npm run lint:fix
# 4. 更新 CLAUDE.md 相关章节
# 5. 提交变更
git add CLAUDE.md
git commit -m "docs: 更新 XXX 功能文档"
```

**文档编写规范：**

- 使用清晰简洁的语言
- 提供具体的文件路径和行号（如：`src/utils/markdown.ts:123`）
- 包含代码示例（使用正确的语法高亮）
- 标注"重要"和"注意"事项
- 保持文档结构的一致性

**示例：添加新组件后的文档更新**

````markdown
### 组件组织

**UI 组件说明：**

- `Dock.vue` - macOS 风格 Dock 菜单
- `SearchModal.vue` - 搜索模态框
- `NewFeature.vue` - 新功能组件（新增） ← 添加说明
  - 位置：`src/components/ui/NewFeature.vue`
  - 用途：实现XXX功能
  - 使用方法：见下方示例

**使用示例：**

```vue
<script setup lang="ts">
import NewFeature from '@/components/ui/NewFeature.vue'
</script>

<template>
  <NewFeature :data="items" @update="handleUpdate" />
</template>
```
````

````

**违反文档同步要求的后果：**

- 代码审查将被拒绝
- 导致文档与代码不一致
- 增加后续维护成本
- 影响团队协作效率

**工具辅助：**

可以使用以下命令检查文档是否需要更新：

```bash
# 查看最近修改的文件
git diff --name-only HEAD~5

# 检查是否修改了关键文件
git diff HEAD~5 CLAUDE.md
````

## 项目开发规范

### 组件组织

```
src/components/
├── effects/      # Canvas 动画特效组件
├── article/      # 文章相关组件（卡片、元数据等）
├── comments/     # 评论系统组件
└── ui/          # 通用 UI 组件（按钮、加载状态、搜索等）
```

**UI 组件说明：**

- `Dock.vue` - macOS 风格 Dock 菜单（透明液态玻璃效果）
- `SearchButton.vue` - 搜索按钮（固定在右上角）
- `SearchModal.vue` - 搜索模态框（全屏遮罩）
- `LatestArticles.vue` - 最新文章列表（固定在页面底部）
- `PageLoader.vue` - 页面加载动画组件
- `Footer.vue` - 页脚组件

**Comments 组件说明：**

- `GiscusComments.vue` - Giscus 评论系统
  - 位置：`src/components/comments/GiscusComments.vue`
  - 用途：为文章提供基于 GitHub Discussions 的评论功能
  - 配置：`src/constants/giscus.ts`

### 代码质量

- **简单易懂**：代码逻辑清晰，避免过度设计
- **结构清晰**：模块职责明确，层次分明
- **可维护性**：便于后续扩展和维护
- **模块化实践**：合理划分功能模块，保持模块间低耦合、高内聚

### 注释规范

- 为重要的模块、类、复杂方法添加清晰的注释
- 减少非必要注释，代码应该是自解释的
- 注释应说明"为什么"而非"是什么"

### Git 提交规范

- 遵循 Conventional Commits 规范：`<type>: <subject>`
  - type: feat, fix, docs, style, refactor, test, chore 等
  - subject: 简洁描述，不超过 50 字符
- **禁止自动提交**：除非用户明确要求，否则不要执行 git commit
- **禁止 AI 相关内容**：
  - 提交信息中**严禁**包含任何 AI 工具相关信息
  - **禁止**添加 `Co-Authored-By: Claude` 等 AI 合作署名
  - **禁止**包含 "Generated with Claude Code" 等类似字样
  - 提交信息应保持简洁，只描述变更内容本身
- **提交前确认**：提交前应展示改动内容，等待用户确认

### 代码检查和格式化

**ESLint 规则（使用 Flat Config）：**

- Vue 组件规则：禁用多单词组件名要求、禁止 `v-html`
- TypeScript 规则：警告 `any` 类型、未使用变量（忽略下划线前缀）
- 生产环境：警告 console、禁止 debugger
- 开发环境：允许 console 和 debugger

**Prettier 配置：**

- 使用默认配置
- 运行 `npm run format` 格式化所有文件
- 运行 `npm run format:check` 检查格式

## 重要实现细节

### 文章 ID 处理

- 每篇文章在 front-matter 中必须有唯一的 `id` 字段（8位字母数字随机生成）
- 文章路由使用 ID 作为参数：`/article/:id`
- 文章列表和卡片使用 ID 进行路由跳转
- **双重保障机制**：
  - 构建时运行 `scripts/ensure-article-ids.ts` 批量添加 ID
  - 开发时 `blog-watcher` 插件自动为新文件添加 ID
- 手动运行 `npm run ensure-ids` 可为缺失 ID 的文章添加 ID

### TypeScript 配置

- 严格模式已启用（`strict: true`）
- 路径别名：`@/*` 映射到 `src/*`（在 `tsconfig.json` 和 `vite.config.ts` 中配置）
- 未使用变量和参数会报错（`noUnusedLocals`、`noUnusedParameters`）
- 使用 `@/` 导入模块而非相对路径（例如：`@/components/ui/Footer.vue`）

### Vite 配置要点

**关键文件：** `vite.config.ts`

- 开发服务器端口：3000，启动时自动打开浏览器
- 路径别名：`@` 映射到 `src` 目录
- 已注册插件：
  - `@vitejs/plugin-vue` - Vue 3 单文件组件支持
  - `vite-plugin-pwa` - PWA 功能支持
  - `blogWatcher()` - 自定义博客文章监听插件
- 构建输出目录：`dist/`
- SSG 配置：使用目录格式预渲染

**import.meta.glob 使用注意：**

- 必须使用**绝对路径**：`import.meta.glob('/blogs/**/*.md')`
- **禁止使用相对路径**：`import.meta.glob('../../blogs/**/*.md')` 会在生产构建中失败
- 这是 Vite 的已知行为，绝对路径确保在开发和生产环境都能正确解析

### 页面加载动画

- 使用 `PageLoader` 组件实现加载动画
- 路由守卫（`beforeEach`、`afterEach`）控制加载状态
- 组件 `onMounted` 处理页面刷新场景
- 加载期间强制显示滚动条，防止内容闪动

### 性能优化

- 代码高亮按需加载语言
- 搜索功能预转换为小写（减少重复字符串操作）
- Canvas resize 使用防抖优化
- 文章数据在应用启动时一次性加载到内存
- 使用 vite-ssg 预渲染提升首屏加载速度

## 第三方服务集成

### Vercel Analytics

- 文件：`@vercel/analytics`
- 组件：`Analytics`（在 `App.vue` 中注册）
- 提供网站访问数据统计

### Vercel Speed Insights

- 文件：`@vercel/speed-insights`
- 组件：`SpeedInsights`（在 `App.vue` 中注册）
- 提供性能洞察和优化建议

## 常见问题

### 文章加载失败

1. 检查文章是否包含有效的 `id` 字段
2. 运行 `npm run ensure-ids` 为缺失 ID 的文章添加 ID
3. 检查文件路径是否正确（避免特殊字符）

### 代码高亮不生效

1. 检查代码块语言是否在支持列表中
2. 查看浏览器控制台是否有错误
3. 确保 Shiki 高亮器已正确初始化

### PWA 不工作

1. 检查是否在 HTTPS 或 localhost 环境下运行
2. 查看Service Worker 是否已注册（DevTools → Application → Service Workers）
3. 清除缓存并重新构建

### 构建失败

1. 检查 TypeScript 类型错误
2. 运行 `npm run lint` 检查代码问题
3. 确保所有依赖已正确安装

## 参考资源

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [vite-ssg 文档](https://github.com/antfu/vite-ssg)
- [Shiki 文档](https://shiki.style/)
- [DOMPurify 文档](https://github.com/cure53/DOMPurify)
