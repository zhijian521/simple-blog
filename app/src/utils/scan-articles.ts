import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import matter from 'front-matter'

export interface ArticleInfo {
    id: string
    date?: string
    path: string
}

export interface ArticleInfoWithFileStats extends ArticleInfo {
    stats: {
        mtime: Date
    }
}

export function scanArticles(dir: string): ArticleInfo[] {
    const articles: ArticleInfo[] = []

    const scanDirectory = (currentDir: string) => {
        const files = readdirSync(currentDir, { withFileTypes: true })
        for (const file of files) {
            const fullPath = resolve(currentDir, file.name)
            if (file.isDirectory()) {
                scanDirectory(fullPath)
            } else if (file.name.endsWith('.md')) {
                const content = readFileSync(fullPath, 'utf-8')
                const { attributes } = matter<Record<string, unknown>>(content)
                const id = attributes.id ? String(attributes.id).trim() : ''
                if (id) {
                    articles.push({ id, path: fullPath })
                }
            }
        }
    }

    try {
        scanDirectory(dir)
    } catch (error) {
        console.error('Failed to scan articles:', error)
    }

    return articles
}

export function scanArticlesWithStats(dir: string): ArticleInfoWithFileStats[] {
    const articles: ArticleInfoWithFileStats[] = []

    const scanDirectory = (currentDir: string) => {
        const files = readdirSync(currentDir, { withFileTypes: true })
        for (const file of files) {
            const fullPath = resolve(currentDir, file.name)
            if (file.isDirectory()) {
                scanDirectory(fullPath)
            } else if (file.name.endsWith('.md')) {
                const content = readFileSync(fullPath, 'utf-8')
                const { attributes } = matter<Record<string, unknown>>(content)
                const id = attributes.id ? String(attributes.id).trim() : ''
                const date = attributes.date ? String(attributes.date).trim() : undefined
                const stats = statSync(fullPath)

                if (id) {
                    articles.push({ id, date, path: fullPath, stats: { mtime: stats.mtime } })
                }
            }
        }
    }

    try {
        scanDirectory(dir)
    } catch (error) {
        console.error('Failed to scan articles with stats:', error)
    }

    return articles
}

export function scanArticleIds(): string[] {
    const docsDir = resolve(process.cwd(), 'docs')
    const articles = scanArticles(docsDir)
    return articles.map(article => article.id)
}

function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function scanArticlesForSitemap(): Array<{ id: string; date: string }> {
    const docsDir = resolve(process.cwd(), 'docs')
    const articles = scanArticlesWithStats(docsDir)

    return articles.map(article => {
        const date = article.date || formatDate(article.stats.mtime)
        return { id: article.id, date }
    })
}
