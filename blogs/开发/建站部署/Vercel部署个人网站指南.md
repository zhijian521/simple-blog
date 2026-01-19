---
title: 从零开始部署个人网站：Vercel + Name.com + GitHub 指南
date: 2026-01-18
category: 开发/建站部署
description: 详细介绍如何使用 Vercel 免费部署个人网站，通过 Name.com 配置自定义域名，并使用 GitHub 进行版本管理
tags:
  - Vercel
  - 部署
  - 域名
  - GitHub
id: ko1f4cao
---

## 前言

本文介绍如何使用 Vercel 免费部署个人网站，通过 Name.com 配置自定义域名，并使用 GitHub 进行版本管理。整个流程包括：

1. 准备代码并推送到 GitHub
2. 在 Vercel 部署网站
3. 在 Name.com 购买域名
4. 配置自定义域名和 DNS

## 准备工作

需要准备以下账号：

- **GitHub 账号**：代码托管
- **Vercel 账号**：网站部署
- **Name.com 账号**：域名购买

## 第一步：代码推送到 GitHub

### 创建 GitHub 仓库

登录 GitHub，点击右上角 `+` -> `New repository`，填写仓库名称并创建。

### 本地项目初始化

以 Vue 3 + Vite 为例：

```bash
npm create vite@latest my-blog -- --template vue
cd my-blog
npm install

git init
git add .
git commit -m "feat: 初始化项目"
git remote add origin https://github.com/你的用户名/my-blog.git
git push -u origin main
```

## 第二步：在 Vercel 部署

### 登录并导入项目

