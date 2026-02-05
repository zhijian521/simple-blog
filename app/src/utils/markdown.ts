/**
 * Markdown 文章处理模块
 *
 * 功能：
 * - 解析 Markdown 文章内容
 * - 缓存文章数据
 * - 代码高亮（使用 Shiki）
 * - 安全性验证（路径遍历防护）
 */

import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import { createHighlighter, type Highlighter } from 'shiki'
import articleIndex from '@/generated/article-index.json'
import type { Article, ArticleFrontMatter, ArticleIndexItem } from '../types/article'

// 配置常量
const DEFAULT_EXCERPT_LENGTH = 200
const SHIKI_THEME = 'github-light'

// 常用语言列表（初始化时加载）
const CORE_LANGUAGES = ['javascript', 'typescript', 'vue', 'bash', 'json', 'html', 'css'] as const

// 支持的所有语言（按需加载）
const SUPPORTED_LANGUAGES = [
    'bash',
    'sh',
    'javascript',
    'typescript',
    'js',
    'ts',
    'vue',
    'json',
    'html',
    'css',
    'python',
    'py',
    'java',
    'go',
    'rust',
    'markdown',
    'md',
    'yaml',
    'toml',
    'ini',
    'xml',
    'sql',
    'dockerfile',
    'plaintext',
] as const

// Shiki 高亮器实例
let highlighterInstance: Highlighter | null = null
const loadedLanguages = new Set<string>()

export async function initHighlighter(): Promise<Highlighter> {
    if (!highlighterInstance) {
        highlighterInstance = await createHighlighter({
            themes: [SHIKI_THEME],
            langs: [...SUPPORTED_LANGUAGES],
        })
        CORE_LANGUAGES.forEach(lang => loadedLanguages.add(lang))
        SUPPORTED_LANGUAGES.forEach(lang => loadedLanguages.add(lang))
    }
    return highlighterInstance
}

async function loadLanguageIfNeeded(lang: string): Promise<void> {
    if (!highlighterInstance) {
        throw new Error('Highlighter not initialized')
    }

    if (!SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number])) {
        return
    }

    if (loadedLanguages.has(lang)) {
        return
    }

    await highlighterInstance.loadLanguage(lang as (typeof SUPPORTED_LANGUAGES)[number])
    loadedLanguages.add(lang)
}

const mdPlain: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str: string, lang: string): string => {
        const language = lang || 'plaintext'
        return `<pre><code class="language-${language}">${mdPlain.utils.escapeHtml(str)}</code></pre>`
    },
})

let mdWithShiki: MarkdownIt | null = null

async function getMarkdownWithShiki(): Promise<MarkdownIt> {
    if (mdWithShiki) return mdWithShiki

    const highlighter = await initHighlighter()
    mdWithShiki = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: (str: string, lang: string): string => {
            const language = lang || 'plaintext'
            const isSupported = SUPPORTED_LANGUAGES.includes(
                language as (typeof SUPPORTED_LANGUAGES)[number]
            )

            if (!isSupported) {
                return `<pre><code class="language-${language}">${mdPlain.utils.escapeHtml(
                    str
                )}</code></pre>`
            }

            try {
                return highlighter.codeToHtml(str, {
                    lang: language as (typeof SUPPORTED_LANGUAGES)[number],
                    theme: SHIKI_THEME,
                })
            } catch (error) {
                console.warn(`[Article] Highlight failed for ${language}`, error)
                return `<pre><code class="language-${language}">${mdPlain.utils.escapeHtml(
                    str
                )}</code></pre>`
            }
        },
    })

    return mdWithShiki
}

