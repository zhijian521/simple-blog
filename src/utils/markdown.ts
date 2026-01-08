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
 * 验证 slug 格式，防止路径遍历攻击
 */
function validateSlug(slug: string): boolean {
    // 检查是否包含路径遍历攻击字符
    const pathTraversalPatterns = ['../', './', '\\\\', '..\\']
    const hasPathTraversal = pathTraversalPatterns.some(pattern => slug.includes(pattern))

    if (hasPathTraversal) {
        console.error(`Path traversal detected in slug: ${slug}`)
        return false
    }

    return true
}

/**
 * 加载并解析所有 Markdown 文章
 */
function loadArticles(): void {
    try {
        const markdownModules = import.meta.glob('../../blogs/**/*.md', {
            query: '?raw',
            import: 'default',
            eager: true,
        })

        Object.entries(markdownModules).forEach(([path, content]) => {
            try {
                const slug = extractSlug(path)

                // 验证 slug 格式
                if (!validateSlug(slug)) {
                    console.warn(`Invalid slug format: ${slug}, skipping...`)
                    return
                }

                const article = parseArticle(content as string, slug)
                articlesCache.bySlug.set(slug, article)
                articlesCache.list.push(article)
            } catch (error) {
                console.error(`Failed to parse article: ${path}`, error)
                // 出错时跳过该文章，继续处理其他文章
            }
        })

        // 按日期降序排序
        articlesCache.list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (articlesCache.list.length === 0) {
            console.warn('No articles loaded successfully')
        }
    } catch (error) {
        console.error('Failed to load articles', error)
        throw new Error('文章加载失败，请检查博客文件')
    }
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
    try {
        const { attributes, body } = fm<{
            title?: string
            date?: string
            excerpt?: string
            description?: string
            author?: string
            tags?: string[]
        }>(markdownContent)

        // 验证日期格式
        let validDate = attributes.date
        if (validDate && !Date.parse(validDate)) {
            console.warn(`Invalid date format for article "${slug}": ${validDate}`)
            validDate = undefined
        }

        return {
            slug,
            title: attributes.title || '无标题',
            date: validDate || new Date().toISOString().split('T')[0],
            excerpt: attributes.excerpt || attributes.description || extractExcerpt(body),
            content: md.render(body),
            author: attributes.author,
            tags: attributes.tags || [],
        }
    } catch (error) {
        console.error(`Error parsing article "${slug}":`, error)
        throw new Error(`解析文章 "${slug}" 失败: ${error instanceof Error ? error.message : '未知错误'}`)
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
    // 验证 slug 格式
    if (!validateSlug(slug)) {
        console.error(`Invalid slug format requested: ${slug}`)
        return null
    }

    return articlesCache.bySlug.get(slug) || null
}

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown(content: string): string {
    return md.render(content)
}
