import type { Article } from '../types/article'

export function searchArticles(query: string, articles: Article[]): Article[] {
    if (!query.trim()) return []

    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)

    return articles.filter(article => {
        const titleLower = article.title.toLowerCase()
        const excerptLower = article.excerpt.toLowerCase()
        const tagsLower = (article.tags || []).map(tag => tag.toLowerCase())

        const titleMatch = keywords.some(keyword => titleLower.includes(keyword))
        const tagsMatch = keywords.some(keyword => tagsLower.some(tag => tag.includes(keyword)))
        const excerptMatch = keywords.some(keyword => excerptLower.includes(keyword))

        return titleMatch || tagsMatch || excerptMatch
    })
}