// 文章索引缓存（列表/搜索用）
const indexItems = (articleIndex as ArticleIndexItem[]).map(item => ({
    ...item,
    tags: item.tags || [],
}))
const searchIndex = indexItems.map(item => {
    const title = item.title.toLowerCase()
    const excerpt = item.excerpt.toLowerCase()
    const tags = (item.tags || []).map(tag => tag.toLowerCase()).join(' ')
    return {
        id: item.id,
        searchText: `${title} ${excerpt} ${tags}`.trim(),
    }
})
const sortedIndexItems = [...indexItems].sort((a, b) => {
    const stickyA = a.sticky || 0
    const stickyB = b.sticky || 0
    if (stickyA !== stickyB) {
        return stickyB - stickyA
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime()
})
const indexById = new Map(indexItems.map(item => [item.id, item]))
const indexBySlug = new Map(indexItems.map(item => [item.slug, item]))

// 已加载的完整文章缓存（详情页用）
const fullArticleById = new Map<string, Article>()
const fullArticleBySlug = new Map<string, Article>()

const markdownModules = import.meta.glob('@docs/**/*.md', {
    query: '?raw',
    import: 'default',
})
const markdownModuleBySlug = new Map<string, () => Promise<unknown>>(
    Object.entries(markdownModules).map(([filePath, loader]) => [
        extractSlug(filePath),
        loader,
    ])
)

function validateSlug(slug: string): boolean {
    const pathTraversalPatterns = ['../', './', '..\\']
    if (pathTraversalPatterns.some(pattern => slug.includes(pattern))) {
        console.error(`路径遍历攻击检测: ${slug}`)
        return false
    }
    return true
}

function extractSlug(filePath: string): string {
    return filePath
        .replace(/^@docs[/\\]/, '')
        .replace(/^.*[/\\]docs[/\\]/, '')
        .replace(/\.md$/, '')
}

function extractExcerpt(content: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
    const plainText = content.replace(/[#*`_[\]]/g, '').trim()
    return plainText.slice(0, maxLength) + '...'
}

async function parseArticle(markdownContent: string, slug: string): Promise<Article> {
    const { attributes, body } = fm<ArticleFrontMatter>(markdownContent)

    let validDate = attributes.date
    if (validDate && !Date.parse(validDate)) {
        console.warn(`文章 "${slug}" 的日期格式无效: ${validDate}`)
        validDate = undefined
    }

    if (!attributes.id) {
        throw new Error(`文章 "${slug}" 缺少必需的 id 字段，请运行 npm run ensure-ids 生成 id`)
    }

    const renderer = await getMarkdownWithShiki()

    return {
        id: attributes.id,
        slug,
        title: attributes.title || '无标题',
        date: validDate || new Date().toISOString().split('T')[0],
        excerpt: attributes.excerpt || attributes.description || extractExcerpt(body),
        content: renderer.render(body),
        author: attributes.author,
        category: attributes.category,
        tags: attributes.tags || [],
        sticky: attributes.sticky || 0,
    }
}

function isAlreadyHighlighted(element: HTMLElement): boolean {
    return element.closest('.shiki') !== null
}

function extractLanguage(element: HTMLElement): string {
    const langClass = Array.from(element.classList).find(cls => cls.startsWith('language-'))
    return langClass ? langClass.replace('language-', '') : 'plaintext'
}

async function highlightCodeElement(
    codeElement: HTMLElement,
    highlighter: Highlighter
): Promise<void> {
    const code = codeElement.textContent || ''
    const lang = extractLanguage(codeElement)
    const language = SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number])
        ? (lang as (typeof SUPPORTED_LANGUAGES)[number])
        : 'plaintext'

    try {
        await loadLanguageIfNeeded(language)

        const html = highlighter.codeToHtml(code, {
            lang: language,
            theme: SHIKI_THEME,
        })

        const preElement = codeElement.parentElement as HTMLElement
        if (!preElement) return

        const temp = document.createElement('div')
        temp.innerHTML = html
        const highlightedPre = temp.firstChild as HTMLElement

        if (highlightedPre) {
            // 移除 Shiki 添加的内联样式
            highlightedPre.removeAttribute('style')
            const codeInside = highlightedPre.querySelector('code')
            if (codeInside) {
                codeInside.removeAttribute('style')
            }

            const originalLangClass = Array.from(preElement.classList).find(cls =>
                cls.startsWith('language-')
            )
            if (originalLangClass) {
                highlightedPre.classList.add(originalLangClass)
            }

            preElement.replaceWith(highlightedPre)
        }
    } catch (error) {
        console.error('代码高亮失败:', error)
    }
}

export async function highlightCodeBlocks(container: HTMLElement): Promise<void> {
    const highlighter = await initHighlighter()
    const codeElements = Array.from(container.querySelectorAll('pre > code'))

    const highlightPromises = codeElements
        .filter(element => !isAlreadyHighlighted(element as HTMLElement))
        .map(element => highlightCodeElement(element as HTMLElement, highlighter))

    await Promise.allSettled(highlightPromises)
}

export function getArticles(): Article[] {
    return sortedIndexItems.map(item => ({
        ...item,
        content: '',
    }))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    if (!validateSlug(slug)) {
        console.error(`请求的 slug 格式无效: ${slug}`)
        return null
    }

    const cached = fullArticleBySlug.get(slug)
    if (cached) return cached

    const indexItem = indexBySlug.get(slug)
    if (!indexItem) return null

    const loader = markdownModuleBySlug.get(slug)
    if (!loader) {
        console.warn(`Markdown 模块未找到: ${slug}`)
        return null
    }

    try {
        const raw = await loader()
        const article = await parseArticle(String(raw), slug)
        fullArticleBySlug.set(slug, article)
        fullArticleById.set(article.id, article)
        if (import.meta.env.DEV) {
            console.log(`[Article] Loaded: ${slug}`)
        }
        return article
    } catch (error) {
        console.error(`加载文章失败: ${slug}`, error)
        return null
    }
}

export async function getArticleById(id: string): Promise<Article | null> {
    const cached = fullArticleById.get(id)
    if (cached) return cached

    const indexItem = indexById.get(id)
    if (!indexItem) return null

    return getArticleBySlug(indexItem.slug)
}

export function renderMarkdown(content: string): string {
    return mdPlain.render(content)
}

export function disposeHighlighter(): void {
    if (highlighterInstance) {
        highlighterInstance = null
        loadedLanguages.clear()
    }
}

export function getArticleIndex(): ArticleIndexItem[] {
    return indexItems
}

export function getArticleIndexById(id: string): ArticleIndexItem | null {
    return indexById.get(id) || null
}

export function getArticleIndexBySlug(slug: string): ArticleIndexItem | null {
    return indexBySlug.get(slug) || null
}

export function getSearchIndex(): Array<{ id: string; searchText: string }> {
    return searchIndex
}

export function getArticleSlugFromPath(filePath: string): string {
    return extractSlug(filePath)
}
