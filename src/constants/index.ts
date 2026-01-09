/**
 * 应用配置常量
 */

export const SITE_CONFIG = {
    title: '耶温博客',
    description: '记录思考，分享知识',
    author: '耶温',
    icp: {
        number: '陕ICP备2024040821号-1',
        url: 'https://beian.miit.gov.cn/',
    },
    copyright: {
        startYear: 2024,
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

export const GIT_ACTIVITY = {
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    tooltipOffset: 60,
} as const

export { pwaOptions } from './pwa.config'
