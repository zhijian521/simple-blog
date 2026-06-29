---
title: 前端开发者 SEO 完全指南
slug: seo-guide
status: published
summary: "本篇文章覆盖基础优化、性能指标与结构化数据。
结合内容站、电商、SPA 与 SaaS 场景，讲清真实项目中的 SEO 关键问题。
同时梳理 Google 已确认有效与无效的优化策略，帮助快速建立系统认知。"
category: 技术笔记
tags: [SEO, 性能优化, 前端开发]
publishedAt: 2025-05-09 00:00:00
coverImage: images/cover-44.webp
---

关于封面图，这张图展示了国内外主流搜索引擎的市场占有率对比。

从结果可以看到，搜索入口在不同地区呈现出明显的结构差异——这直接决定了 SEO 策略并不是“统一标准”，而是与流量生态强绑定的工程问题。

> 流量生态 = 用户获取信息的入口结构 + 平台分发规则 + 内容竞争环境的组合系统


---

回到SEO优化来说，SEO 是前端工程师的基础能力，而不是营销附属技能。

本文从真实项目出发，系统讲解前端 SEO 的完整实现路径，包括：

- 通用基础：Title、URL、Canonical、结构化数据
- 性能核心：Core Web Vitals（LCP / INP / CLS）
- 三大典型场景：内容站、电商、SPA
- SaaS 与多语言站点优化策略
- 图片、视频、链接体系优化
- Google 官方已明确“无效”的 SEO 误区

适用于：前端工程师 / 独立开发者 / 技术型产品站点

---

# SEO 的本质：不是“优化”，是“可见性工程”
SEO 的底层逻辑只有一句话：

> 让页面可以被发现、被理解、被信任

搜索引擎做三件事：

```txt
发现 → 渲染 → 索引
```
前端能控制的，是“发现”和“理解”。

不论什么类型的项目，这些是搜索引擎收录你的底线。


##  实例：一个页面为什么没被收录？

假设你部署了一个博客：

```
https://example.com/blog/
```

但 Google 搜不到。
```
site:https://example.com/blog/
```

排查顺序应该是：

### 错误优先级（真实工程顺序）

1. robots.txt 是否屏蔽
    - 如果 robots.txt 中通过 Disallow 禁止了页面或目录抓取，搜索引擎将无法访问页面内容，自然也无法完成收录。
2. 是否 `noindex`
    -    页面存在 `<meta name="robots" content="noindex">` 或响应头中的 `X-Robots-Tag: noindex` 时，搜索引擎会主动忽略该页面，不将其加入索引库。
3. 是否没有任何内链
    -    如果页面没有导航、分类、推荐文章等内部链接入口，就容易成为「孤岛页面」，搜索引擎难以发现，从而影响收录。
4. 是否 sitemap 未提交
    -    Sitemap 能帮助搜索引擎快速发现网站中的重要页面。如果未生成、未提交或未及时更新，页面被发现和收录的速度可能会变慢。
5. 是否 JS 渲染后才出现内容
    -    当页面内容完全依赖 JavaScript 动态生成时，部分搜索引擎可能无法及时获取完整内容，导致抓取和收录效果不佳。

# 第一部分：页面骨架 - SEO 的真正核心

Google 官方指南的表述：

> Unique, descriptive `<title>` elements and helpful meta descriptions help users quickly identify the best result for their goal.

## 1. Title：搜索结果的第一入口

`<title>` 是搜索引擎判断页面主题的重要信号，同时也是搜索结果中最显眼的内容。

### 推荐规范
- 长度控制在 50 ~ 60 个字符（英文）或 25~35 个中文字符
- 核心关键词尽量靠前
- 每个页面保持唯一
- 准确描述页面内容
- 避免关键词堆砌

```
核心关键词 + 补充说明 + 品牌名称
```

