/**
 * 文章实体类型定义
 */

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
  description?: string
  author?: string
  tags?: string[]
}

export interface ArticleFrontMatter {
  title: string
  date: string
  excerpt?: string
  description?: string
  author?: string
  tags?: string[]
  [key: string]: unknown
}

