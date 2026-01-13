import MarkdownIt from 'markdown-it'
import fm from 'front-matter'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Article, ArticleFrontMatter } from '../types/article'

// ========== 常量配置 ==========
const DEFAULT_EXCERPT_LENGTH = 200

const SHIKI_THEME = 'github-light'

// 常用语言列表（初始化时加载）
const CORE_LANGUAGES = ['javascript', 'typescript', 'bash', 'json', 'html', 'css'] as const

// 支持的所有语言（按需加载）
const SUPPORTED_LANGUAGES = [
    'bash',
    'sh',
    'javascript',
    'typescript',
    'js',
    'ts',
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

// ========== Shiki 高亮器 ==========
let highlighterInstance: Highlighter | null = null
const loadedLanguages = new Set<string>()

/**
 * 初始化 Shiki 高亮器（懒加载）
 */
export async function initHighlighter(): Promise<Highlighter> {
    if (!highlighterInstance) {
        highlighterInstance = await createHighlighter({
            themes: [SHIKI_THEME],
            langs: [...CORE_LANGUAGES],
        })

        // 记录已加载的语言
        CORE_LANGUAGES.forEach(lang => loadedLanguages.add(lang))
    }
    return highlighterInstance
}

/**
 * 按需加载语言
 */
async function loadLanguageIfNeeded(lang: string): Promise<void> {
    if (!highlighterInstance) {
        throw new Error('Highlighter not initialized')
    }

    // 检查是否支持该语言
    if (!SUPPORTED_LANGUAGES.includes(lang as (typeof SUPPORTED_LANGUAGES)[number])) {
        return
    }

    // 检查是否已加载
    if (loadedLanguages.has(lang)) {
        return
    }

    // 加载语言
    await highlighterInstance.loadLanguage(lang as (typeof SUPPORTED_LANGUAGES)[number])
    loadedLanguages.add(lang)
}

// ========== Markdown 渲染器 ==========
const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str: string, lang: string): string => {
        const language = lang || 'plaintext'
        return `<pre><code class="language-${language}">${md.utils.escapeHtml(str)}</code></pre>`
    },
})

// ========== 文章缓存 ==========
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

// ========== 工具函数 ==========

/**
 * 验证 slug 格式，防止路径遍历攻击
 */
function validateSlug(slug: string): boolean {
    const pathTraversalPatterns = ['../', './', '..\\']
    if (pathTraversalPatterns.some(pattern => slug.includes(pattern))) {
        console.error(`路径遍历攻击检测: ${slug}`)
        return false
    }
    return true
}

/**
 * 从文件路径中提取文章 slug
 */
function extractSlug(filePath: string): string {
    return filePath.replace(/^.*[/\\]blogs[/\\]/, '').replace(/\.md$/, '')
}

/**
 * 提取文章摘要
 */
function extractExcerpt(content: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
    const plainText = content.replace(/[#*`_[\]]/g, '').trim()
    return plainText.slice(0, maxLength) + '...'
}

/**
 * 解析 Markdown 文章内容
 */
function parseArticle(markdownContent: string, slug: string): Article {
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

// ========== 代码高亮函数 ==========

/**
 * 检查代码块是否已经高亮
 */
function isAlreadyHighlighted(element: HTMLElement): boolean {
    return element.closest('.shiki') !== null
}

/**
 * 从 code 元素中提取语言
 */
function extractLanguage(element: HTMLElement): string {
    const langClass = Array.from(element.classList).find(cls => cls.startsWith('language-'))
    return langClass ? langClass.replace('language-', '') : 'plaintext'
}

/**
 * 高亮单个代码元素
 */
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
        // 按需加载语言
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
            // 保留原始的 language class
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

/**
 * 高亮容器中的所有代码块
 * 在文章详情页的 onMounted 钩子中调用此函数
 */
export async function highlightCodeBlocks(container: HTMLElement): Promise<void> {
    const highlighter = await initHighlighter()
    const codeElements = Array.from(container.querySelectorAll('pre > code'))

    const highlightPromises = codeElements
        .filter(element => !isAlreadyHighlighted(element as HTMLElement))
        .map(element => highlightCodeElement(element as HTMLElement, highlighter))

    await Promise.allSettled(highlightPromises)
}

// ========== 导出的 API ==========

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

/**
 * 清理 Shiki 高亮器实例
 * 在应用卸载时调用，释放资源
 */
export function disposeHighlighter(): void {
    if (highlighterInstance) {
        // 注意：Shiki 的 Highlighter 实例不需要手动清理
        // 这里我们只是清空引用，让 GC 可以回收
        highlighterInstance = null
        loadedLanguages.clear()
    }
}

// ========== 初始化 ==========
loadArticles()