### 推荐结构：
```html
<!-- 内容站 -->
<title>前端 SEO 完整指南：从基础到实战</title>
<!-- 电商 -->
<title>iPhone 17 Pro 256GB 深空黑</title>
<!-- SaaS -->
<title>在线项目管理工具 - 团队协作平台</title>
<!-- SPA 页面 -->
<title>性能优化相关文章 | 执剑博客</title>
```

### 错误示例(❌)：

```html
<!-- 过于宽泛 -->
<title>SEO</title>
<!-- 无法体现内容 -->
<title>第15章</title>
<!-- 电商 -->
<title>商品详情</title>
<!-- SaaS -->
<title>功能介绍</title>
<!-- SPA -->
<title>My App</title>
<!-- 通用标题 -->
<title>首页</title>
<!-- 关键词堆砌 -->
<title>React React React React React</title>
```
## 2. Meta Description：不是摘要，是“点击理由”

Meta Description 不直接影响排名，但会影响用户点击率（CTR）。

搜索结果中的这段文字通常来自：
```html
<meta
  name="description"
  content="从 robots.txt、Sitemap、结构化数据到 SSR，系统讲解前端工程师必须掌握的 SEO 优化实践。"
/>
```
### 推荐规范
- 长度控制在 120~160 个字符（英文）
- 中文建议 60~100 字
- 包含核心关键词
- 自然可读，像一句完整介绍
- 每个页面唯一

### 推荐写法
```html
<meta
  name="description"
  content="本文从真实项目出发，系统讲解前端 SEO 优化，包括 robots.txt、Sitemap、SSR、结构化数据、性能优化等核心内容。"
/>
```
### 错误示例
```html
<meta
  name="description"
  content="SEO,SEO优化,前端SEO,网站SEO,SEO教程,SEO指南"
/>
```

### Title 与 Description 的关系

推荐让两者互补，而不是重复。

Title 告诉搜索引擎：这篇文章讲什么。

Description 告诉用户：为什么值得点击。

正确示例：
```html
<title>
前端 SEO 完整指南：从基础到实战 | 执剑博客
</title>

<meta
  name="description"
  content="从 robots.txt、Sitemap、SSR、结构化数据到 Core Web Vitals，全面掌握现代前端 SEO 优化实践。"
/>
```


## 3.  URL设计：结构就是语义

Google 官方立场：

> Use words in URLs that are relevant to your page's content. Avoid long URLs — they may intimidate searchers.

正例与反例：
```
✅/blog/frontend-seo-guide
✅/shop/coat/wool-long-coat
✅/docs/seo/spa-indexing

❌/post?id=8821
❌/article/2024/seo/123
```
### 注意点

URL 本身就能表达这个页面是干什么的，而不是一串机器编号。
```
/blog/frontend-seo-guide
```
比如上面的URL一看就知道：
-    这是 blog（博客）
-    内容是 frontend-seo-guide（前端 SEO 指南）

### 一句话总结
```
好的 URL = 人能读懂 + 搜索引擎能理解 + 结构清晰
坏的 URL = 机器编号 + 无语义 + 不可理解
```


## 4. Canonical URL — 重复内容的唯一正确答案

> Canonical（规范 URL）是一条 HTML 标签，用来告诉搜索引擎：「这个页面有多个地址，但请只认这一个。」

如果同一篇内容可通过多个 URL 访问（`/product?id=1`、`/product?color=red`、`/product/1?from=ad`），必须指定 canonical：

```html
<link rel="canonical" href="https://example.com/product/1" />
```
### 不处理会造成什么问题？

1. 搜索引擎不知道选哪个？
    -    Google 可能自判断，选择 `?id=1` 或者 `?color=red` ，还有可能选择带广告参数的页面，造成结果不可控。

2. 权重会被拆分
    -    原本一个页面的 SEO 权重，会变成：
    -    `30% /product?id=1`
    -    `30% /product?color=red`
    -    `40% /product/1?from=ad`

3. 搜索引擎收录混乱
    -    可能会造成 重复页面被收录；错误版本排在搜索结果，主页面反而不在索引中。


