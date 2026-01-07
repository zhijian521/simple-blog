import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import type { Article } from '../types/article'

/**
 * Markdown 渲染器配置
 * - html: 允许 HTML 标签
 * - linkify: 自动转换 URL 为链接
 * - typographer: 启用印刷优化
 */
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
})

/**
 * 文章数据缓存
 */
const articlesCache = {
    bySlug: new Map<string, Article>(),
    list: [] as Article[],
}

/**
 * 加载并解析所有 Markdown 文章
 */
function loadArticles(): void {
    const markdownModules = import.meta.glob('../../blogs/**/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
    })

    Object.entries(markdownModules).forEach(([path, content]) => {
        const slug = extractSlug(path)
        const article = parseArticle(content as string, slug)

        articlesCache.bySlug.set(slug, article)
        articlesCache.list.push(article)
    })

    // 按日期降序排序
    articlesCache.list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * 从文件路径中提取文章 slug
 */
function extractSlug(path: string): string {
    return path.replace(/^.*\/blogs\//, '').replace(/\.md$/, '')
}

/**
 * 解析 Markdown 文章内容
 */
function parseArticle(markdownContent: string, slug: string): Article {
    const { attributes, body } = fm<{
        title?: string
        date?: string
        excerpt?: string
        description?: string
        author?: string
        tags?: string[]
    }>(markdownContent)

    return {
        slug,
        title: attributes.title || '无标题',
        date: attributes.date || new Date().toISOString().split('T')[0],
        excerpt: attributes.excerpt || attributes.description || extractExcerpt(body),
        content: md.render(body),
        author: attributes.author,
        tags: attributes.tags || [],
    }
}

/**
 * 提取文章摘要（前 200 字符）
 */
function extractExcerpt(content: string, maxLength = 200): string {
    const plainText = content.replace(/[#*`_[\]]/g, '').trim()
    return plainText.slice(0, maxLength) + '...'
}

// 初始化加载文章
loadArticles()

/**
 * 获取所有文章列表
 */
export function getArticles(): Article[] {
    return articlesCache.list
}

/**
 * 根据 slug 获取单篇文章
 */
export function getArticleBySlug(slug: string): Article | null {
    return articlesCache.bySlug.get(slug) || null
}

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown(content: string): string {
    return md.render(content)
}
