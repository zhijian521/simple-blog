# Simple Blog

一个基于 Astro、Markdown 和静态生成的个人博客。

## 目录结构

- `app/`：Astro 应用代码、页面、样式和依赖配置。
- `docs/notes/`：Markdown 笔记，构建时由 `app/src/lib/notes.js` 读取。
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
npm run build
```

静态文件会输出到 `app/dist/`，可以直接部署到支持静态文件的服务器。

## 内容

- 文章放在 `docs/notes/*.md`，文件名或 `slug` 字段决定文章地址。
- 图片和视频分别放在 `docs/images/`、`docs/videos/`，构建时会同步到静态资源目录。
- 首页、文章详情和归档页位于 `app/src/pages/`。
- 正式部署时在 `app/.env` 设置 `SITE_URL`，用于 canonical 和结构化数据。

### front matter 字段

同时兼容两种写法，Obsidian 导出的文件可以原样放入 `docs/notes/`：

| 用途 | 站点写法 | Obsidian 导出写法 |
| --- | --- | --- |
| 标题 | `title` | `title` |
| 地址 | `slug`（缺省时用文件名） | `slug` |
| 摘要 | `description` | `summary` |
| 日期 | `date` | `publishedAt` |
| 标签 | `tags` | `tags` |
| 分类 | — | `category` |
| 封面 | — | `coverImage` |
| 状态 | `status`，非 `published` 不生成 | `status` |

其他约定：

- 正文里的图片可以写成相对路径 `images/xxx.webp`，构建时会自动改写为 `/images/xxx.webp`。
- `- [ ]` / `- [x]` 任务清单会渲染成勾选框。
- 正文中的 `---` 按「纯留白」处理，不画横线。

建议使用 Node 24：

```bash
nvm use 24.11.1
```