### 一句话总结：
```
Canonical = 告诉搜索引擎：哪一个才是“正版页面”
多个 URL → 一个内容 → 必须 canonical
```

## 5. Structured Data：告诉搜索引擎"关系是什么"

> Meta 标签告诉搜索引擎「这是什么」，结构化数据告诉它「关系是什么」。

结构化数据使用 JSON-LD 格式嵌入页面，让 Google 能直接理解内容的实体与属性关系。Google 官方支持 34 种类型（截至2026年5月30日）。

### 推荐规范
- 使用 JSON-LD 格式（Google 官方推荐）
- 嵌入在 `<head>` 或 `<body>` 中均可
- 写完用 [Rich Results Test](https://search.google.com/test/rich-results) 验证
- 一个页面可以有多种类型（如 Article + BreadcrumbList）

### 常用的结构化数据类型
| 类型 | 适用项目 | 效果 |
|------|----------|------|
| `Article` | 博客、新闻 | 作者、发布时间、封面图 |
| `Person` | 个人品牌、博客 |	作者信息、社交账号|
| `BreadcrumbList` | 全部 | 搜索结果显示层级面包屑 |
| `Product` | 电商 | 价格、库存、评分 |
| `HowTo` | 教程站 | 搜索结果显示步骤预览 |
| `LocalBusiness` | 实体店、本地服务 | 地址、电话、营业时间 |
| `Organization` | 企业站 | 品牌 Logo、社交账号 |
| `Review` | 电商、SaaS | 星级评分显示在结果中 |
| `VideoObject` | 视频站 | 视频缩略图、时长 |

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "前端开发者 SEO 完全指南",
  "author": { "@type": "Person", "name": "Zhi Jian" },
  "datePublished": "2026-06-18",
  "description": "覆盖内容站、电商、SaaS、SPA 等全场景的 SEO 实践指南"
}
</script>
```
总结一下
```
结构化数据 = 给搜索引擎一份"内容说明书"
JSON-LD 是唯一推荐格式，写完必须用 Rich Results Test 验证
```
### AI Mode / AI Overviews 与结构化数据

2026年，Google Gemini 驱动的 AI Mode 和 AI Overviews 已成为重要的流量入口。AI Mode 会读取页面中的结构化数据作为信任信号——即使某些 Schema 类型不再触发传统富媒体结果，正确的标记仍能显著提升内容被 AI 引用和总结的概率。

结构化数据的价值正在从「视觉富结果」转向「AI 可读性」。保持标记准确、完整，是面向 AI 搜索时代的基础优化。


# 第二部分：性能核心 - Core Web Vitals

Core Web Vitals 是 Google 衡量页面体验的核心指标集。在内容质量相近时，CWV 作为平局决胜信号（tiebreaker signal）影响排名 —— 并非直接排名决定因子。

| 指标 | 全称 | 测量内容 | 目标 |
|------|------|----------|------|
| LCP | Largest Contentful Paint | 主体内容渲染完成 | < 2.5s |
| INP | Interaction to Next Paint | 用户交互→页面响应 | < 200ms |
| CLS | Cumulative Layout Shift | 布局意外偏移 | < 0.1 |

### LCP 优化

- 预加载首屏关键资源：`<link rel="preload" as="image" href="hero.webp">`
- 图片用 WebP/AVIF + 响应式多尺寸
- 首屏不加载非必要 JS
- 静态资源上 CDN

### INP 优化

- 拆分长任务，主线程单次执行不超过 50ms
- 复杂计算扔 Web Worker
- 输入处理加 debounce
- `requestIdleCallback` 延后低优先级逻辑

### CLS 优化

- 图片和视频预设 `width` / `height`
- CSS `aspect-ratio` 维持占位
- 骨架屏尺寸与真实内容严格一致
- 字体 `font-display: swap`，避免 FOIT
- 动态注入内容使用 `transform` 而非改变布局属性

监测入口：Google Search Console  →  Core Web Vitals 报告。

### 总结
```
Core Web Vitals = 加载速度 + 交互响应 + 视觉稳定性
三项达标可在同等内容质量下获得排名优势，但内容本身始终是第一位的
```
---

# 第三部分：分场景实战

## 1. 内容站 / 博客：以文章为核心的 SEO

内容站和博客的特征是文章量大、页面结构统一、内容为核心竞争力。


### 推荐规范

| 动作 | 做法 | 说明 |
|------|------|------|
| 语义结构 | 每篇文章独立的 `<article>` 语义标签，一个 `<h1>` | 帮助搜索引擎定位正文区域 |
| 结构化数据 | Article（headline, author, datePublished, dateModified, image） | 搜索结果中展示作者和发布时间 |
| 面包屑 | BreadcrumbList：首页 → 分类 → 文章 | 搜索结果显示层级路径 |
| Sitemap | 动态生成，每条带 `<lastmod>`，新文章发布后自动更新 | 加速新页面发现 |
| 分页 | `<link rel="prev/next">` + canonical 指向当前页 | 防止分页被视为重复内容 |
| Feed | RSS / Atom Feed | Google 可从 feed 中抓取新 URL |

### Title 与 Description 实践

```
Title：      文章核心关键词 - 站点名称（≤60 字符）
Description：不要复读标题。回答一个隐含问题：「读完这篇文章能得到什么？」
OG 图片：    每篇文章单独配图，不要全站共用一张默认图
```

Google 2025 明确反驳的流行误解：

- 内容长短不影响排名，不是说写 2000 字就比 800 字排名高。
- 标题嵌套是否语义化不影响 Google Search（但对无障碍仍然重要），比如 `<h1>` 下面必须是 `<h2>` 这种。
- E-E-A-T 不是直接排名因子（Google 官方 2025 年澄清），E-E-A-T（经验、专业、权威、信任）像一份"评卷标准"，用来指导人工质量评估员打分，但它不是写入排名算法的公式参数。

### 一句话总结
```
内容站 SEO = 语义结构 + 结构化数据 + 动态 Sitemap
内容好坏不由字数决定，由"是否对人有用"决定
```

## 2. 电商：复杂 URL 与大规模产品页的 SEO

电商站的 SEO 难点不在于内容，而在于 URL 结构复杂（参数、筛选、分页、变体）、产品数量大、库存频繁变动。

### 推荐规范

#### URL结构
```
✅ /dresses/summer/casual/floral-maxi-dress
❌ /product?id=4582&color=blue
```

#### 分页处理
电商最常见的 SEO 陷阱——产品列表分页时，不要 infinite scroll + 动态加载，Googlebot 不会滚动。

```html
<!-- 分页页面用独立 URL + prev/next 链接 -->
<link rel="prev" href="/category?page=2">
<link rel="next" href="/category?page=4">
```

#### 过滤参数
过滤参数（颜色、尺码、排序）用 `<link rel="canonical">` 指向无参数版本，或对参数页面设 `noindex`。

#### Product 结构化数据

```json
{
  "@type": "Product",
  "name": "羊毛混纺长款大衣",
  "image": "https://example.com/images/coat.jpg",
  "description": "适合秋冬穿着的羊毛混纺大衣",
  "sku": "COAT-WOOL-001",
  "brand": { "@type": "Brand", "name": "品牌名" },
  "offers": {
    "@type": "Offer",
    "price": "899.00",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock"
  }
}
```
效果：搜索结果直接显示价格、库存状态、评分。

另外可选 `MerchantListing` 结构化数据（Google Shopping 用）和 `Review`（评分星）。

#### 变体与库存处理
| 场景 | 做法 |
| ----------- | ---------------- |
| 变体产品（颜色/尺码） | 每个独立 URL 都设 canonical 指向主产品页 |                     
| 缺货  | `availability: "https://schema.org/OutOfStock"`，不要删页面 |
| 永久下架 | 301 重定向到相关替代品，或 404/410 + 从 sitemap 中移除               |

#### 一句话总结
```
电商 SEO = 语义化 URL + 分页处理 + Product 结构化数据 + 库存状态同步
宁可让 Google 知道"缺货"，也不要删页面
```

## 3. JavaScript 密集型应用 / SPA：渲染是最大变量

>  Google 使用 headless Chromium 渲染页面，分三阶段：「爬取（Crawling）→ 渲染（Rendering）→ 索引（Indexing）」。

SPA 的特征是 CSR 渲染、客户端路由、内容通过 API 动态加载。渲染队列独立运行——所有 200 状态码的页面都会入渲染队列，但排到什么时候不确定。

### 推荐规范

#### 哈希路由——Google 无法可靠解析
```html
<!-- ❌ Google 无法识别 -->
<a href="#/products">产品</a>
<a href="#/services">服务</a>

