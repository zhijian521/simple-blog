# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vite + Vue 3 + TypeScript 的静态博客系统，支持 Markdown 文章管理和 Canvas 动画特效。

## 开发命令

```bash
# 开发模式（端口 3000）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 核心架构

### 文章加载和解析机制

**关键文件：** `src/utils/markdown.ts`

- 使用 Vite 的 `import.meta.glob` 在构建时导入所有 Markdown 文件（`blogs/**/*.md`）
- 在模块加载时自动执行 `loadArticles()`，将所有文章解析并缓存到内存
- 文章通过 `front-matter` 解析元数据（标题、日期、作者等）
- 使用 `markdown-it` 渲染 Markdown 内容为 HTML
- **重要**：所有文章数据在应用启动时一次性加载，后续通过 `getArticles()` 和 `getArticleBySlug()` 从缓存读取

**安全机制：**
- `validateSlug()` 函数防止路径遍历攻击（检查 `../`、`./`、`\\` 等模式）
- 无效的 slug 会导致返回 `null` 而不是抛出错误

### 路由和页面结构

**关键文件：** `src/router/index.ts`

- 首页 `/` - `HomePage.vue`
- 文章列表 `/articles` - `ArticlesPage.vue`
- 文章详情 `/article/:slug(.*)` - `ArticleDetailPage.vue`（支持嵌套路径）
- 404 页面 `/:pathMatch(.*)*` - `NotFoundPage.vue`

**首页特殊处理：**
- 根组件 `App.vue` 通过 `isHomePage` 判断当前路由
- 首页使用 `100dvh` 固定高度并禁用滚动（解决移动端 100vh 不稳定问题）
- 其他页面正常显示 Footer 组件

### Canvas 动画系统

**目录结构：** `src/composables/`

两个独立的 Canvas 动画模块：
1. **水滴涟漪** (`src/composables/ripple/`) - `InkBackground.vue`
2. **雪花飘落** (`src/composables/snowfall/`) - `SnowfallEffect.vue`

每个模块采用统一的 Composables 架构：
- `useConfig.ts` - 动画参数配置（粒子数量、速度、大小等）
- `useAnimation.ts` - 动画循环逻辑（`requestAnimationFrame`、状态更新）
- `useEvents.ts` - Canvas 尺寸调整和交互事件

**Canvas 尺寸处理：**
- 使用父容器的 `clientWidth/clientHeight` 而非 `window.innerWidth/innerHeight`
- 添加 100ms 防抖优化 resize 性能
- 监听 `orientationchange` 事件适配移动端屏幕旋转

### 样式系统

**关键文件：**
- `src/styles/base.css` - CSS Reset、基础元素样式、移动端优化
- `src/styles/variables.css` - CSS 变量（颜色、字体、间距等）
- `src/styles/mixins.css` - 可复用的样式模式

**移动端优化（已实现）：**
- 全局移除点击高亮：`-webkit-tap-highlight-color: transparent`
- 禁用文本选择：`user-select: none`
- 平滑滚动：`-webkit-overflow-scrolling: touch`

## 类型系统

**关键文件：**
- `src/types/article.d.ts` - `Article` 和 `ArticleFrontMatter` 接口
- `src/types/ripple.d.ts` - 涟漪动画类型
- `src/types/snowflake.d.ts` - 雪花动画类型
- `src/vite-env.d.ts` - Vite 环境类型扩展（`import.meta.glob`、Vue 模块声明）

## 添加新功能时的注意事项

### 添加新的 Canvas 动画
1. 在 `src/composables/` 下创建新文件夹
2. 按照现有模块结构创建 `useConfig.ts`、`useAnimation.ts`、`useEvents.ts`
3. 在 `src/components/effects/` 创建对应的 Vue 组件
4. 确保正确清理资源（`cancelAnimationFrame`、移除事件监听器）

### 添加新文章
1. 在 `blogs/` 目录下创建 `.md` 文件（支持嵌套文件夹）
2. 添加 YAML front-matter 元数据
3. 文章路径会自动转换为 slug（例如 `blogs/category/article.md` → `category/article`）

### 修改文章数据结构
1. 更新 `src/types/article.d.ts` 中的类型定义
2. 在 `src/utils/markdown.ts` 的 `parseArticle()` 函数中添加字段解析逻辑
3. 更新 `ArticleFrontMatter` 接口以支持 front-matter 中的新字段

## 项目开发规范

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
- **纯人工提交信息**：提交日志中不包含任何 AI 相关内容（如 "Generated with Claude Code" 等）
- **提交前确认**：提交前应展示改动内容，等待用户确认
