/**
 * 文章实体类型定义
 */

/**
 * 文章完整信息（包含 id、slug 和渲染后的内容）
 */
export interface Article {
    id: string
    slug: string
    title: string
    date: string
    excerpt: string
    content: string
    author?: string
    category?: string
    tags?: string[]
    sticky?: number // 置顶优先级（数值越大越靠前）
}

/**
 * Markdown Front Matter 元数据类型
 * 用于解析 markdown 文件的 front-matter
 */
export interface ArticleFrontMatter {
    title?: string
    date?: string
    excerpt?: string
    description?: string
    author?: string
    tags?: string[]
    category?: string
    id?: string
    sticky?: number // 置顶优先级（可选，默认为 0）
    [key: string]: unknown // 允许额外的自定义字段
}

/**
 * 文章索引条目（用于列表/搜索，避免加载完整内容）
 */
export interface ArticleIndexItem {
    id: string
    slug: string
    title: string
    date: string
    excerpt: string
    author?: string
    category?: string
    tags?: string[]
    sticky?: number
}
