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
    [key: string]: unknown // 允许额外的自定义字段
}