<!-- ✅ 使用 History API -->
<a href="/products">产品</a>
<a href="/services">服务</a>
```

#### 页面404——CSR 应用的头号杀手

SPA 的客户端路由不返回真实 HTTP 状态码。访问不存在的产品时，服务器返回 200 OK + 空白或错误提示。Google 把这种页面当作「正常页面」索引。

解决方案二选一：

```javascript
// 方案 A：JavaScript 重定向到服务器 404
window.location.href = '/not-found';

// 方案 B：动态注入 noindex
const meta = document.createElement('meta');
meta.name = 'robots';
meta.content = 'noindex';
document.head.appendChild(meta);
```

#### 其他建议

| 建议  | 说明 |
| ---- | ------- |
| 优先 SSR / SSG / ISR  | Google 推荐：「server-side or pre-rendering is still a great idea」 |
| canonical 一致性       | 动态注入 canonical 时，确保原始 HTML 和 JS 注入的 canonical 一致               |
| 缓存策略                | 使用内容指纹（`main.2bb85551.js`）做长期缓存                                |
| Title / Description | 可以用 JS 动态设置，但建议 SSR 先写好                                        |
| Web Components      | 使用 `<slot>` 确保内容在渲染后的 HTML 中可见                                 |
| JS 兼容性              | Googlebot 运行 evergreen Chromium，不支持的特性需要 polyfill              |

#### 一句话总结
```
SPA SEO = SSR 优先 + History API 路由 + 消灭 Soft 404
Google 能渲染 JS，但"什么时候渲染"不受控制
```


##  4. SaaS / 工具型站点：功能页与落地页的分离艺术

> SaaS 站的核心矛盾：大量功能页面在登录墙后、登录页和落地页并存，搜索引擎只能看到"表面"。

SaaS 站的 SEO 策略必须严格区分公开页面和产品内页面。

### 推荐规范

| 动作        | 做法                                                      | 说明                              |
| --------- | ------------------------------------------------------- | ------------------------------- |
| 页面分离      | 登录后的 dashboard 全部加 `noindex`                            | 避免索引无意义的认证页面                    |
| 功能落地页     | 每个功能一个独立落地页：`/features/analytics`、`/features/reporting` | 不要把所有功能堆在一页                     |
| 产品结构化数据   | `SoftwareApplication` 类型                                | 适用于可在线使用的 SaaS 产品               |
| 定价页       | 设为 canonical 的重点页面，内置 FAQ 回答「免费版有什么限制」                  | 定价页往往是自然流量最高的页面之一               |

### 错误示例
```html
<!-- 所有功能堆在一页，搜索引擎无法为单个功能建立索引 -->
<title>我们的产品 - 功能大全</title>
<!-- 功能列表用 JS 动态渲染，无独立 URL -->
```
### 一句话总结
```
SaaS SEO = 公开页最大化曝光 + 产品内页面全部 noindex
一个功能一个页面，让搜索引擎能精准匹配用户搜索意图
```

## 5. 国际化 / 多语言站点：让 Google 理解你的语言矩阵

>  Google 推荐使用 `hreflang` 标签告诉搜索引擎不同语言版本之间的关系，避免被视为重复内容。

多语言站点的核心任务是让搜索引擎理解"同一内容的多个语言版本"，并给用户展示正确的语言。

### 推荐规范

```html
<html lang="zh-CN">

