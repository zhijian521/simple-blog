import type { RouteMeta } from 'vue-router'

export const ROUTE_SEO_META: Record<
    'Home' | 'Articles' | 'Newspaper' | 'Explorer' | 'ArticleDetail' | 'NotFound',
    RouteMeta
> = {
    Home: {
        title: '首页',
        description:
            '耶温博客首页，聚合前端开发、Node.js 生态、AI 编程工具、SEO 增长与部署运维等实战内容，持续更新高质量技术文章。',
        keywords: [
            '耶温博客',
            '技术博客',
            '前端开发',
            'Node.js 生态',
            'AI 编程工具',
            'SEO 优化',
            '网站部署',
            '工程化实践',
        ],
    },
    Articles: {
        title: '文章列表',
        description:
            '浏览全部技术文章，支持按分类筛选与分页阅读，覆盖前端工程化、Node.js、AI 工具、SEO 与网站部署实战。',
        keywords: [
            '文章列表',
            '技术文章',
            '前端工程化',
            'Node.js 教程',
            'AI 工具实践',
            'SEO 优化',
            '网站部署',
            '开发经验总结',
        ],
    },
    Newspaper: {
        title: '报纸排版',
        description:
            '以报纸排版视图浏览技术文章，按时间与主题高密度呈现前端、Node.js、AI 与网站运维内容，提升沉浸式阅读效率。',
        keywords: [
            '报纸排版',
            '技术周刊',
            '高密度阅读',
            '前端文章',
            'Node.js 文章',
            'AI 技术资讯',
            '网站运维实践',
        ],
    },
    Explorer: {
        title: '文档浏览器',
        description:
            '以资源管理器视图浏览所有文档目录，支持文件夹展开与文章快速预览，提升技术文章检索和阅读效率。',
        keywords: [
            '文档浏览器',
            '资源管理器',
            '文章目录',
            'Markdown 预览',
            '技术文档检索',
            '博客阅读器',
        ],
    },
    ArticleDetail: {
        title: '文章详情',
        description:
            '查看技术文章详细内容，包含代码示例、原理解析、实践总结与相关标签，帮助快速定位问题与解决方案。',
        keywords: ['文章详情', '技术教程', '代码示例', '实战指南', '问题排查', '开发经验'],
    },
    NotFound: {
        title: '页面未找到',
        description: '抱歉，你访问的页面不存在或链接已失效。可返回首页继续浏览耶温博客的最新技术文章与专题内容。',
        keywords: ['404 页面', '页面未找到', '链接失效', '返回首页', '耶温博客'],
        robots: 'noindex, nofollow',
    },
}