访问 [vercel.com](https://vercel.com)，使用 GitHub 登录。点击 `Add New` -> `Project`，选择你的仓库。

### 配置构建设置

Vercel 会自动检测项目类型，默认配置如下：

```
Build Command: npm run build
Output Directory: dist
```

点击 `Deploy`，等待 1-2 分钟即可完成部署，获得临时域名：`https://my-blog-xxx.vercel.app`

### 自动部署

推送到 GitHub `main` 分支时，Vercel 会自动构建和部署。

## 第三步：在 Name.com 购买域名

### 搜索域名

访问 [name.com](https://www.name.com)，搜索想要的域名。

### 选择域名后缀

| 后缀   | 价格      | 特点       |
| ------ | --------- | ---------- |
| `.com` | $10-15/年 | 最常用     |
| `.dev` | $12-20/年 | 开发者推荐 |
| `.io`  | $35-50/年 | 科技圈流行 |
| `.xyz` | $1-2/年   | 预算有限   |

### 购买

添加到购物车，选择购买年限，勾选隐私保护（免费），完成支付。

## 第四步：配置自定义域名

### 在 Vercel 添加域名

进入项目 `Settings` -> `Domains`，输入你的域名并添加。

Vercel 会根据域名类型显示需要配置的 DNS 记录，**请按照 Vercel 页面显示的具体值进行配置**：

**根域名（如 yourdomain.com）：**

```
Type: A
Name: @
Value: (从 Vercel 复制，例如 76.76.21.21)
```

**子域名（如 www.yourdomain.com）：**

```
Type: CNAME
Name: www
Value: (从 Vercel 复制，例如 cname.vercel-dns.com)
```

**其他子域名（如 blog.yourdomain.com）：**

```
Type: CNAME
Name: blog
Value: (从 Vercel 复制，例如 cname.vercel-dns.com)
```

## 第五步：配置 DNS 解析

### 在 Name.com 添加 DNS 记录

1. 登录 Name.com -> `My Domains` -> 点击域名 `Manage` -> `DNS Records`
2. **回到 Vercel Domains 页面，复制显示的 DNS 记录值**
3. 在 Name.com 添加对应的 DNS 记录

**如果使用根域名（如 yourdomain.com）：**

```
Type: A
Host: @
Answer: (从 Vercel 复制，例如 76.76.21.21)
TTL: 300 或默认
```

**如果使用 www 子域名（如 www.yourdomain.com）：**

```
Type: CNAME
Host: www
Answer: (从 Vercel 复制，例如 cname.vercel-dns.com)
TTL: 300 或默认
```

**推荐配置（同时支持根域名和 www）：**

| Type  | Host | Answer           | TTL |
| ----- | ---- | ---------------- | --- |
| A     | @    | (从 Vercel 复制) | 300 |
| CNAME | www  | (从 Vercel 复制) | 300 |

### WWW 重定向（可选）

在 Vercel `Domains` 页面，找到 `www` 子域名，编辑选择 `Redirect to` 根域名，这样访问 `www.yourdomain.com` 会自动跳转到 `yourdomain.com`。

## 验证配置

DNS 配置后通常需要 5-30 分钟生效。

### 检查 DNS

```bash
# 替换为你的域名
dig yourdomain.com

# Windows 用户
nslookup yourdomain.com
```

### 在 Vercel 检查

等待 Vercel `Domains` 页面显示 `Valid Configuration`。

### 访问测试

在浏览器访问你的域名：

- `https://yourdomain.com`（根域名）
- `https://www.yourdomain.com`（www 子域名）

## 常见问题

### DNS 配置后无法访问

- 检查 DNS 记录是否正确
  - **务必从 Vercel Domains 页面复制准确的值**
  - 根域名：使用 A 记录，指向 Vercel 显示的 IP
  - 子域名：使用 CNAME 记录，指向 Vercel 显示的域名
- 等待 DNS 生效（通常 10 分钟，最长 48 小时）
- 在 Vercel `Domains` 页面检查域名配置状态
- 清除浏览器 DNS 缓存

### Vercel 显示 "Invalid Configuration"

- 确认 DNS 记录类型正确
  - 根域名（如 `yourdomain.com`）：使用 A 记录
  - 子域名（如 `www.yourdomain.com`）：使用 CNAME 记录
- 确保 DNS 记录的值与 Vercel 显示完全一致（建议直接复制）
- 删除错误的记录后重新添加
- 等待 DNS 传播完成（几分钟到几小时）

### SSL 证书未生效

Vercel 会自动为域名提供 SSL 证书，通常 1-24 小时内生效。

### 部署失败

- 检查 `package.json` 的 `build` 命令
- 确认输出目录配置正确
- 查看 Vercel 部署日志
- 本地运行 `npm run build` 测试

## 进阶配置

### 环境变量

`Settings` -> `Environment Variables` 添加，选择环境后重新部署。

### 自定义 404 页面

在 `public/` 目录创建 `404.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>页面未找到</title>
  </head>
  <body>
    <h1>404 - 页面未找到</h1>
    <a href="/">返回首页</a>
  </body>
</html>
```

### vercel.json 配置

在项目根目录创建 `vercel.json`：

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "statusCode": 301
    }
  ]
}
```

## 费用说明

### Vercel 免费版

- ✅ 无限带宽和站点
- ✅ 自动 SSL
- ✅ 100GB 带宽/月
- ✅ 无限构建
- ❌ 函数执行限制 10 秒

### 域名费用

- 购买：$1-50/年（取决于后缀）
- 隐私保护：免费
- 续费：与购买价格相同

### 总成本

**最低：**

- Vercel：免费
- 域名（.xyz）：$1-2/年

**推荐：**

- Vercel：免费
- 域名（.dev 或 .com）：$10-15/年

## 后续建议

1. **SEO 优化**：配置 sitemap、robots.txt
2. **性能优化**：使用 Vercel Edge Network、图片优化
3. **数据分析**：安装 Vercel Analytics
4. **备份策略**：定期备份 GitHub 仓库和配置

## 参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel 域名配置](https://vercel.com/docs/concepts/projects/domains)
- [Name.com 帮助](https://www.name.com/support)
