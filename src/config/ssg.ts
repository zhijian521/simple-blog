import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

/**
 * SSG（静态站点生成）配置
 * 负责扫描文章并生成需要预渲染的路由列表
 */

/**
 * 递归扫描 blogs 目录，提取所有文章的 ID
 */
function scanArticles(): string[] {
    const blogsDir = resolve(process.cwd(), 'blogs')
    const articles: string[] = []

    const scanDirectory = (dir: string) => {
        const files = readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
            const fullPath = resolve(dir, file.name)
            if (file.isDirectory()) {
                scanDirectory(fullPath)
            } else if (file.name.endsWith('.md')) {
                const content = readFileSync(fullPath, 'utf-8')
                const match = content.match(/^id:\s*(.+)$/m)
                if (match) {
                    const id = match[1].trim()
                    articles.push(id)
                }
            }
        }
    }

    try {
        scanDirectory(blogsDir)
    } catch (error) {
        console.error('Failed to scan articles:', error)
    }

    return articles
}

/**
 * 获取需要预渲染的路由列表
 */
export function getIncludedRoutes(): string[] {
    const articles = scanArticles()
    const articleRoutes = articles.map(id => `/article/${id}`)
    return ['/', '/articles', ...articleRoutes]
}
