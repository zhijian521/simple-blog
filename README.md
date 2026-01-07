# Simple Blog (Nuxt + @nuxt/content)

一个基于 Nuxt 3 和 @nuxt/content 的简洁博客示例，支持 Markdown 内容渲染与基础布局。

## 开发与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建（SSR）
npm run build

# 静态站点生成（SSG）
npm run generate

# 预览生产构建
npm run preview
```

默认地址：`http://localhost:3000`

**注意**：项目已配置为 SSG（静态站点生成）模式，使用 `npm run generate` 可生成完全静态的站点，适合部署到静态托管服务（如 Vercel、Netlify、GitHub Pages 等）。

## 目录结构（摘录）

- `app/layouts/default.vue`：全局布局（导航、页脚、基础样式）
- `app/pages/[...slug].vue`：内容页面渲染，含加载/错误处理
- `app/composables/usePageContent.ts`：内容获取与状态管理
- `app/components/Alert.vue` / `IconSearch.vue`：UI 组件
- `content/`：Markdown 内容源目录（可在此添加文章内容）
- `nuxt.config.ts`：Nuxt 配置（含 favicon、SSG 预渲染配置）
- `cursor.md`：团队开发与提交规范

## 提交规范

遵循 Conventional Commits，详情见 `cursor.md`。示例：

- `feat(config): add favicon configuration`
- `fix(router): resolve navigation issue`
- `docs(readme): update installation guide`
- `chore: add project files and initial structure`

## 开发约定（摘要）

完整规范见 `cursor.md`，核心要点：

- 资深开发规范：可维护、易扩展、DRY、单一职责
- 模块化：公共逻辑抽到 `composables/`、`utils/` 等
- 最佳实践：Vue 3 组合式 API、TypeScript、a11y 与语义化
- 注释策略：只为重要模块/复杂逻辑写“why”型注释，避免冗余

## 常见命令

- `npm run dev`：本地开发
- `npm run build`：生产构建（SSR）
- `npm run generate`：静态站点生成（SSG）
- `npm run preview`：预览生产构建
