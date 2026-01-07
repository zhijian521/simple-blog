/**
 * 应用配置常量
 */

export const SITE_CONFIG = {
    title: '耶温博客',
    description: '记录思考，分享知识',
    copyright: `© ${new Date().getFullYear()} 耶温博客`,
} as const

export const ROUTES = {
    HOME: '/',
    ARTICLES: '/articles',
    ARTICLE: (slug: string) => `/article/${slug}`,
} as const

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
} as const

export const DATE_FORMAT = {
    FULL: 'YYYY年MM月DD日',
    SHORT: 'YYYY-MM-DD',
    MONTH_YEAR: 'YYYY年MM月',
} as const
