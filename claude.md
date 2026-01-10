# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vite + Vue 3 + TypeScript 的静态博客系统，支持 Markdown 文章管理和 Canvas 动画特效。

## 开发命令

```bash
# 开发模式（端口 3000，自动执行 Git 活动数据获取和文章 ID 检查）
npm run dev

# 生产构建（自动执行 Git 活动数据获取和文章 ID 检查）
npm run build

# 预览生产构建
npm run preview

# 获取 Git 提交活动数据（生成 public/git-activity.json）
npm run fetch-git

# 确保所有文章都有 ID 字段（自动为缺失 ID 的文章生成 8 位 ID）
npm run ensure-ids

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
- **重要**：所有文章数据在应用启动时一次性加载，后续通过 `getArticles()`、`getArticleBySlug()` 和 `getArticleById()` 从缓存读取

**安全机制：**

- `validateSlug()` 函数防止路径遍历攻击（检查 `../`、`./`、`\\` 等模式）
- 无效的 slug 会导致返回 `null` 而不是抛出错误

**文章 ID 管理（双重机制）：**

1. **构建时脚本**：`scripts/ensure-article-ids.js` - 扫描所有文章，为缺失 ID 的文章生成 8 位字母数字 ID
2. **开发时插件**：`src/plugins/blog-watcher.ts` - 自定义 Vite 插件，实时监听 `blogs/` 目录变化，自动为新文件添加 ID 并触发热更新

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

### 样式系统

**关键文件：**

- `src/styles/base.css` - CSS Reset、基础元素样式、移动端优化
- `src/styles/variables.css` - CSS 变量（颜色、字体、间距等）
- `src/styles/mixins.css` - 可复用的样式模式

**移动端优化（已实现）：**

- 全局移除点击高亮：`-webkit-tap-highlight-color: transparent`
- 禁用文本选择：`user-select: none`
- 平滑滚动：`-webkit-overflow-scrolling: touch`

### PWA 支持

**关键文件：** `src/constants/pwa.config.ts`

- 使用 `vite-plugin-pwa` 实现 PWA 功能
- 支持离线访问、安装到桌面等 PWA 特性
- 配置文件定义了 manifest、缓存策略等
- 在 `vite.config.ts` 中注册插件

### Git 活动展示

**关键组件：** `src/components/ui/GitActivityChart.vue`

- 首页展示类似 GitHub 的贡献图
- 数据由 `scripts/fetch-git-activity.cjs` 脚本生成
- 脚本获取最近 30 天的 Git 提交记录
- 数据保存到 `public/git-activity.json`
- 在 `npm run dev` 和 `npm run build` 前自动执行

### 自定义 Vite 插件

**关键文件：** `src/plugins/blog-watcher.ts`

开发时使用的自定义插件，实现博客文章的实时监听和热更新：

- 使用 `chokidar` 监听 `blogs/` 目录下的所有 `.md` 文件
- 检测新文件、修改、删除事件
- 自动为缺少 ID 的文章添加 8 位随机 ID
- 触发客户端全页面热更新（`full-reload`）
- 仅在开发模式（`NODE_ENV=development`）下启用调试日志
- 在 `buildEnd` 钩子中正确关闭监听器，避免内存泄漏

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
4. 使用 `src/composables/common/useCanvasResize.ts` 处理尺寸调整
5. 确保正确清理资源（`cancelAnimationFrame`、移除事件监听器）
6. 在组件中添加详细的文档注释（参考 `InkBackground.vue`）

### 添加新文章

1. 在 `blogs/` 目录下创建 `.md` 文件（支持嵌套文件夹）
2. 添加 YAML front-matter 元数据
3. 文章路径会自动转换为 slug（例如 `blogs/category/article.md` → `category/article`）

### 修改文章数据结构

1. 更新 `src/types/article.d.ts` 中的类型定义
2. 在 `src/utils/markdown.ts` 的 `parseArticle()` 函数中添加字段解析逻辑
3. 更新 `ArticleFrontMatter` 接口以支持 front-matter 中的新字段

### 安全机制

**XSS 防护：**

- 文章详情页使用 `DOMPurify.sanitize()` 净化 HTML 内容
- 使用保守的标签白名单（`ArticleDetailPage.vue:46-77`）
- 禁止 JavaScript 协议链接（`ALLOWED_URI_REGEXP`）
- 禁止 `data-*` 属性（`ALLOW_DATA_ATTR: false`）

**路径遍历防护：**

- `validateSlug()` 函数检查 `../`、`./`、`\\` 等模式（`src/utils/markdown.ts:28-39`）
- 无效的 slug 返回 `null` 而非抛出错误

## 项目开发规范

### 组件组织

```
src/components/
├── effects/      # Canvas 动画特效组件
├── article/      # 文章相关组件（卡片、元数据等）
└── ui/          # 通用 UI 组件（按钮、加载状态等）
```

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

## 重要实现细节

### 文章 ID 处理

- 每篇文章在 front-matter 中必须有唯一的 `id` 字段（8位字母数字随机生成）
- 文章路由使用 ID 作为参数：`/article/:id`
- 文章列表和卡片使用 ID 进行路由跳转
- **双重保障机制**：
  - 构建时运行 `scripts/ensure-article-ids.js` 批量添加 ID
  - 开发时 `blog-watcher` 插件自动为新文件添加 ID
- 手动运行 `npm run ensure-ids` 可为缺失 ID 的文章添加 ID

### 响应式雪花数量

雪花动画根据屏幕宽度自动调整数量：

- Mobile (< 768px): 30 个雪花
- Tablet (768-1024px): 45 个雪花
- Desktop (1024-1280px): 55 个雪花
- Large (>= 1280px): 65 个雪花

配置位置：`src/composables/snowfall/useConfig.ts:23-28`

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

### 应用常量配置

**关键文件：** `src/constants/index.ts`

集中管理应用配置：

- `SITE_CONFIG` - 站点基本信息（标题、描述、作者、ICP 备案、版权信息）
- `ROUTES` - 路由路径常量
- `PAGINATION` - 分页配置
- `GIT_ACTIVITY` - Git 活动图配置（工作日、月份标签、提示框偏移量）
- `pwaOptions` - PWA 配置（从 `pwa.config.ts` 导入）

修改站点信息时，应更新 `SITE_CONFIG` 而非分散在各个文件中。
