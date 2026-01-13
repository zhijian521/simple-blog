import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import type { Article, ArticleFrontMatter } from '../types/article'

// 常量配置
const DEFAULT_EXCERPT_LENGTH = 200

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
interface ArticlesCache {
    bySlug: Map<string, Article>
    byId: Map<string, Article>
    list: Article[]
}

const articlesCache: ArticlesCache = {
    bySlug: new Map(),
    byId: new Map(),
    list: [],
}

/**
 * 验证 slug 格式，防止路径遍历攻击
 */
function validateSlug(slug: string): boolean {
    // 检查是否包含路径遍历攻击字符
    const pathTraversalPatterns = ['../', './', '..\\']
    const hasPathTraversal = pathTraversalPatterns.some(pattern => slug.includes(pattern))

    if (hasPathTraversal) {
        console.error(`路径遍历攻击检测: ${slug}`)
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

        Object.entries(markdownModules).forEach(([filePath, content]) => {
            try {
                const slug = extractSlug(filePath)

                if (!validateSlug(slug)) {
                    console.warn(`无效的 slug 格式: ${slug}，跳过...`)
                    return
                }

                const article = parseArticle(String(content), slug)
                articlesCache.bySlug.set(slug, article)
                articlesCache.byId.set(article.id, article)
                articlesCache.list.push(article)
            } catch (error) {
                console.error(`解析文章失败: ${filePath}`, error)
            }
        })

        // 按日期降序排序
        articlesCache.list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (articlesCache.list.length === 0) {
            console.warn('没有成功加载任何文章')
        }
    } catch (error) {
        console.error('加载文章失败', error)
        throw new Error('文章加载失败，请检查博客文件')
    }
}

/**
 * 从文件路径中提取文章 slug
 */
function extractSlug(filePath: string): string {
    return filePath.replace(/^.*[/\\]blogs[/\\]/, '').replace(/\.md$/, '')
}

/**
 * 解析 Markdown 文章内容
 */
function parseArticle(markdownContent: string, slug: string): Article {
    try {
        const { attributes, body } = fm<ArticleFrontMatter>(markdownContent)

        // 验证日期格式
        let validDate = attributes.date
        if (validDate && !Date.parse(validDate)) {
            console.warn(`文章 "${slug}" 的日期格式无效: ${validDate}`)
            validDate = undefined
        }

        // 验证 id 字段存在
        if (!attributes.id) {
            throw new Error(`文章 "${slug}" 缺少必需的 id 字段，请运行 npm run ensure-ids 生成 id`)
        }

        return {
            id: attributes.id,
            slug,
            title: attributes.title || '无标题',
            date: validDate || new Date().toISOString().split('T')[0],
            excerpt: attributes.excerpt || attributes.description || extractExcerpt(body),
            content: md.render(body),
            author: attributes.author,
            category: attributes.category,
            tags: attributes.tags || [],
        }
    } catch (error) {
        console.error(`解析文章 "${slug}" 时出错:`, error)
        throw error instanceof Error ? error : new Error(`解析文章 "${slug}" 失败`)
    }
}

/**
 * 提取文章摘要
 */
function extractExcerpt(content: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
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
    if (!validateSlug(slug)) {
        console.error(`请求的 slug 格式无效: ${slug}`)
        return null
    }

    return articlesCache.bySlug.get(slug) || null
}

/**
 * 根据 id 获取单篇文章
 */
export function getArticleById(id: string): Article | null {
    return articlesCache.byId.get(id) || null
}

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown(content: string): string {
    return md.render(content)
}
