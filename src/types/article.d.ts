export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author?: string
  tags?: string[]
}

export interface ArticleMetadata {
  title: string
  date: string
  excerpt?: string
  author?: string
  tags?: string[]
}
