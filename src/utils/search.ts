export interface SearchIndexItem {
    id: string
    searchText: string
}

export function searchArticleIds(query: string, items: SearchIndexItem[]): string[] {
    if (!query.trim()) return []

    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean)

    return items
        .filter(item => keywords.some(keyword => item.searchText.includes(keyword)))
        .map(item => item.id)
}
