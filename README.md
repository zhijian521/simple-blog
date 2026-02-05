# Simple Blog

一个基于 Vue 3 + Vite + TypeScript 的静态博客项目，支持 Markdown 文章、全文搜索、Giscus 评论、PWA 与 SEO。

## 亮点
- Markdown 文章与自动 front-matter 补全
- 文章列表/详情页、标签与分类
- 搜索与快捷键
- Giscus 评论系统
- PWA 离线与自动更新
- 自动生成 sitemap

## 快速开始
```bash
npm install
npm run dev
```

构建与预览：
```bash
npm run build
npm run preview
```

## 内容与资源
- 文章放在 `docs/`
- 图片放在 `images/`，Markdown 中使用 `/images/xxx.png`

## 站点配置
- 站点信息：`config/site.config.ts`
- Giscus 配置：`config/giscus.config.ts`

## 目录结构（概览）
```
simple-blog/
├── docs/        # 文章
├── images/      # 图片
├── app/         # 应用与构建脚本
├── config/      # 站点与评论配置
└── vercel.json  # Vercel 配置
```

更详细的说明与使用指南请查看：`app/README.md`