<link rel="alternate" hreflang="zh-CN" href="https://example.com/seo-guide">
<link rel="alternate" hreflang="en" href="https://example.com/en/seo-guide">
<link rel="alternate" hreflang="x-default" href="https://example.com/seo-guide">
```

`x-default` 是「用户语言不匹配任何版本时的回退页」。

### URL 策略对比

| 方式 | 示例 | 推荐场景 |
|------|------|----------|
| 子目录 | `example.com/en/` | 通用，SEO 最佳 |
| 子域名 | `en.example.com` | 地区差异大 |
| 不同域名 | `example.co.uk` | 强地区定位 |

Google 推荐子目录方案——PR 和链接权重不会分散到不同域名。

### 一句话总结
```
多语言 SEO = hreflang 标签 + 子目录 URL + x-default 回退
让 Google 知道"这是同一内容的语言变体，不是重复"
```

# 第四部分：图片、视频、链接体系优化
## 1. 图片 SEO - 被低估的流量入口

> Google 的说法：**许多人第一次发现你的网站，是通过图片搜索。**

图片搜索是一个独立的大流量入口，其 SEO 优化不应被忽略。

### 推荐规范


| 优化项 | 做法                                    | 原因               |
| --- | ------------------------------------- | ---------------- |
| 文件名 | `seo-best-practices-2026.jpg`         | 非 `IMG_4582.jpg` |
| Alt | `SEO 最佳实践 2026 封面指南`                  | 搜索引擎 + 无障碍       |
| 格式  | WebP → AVIF 回退                        | 体积更小             |
| 响应式 | `<picture>` + `srcset`                | 不同设备不同尺寸         |
| 懒加载 | `loading="lazy"` + `decoding="async"` | 不影响 LCP 首屏       |
| 上下文 | 图片放在相关文字附近                            | 帮助 Google 理解图片含义 |

### 推荐写法
```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="SEO 最佳实践指南封面" width="1200" height="630" loading="lazy">
</picture>
```
### 错误示例(❌)
```html
```html
<!-- 无语义文件名 -->
<img src="IMG_4582.jpg" alt="">

<!-- 未预设宽高，导致 CLS -->
<img src="hero.jpg" alt="封面">

<!-- 首屏图片使用懒加载，影响 LCP -->
<img src="hero.jpg" alt="封面" loading="lazy">
```
---

