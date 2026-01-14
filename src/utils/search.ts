import type { Article } from '../types/article'

/**
 * 搜索文章（匹配标题、标签、简介）
 * @param query 搜索关键词
 * @param articles 文章列表
 * @returns 匹配的文章列表
 */
export function searchArticles(query: string, articles: Article[]): Article[] {
    if (!query.trim()) return []

    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)

    return articles.filter(article => {
        // 预先转换为小写，避免重复转换
        const titleLower = article.title.toLowerCase()
        const excerptLower = article.excerpt.toLowerCase()
        const tagsLower = article.tags.map(tag => tag.toLowerCase())

        // 搜索标题
        const titleMatch = keywords.some(keyword =>
            titleLower.includes(keyword)
        )

        // 搜索标签
        const tagsMatch = keywords.some(keyword =>
            tagsLower.some(tag => tag.includes(keyword))
        )

        // 搜索简介
        const excerptMatch = keywords.some(keyword =>
            excerptLower.includes(keyword)
        )

        return titleMatch || tagsMatch || excerptMatch
    })
}
