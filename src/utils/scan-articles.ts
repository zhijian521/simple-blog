import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve } from 'path'

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
                const match = content.match(/^id:\s*(.+)$/m)
                if (match) {
                    const id = match[1].trim()
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
                const idMatch = content.match(/^id:\s*(.+)$/m)
                const dateMatch = content.match(/^date:\s*(.+)$/m)
                const stats = statSync(fullPath)

                if (idMatch) {
                    const id = idMatch[1].trim()
                    const date = dateMatch ? dateMatch[1].trim() : undefined
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
    const blogsDir = resolve(process.cwd(), 'blogs')
    const articles = scanArticles(blogsDir)
    return articles.map(article => article.id)
}

function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function scanArticlesForSitemap(): Array<{ id: string; date: string }> {
    const blogsDir = resolve(process.cwd(), 'blogs')
    const articles = scanArticlesWithStats(blogsDir)

    return articles.map(article => {
        const date = article.date || formatDate(article.stats.mtime)
        return { id: article.id, date }
    })
}
