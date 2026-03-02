const META_DESCRIPTION_MAX_LENGTH = 160
const META_KEYWORD_MAX_COUNT = 20

export function normalizeMetaDescription(text: string): string {
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (normalized.length <= META_DESCRIPTION_MAX_LENGTH) {
        return normalized
    }
    return `${normalized.slice(0, META_DESCRIPTION_MAX_LENGTH - 3)}...`
}

export function normalizeKeywords(keywords: string[], maxCount = META_KEYWORD_MAX_COUNT): string {
    const normalizedKeywords: string[] = []
    const seen = new Set<string>()

    for (const keyword of keywords.map(item => item.trim()).filter(Boolean)) {
        const key = keyword.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        normalizedKeywords.push(keyword)
        if (normalizedKeywords.length >= maxCount) break
    }

    return normalizedKeywords.join(', ')
}

export function splitCategoryKeywords(category: string): string[] {
    const parts = category
        .split('/')
        .map(item => item.trim())
        .filter(Boolean)
    return [category, ...parts]
}

export function extractCategoryFromQuery(routeName: unknown, rawCategory: unknown): string {
    if (routeName !== 'Articles') {
        return ''
    }

    if (Array.isArray(rawCategory)) {
        return String(rawCategory[0] || '').trim()
    }

    return typeof rawCategory === 'string' ? rawCategory.trim() : ''
}

export function resolveSelectedCategory(categoryFromQuery: string, allCategories: Set<string>): string {
    if (!categoryFromQuery) {
        return ''
    }
    return allCategories.has(categoryFromQuery) ? categoryFromQuery : ''
}

export function resolvePageTitle(input: {
    routeName: unknown
    routeMetaTitle?: string
    selectedCategory: string
    siteTitle: string
}): string {
    if (input.routeName === 'Articles' && input.selectedCategory) {
        return `${input.selectedCategory} 文章 - ${input.siteTitle}`
    }

    return input.routeMetaTitle ? `${input.routeMetaTitle} - ${input.siteTitle}` : input.siteTitle
}

export function resolvePageDescription(input: {
    routeName: unknown
    routeMetaDescription?: string
    selectedCategory: string
    siteDescription: string
}): string {
    if (input.routeName === 'Articles' && input.selectedCategory) {
        return normalizeMetaDescription(
            `浏览 ${input.selectedCategory} 分类下的技术文章，覆盖实战教程、经验总结与问题排查，帮助你快速定位相关知识。`
        )
    }

    return normalizeMetaDescription(input.routeMetaDescription || input.siteDescription)
}

export function resolvePageKeywords(input: {
    routeMetaKeywords?: string | string[]
    selectedCategory: string
    siteKeywords: string
}): string {
    const siteKeywords = input.siteKeywords.split(',').map(item => item.trim())
    const categoryKeywords = input.selectedCategory
        ? splitCategoryKeywords(input.selectedCategory)
        : []

    if (Array.isArray(input.routeMetaKeywords)) {
        return normalizeKeywords([...categoryKeywords, ...input.routeMetaKeywords, ...siteKeywords])
    }

    if (typeof input.routeMetaKeywords === 'string' && input.routeMetaKeywords.trim()) {
        return normalizeKeywords([
            ...categoryKeywords,
            ...input.routeMetaKeywords.split(','),
            ...siteKeywords,
        ])
    }

    return normalizeKeywords([...categoryKeywords, ...siteKeywords])
}

export function resolvePageRobots(input: {
    routeName: unknown
    routeMetaRobots?: string
    categoryFromQuery: string
    selectedCategory: string
}): string {
    if (typeof input.routeMetaRobots === 'string' && input.routeMetaRobots.trim()) {
        return input.routeMetaRobots.trim()
    }

    if (input.routeName === 'Articles' && input.categoryFromQuery && !input.selectedCategory) {
        return 'noindex, nofollow'
    }

    return 'index, follow'
}
