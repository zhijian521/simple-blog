/**
 * 应用配置常量
 */

export { SITE_CONFIG } from '@config/site.config'

export const ROUTES = {
    HOME: '/',
    ARTICLES: '/articles',
    NEWSPAPER: '/newspaper',
    ARTICLE: (id: string) => `/article/${id}`,
} as const

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
} as const

export const GIT_ACTIVITY = {
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    tooltipOffset: 60,
    daysToShow: 30,
    levelThresholds: [0, 2, 4, 6],
} as const

export { pwaOptions } from './pwa.config'
