import { scanArticleIds } from '../utils/scan-articles'

/**
 * SSG（静态站点生成）配置
 * 负责扫描文章并生成需要预渲染的路由列表
 */

/**
 * 获取需要预渲染的路由列表
 */
export function getIncludedRoutes(): string[] {
    const articles = scanArticleIds()
    const articleRoutes = articles.map(id => `/article/${id}`)
    return ['/', '/articles', ...articleRoutes]
}
