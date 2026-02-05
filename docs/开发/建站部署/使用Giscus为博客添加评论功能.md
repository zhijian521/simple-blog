---
title: 使用 Giscus 为网站添加评论功能
date: 2026-01-20
category: 开发/建站部署
description: Giscus 是基于 GitHub Discussions 的轻量级评论系统，完全免费且零维护。本文介绍快速集成方法。
tags:
  - Giscus
  - 评论系统
  - GitHub Discussions
id: qq3fsftw
---

## 前言

Giscus 是基于 GitHub Discussions 的轻量级评论系统，具有以下优势：

- ✅ **完全免费**：无需支付任何费用
- ✅ **零维护成本**：无需管理数据库或服务器
- ✅ **数据自主**：评论存储在自己的 GitHub 仓库中
- ✅ **支持 Markdown**：继承 GitHub 的 Markdown 渲染
- ✅ **多主题支持**：适配不同设计风格

## 快速开始

### 第一步：启用 GitHub Discussions

1. 进入你的博客仓库，点击 `Settings`
2. 在 `Features` 选项卡下，找到 `Discussions`，点击 `Set up discussions`
3. 创建分类（建议创建 `Q&A` 分类用于博客评论）
4. 完成设置并启用功能

### 第二步：安装 Giscus App

访问 [https://github.com/apps/giscus](https://github.com/apps/giscus)，点击 `Install` 并选择你的博客仓库。

### 第三步：获取配置参数并集成

访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)，填写以下信息：

- **仓库**：`username/repository-name`
- **映射方式**：推荐选择 `pathname`（URL 路径）
- **分类**：选择你创建的 `Q&A` 分类
- **主题**：根据博客风格选择

配置完成后，将生成的代码嵌入到需要的地方，例如文章页面底部：

```html
<script
  src="https://giscus.app/client.js"
  data-repo="username/repo"
  data-repo-id="R_kgDO..."
  data-category-id="DIC_kgDO..."
  data-mapping="pathname"
  data-theme="light"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async
></script>
```

## 配置说明

### 主题选择

常用主题推荐：

- `light` - 浅色主题
- `dark` - 深色主题
- `fro` - 清新风格
- `preferred_color_scheme` - 跟随系统

更多主题详见 [Giscus 高级用法](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#theme)。

### 映射方式

| 映射方式   | 说明         | 适用场景         |
| ---------- | ------------ | ---------------- |
| `pathname` | URL 路径     | 博客文章（推荐） |
| `url`      | 完整 URL     | 单页面应用       |
| `title`    | 页面标题     | 文档站点         |
| `specific` | 自定义字符串 | 精确控制         |

**推荐使用 `pathname`**：开发/生产环境自动适配，不依赖完整域名。

## 常见问题

### 评论不显示

检查清单：

1. 仓库是否为公开仓库
2. Discussions 功能是否已启用
3. Giscus App 是否已安装
4. `repoId` 和 `categoryId` 是否正确
5. 是否需要发表第一条评论来创建 Discussion

## 参考资源

- [Giscus 官方网站](https://giscus.app)
- [Giscus GitHub 仓库](https://github.com/giscus/giscus)
- [Giscus 高级用法](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)
