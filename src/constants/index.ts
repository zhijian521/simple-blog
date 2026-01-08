/**
 * 应用配置常量
 */

export const SITE_CONFIG = {
    title: '耶温博客',
    description: '记录思考，分享知识',
    author: '耶温',
    // ICP 备案信息
    icp: {
        number: '陕ICP备2024040821号-1',
        url: 'https://beian.miit.gov.cn/',
    },
    // 版权信息
    copyright: {
        startYear: 2024, // 建站年份
        owner: '耶温博客',
    },
} as const

export const ROUTES = {
    HOME: '/',
    ARTICLES: '/articles',
    ARTICLE: (slug: string) => `/article/${slug}`,
} as const

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
} as const