## 2. 富媒体 - 视频与广告的 SEO 边界

### 视频 SEO

> 如果你的页面以视频为主（教程站、视频博客），每个视频应该像文章一样被认真对待。

### 推荐规范

- 每个视频一个独立页面
- `VideoObject` 结构化数据：name、description、thumbnailUrl、duration、uploadDate
- 视频的标题和描述遵循和页面 title 一样的规则
- 可以提交 Video Sitemap

### 禁止：侵入性插页广告

Google 对弹窗和插页广告有明确惩罚——尤其是移动端。首次加载时盖住主要内容的大弹窗，会拉低排名。

```
视频 SEO = 独立页面 + VideoObject 结构化数据 + Video Sitemap
侵入性广告是红线，移动端尤其严格
```

---

## 3. 链接策略 - 站内与站外的权重流动

> Google 通过链接发现页面，也通过链接理解页面之间的关系。链接越多的页面，PageRank 越高——至今如此。

### 推荐规范

#### 内部链接
| 动作    | 做法                             |
| ----- | ------------------------------ |
| 新内容加链 | 新文章/新页面发布后，在已有相关页面中加链接         |
| 找链接位置 | 用 `site:你的域名 关键词` 搜索，找到可加链的旧页面 |
| 锚文本   | 用描述性文字，不要「点击这里」                |

#### 外部链接

Google 官方说明：**来自主题相关的知名网站的链接，是质量的强信号。** 对超 10 亿页面的研究也确认了外链数量与流量的正相关。

### 用户生成内容的链接

论坛、评论区——用户发的外链统一加 `rel="nofollow"`（或 `ugc`）。防止你的站被垃圾链接连累。

### 品牌提及

在 AI 搜索时代，品牌提及——无论有没有链接——都会影响 ChatGPT、Perplexity 等工具对品牌的理解和引用。

---

# 第五部分：Google 已经不管的事 - 避免无效投入

>  来自 Google 官方 2025 年的明确声明——以下做法对 Google 排名没有影响，不必浪费时间。

| 你听说过的                    | Google 的实际态度                                                                |
| ------------------------ | --------------------------------------------------------------------------- |
| `<meta name="keywords">` | 完全不用，Google 不读                                                              |
| 域名里放关键词                  | 几乎不影响排名                                                                     |
| 内容必须多少字                  | 没有魔法数字                                                                      |
| H1 → H2 → H3 必须严格嵌套      | 对 Google Search 不重要（但对无障碍重要）                                                |
| E-E-A-T 是排名因子            | 不是——它是质量评估框架，不是算法输入。December 2025 Core Update 将其质量信号扩展至所有竞争性搜索类别，不再仅限于 YMYL |
| 重复内容有惩罚                  | 不会惩罚，但浪费爬虫预算                                                                |
| PageRank 是唯一排名信号         | Google：「我们有很多排名信号，PageRank 只是其中之一」                                          |
---

## 第六部分：监控和迭代 - SEO 不是一次性工程

>  SEO 的效果是滞后的，监控体系决定了你能多快发现问题。

### Google Search Console — 必装

免费工具，三份报告必须定期看：

| 报告 | 看什么 |
|------|--------|
| 效果 | 哪些查询带来了展示/点击？哪些页面 CTR 低？ |
| 索引 | 哪些页面没被收录？原因？ |
| 体验 | Core Web Vitals 有没有红线？移动端可用性有没有问题？ |

### Google Analytics 4 — 辅助

标准安装至少追踪：页面浏览量、用户来源（搜索/社交/直接/外链）、平均停留时间。

### 迭代节奏建议

| 频率 | 动作 |
|------|------|
| 每周 | 扫一眼 Search Console 效果报告 |
| 每月 | 检查核心页面排名变化，更新过时内容 |
| 每季度 | Core Web Vitals 全面排查，决定下季度优化优先级 |
| 有核心算法更新时 | 查看流量变化，不要急于做剧烈改动 |

### 一句话总结

```
监控 = Search Console 三份报告 + GA4 流量追踪 + 定期迭代
SEO 不是一次性配置，是持续优化的工程习惯
```
---

# 快速检查清单

任何项目上线前必须确认：

- [ ] 每个 `<title>` 唯一且有描述性
- [ ] `<meta name="description">` 每页独立
- [ ] `robots.txt` 没有误拦页面
- [ ] 有 sitemap 并已提交 Search Console
- [ ] 所有页面可被 `<a href>` 访问（JS 路由用 History API）
- [ ] 重复页面有 canonical
- [ ] 图片有 alt 且文件有意义
- [ ] HTTPS 全站启用
- [ ] Core Web Vitals 三项达标
- [ ] 相关的结构化数据已添加并用 Rich Results Test 验证
- [ ] 移动端可用性良好
- [ ] 错误页面返回正确的 HTTP 状态码
- [ ] 分页/过滤页面有正确的 prev/next/canonical
- [ ] 用户生成内容的外链统一标记了 nofollow

---

# 结语

SEO 的底层逻辑十年没变——**让搜索引擎找到你，看懂你，信任你。** 技术做好是及格线，内容做好是放大器。

前端的职责边界很清楚：把所有技术坑填平，剩下的交给内容和时间。
