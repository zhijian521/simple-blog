#!/usr/bin/env node

/**
 * 生成 sitemap.xml
 */

import fs from 'fs'
import path from 'path'
import matter from 'front-matter'
import { fileURLToPath } from 'url'
import type { SitemapPage, Article } from './shared/types.js'
import { walkDir } from './shared/fs.js'
import { formatDate } from './shared/date.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    siteUrl: 'https://www.yuwb.dev',
    blogsDir: path.resolve(__dirname, '../blogs'),
    outputPath: path.resolve(__dirname, '../public/sitemap.xml'),
    articlePriority: '0.6' as const,
    articleChangefreq: 'monthly' as const,
    pages: [
        { loc: '/', changefreq: 'daily' as const, priority: '1.0' as const },
        { loc: '/articles', changefreq: 'weekly' as const, priority: '0.8' as const },
    ] satisfies SitemapPage[],
} as const

/**
 * 扫描文章并获取日期信息
 */
function scanArticles(): { articles: Article[]; latestDate: string | null } {
    const articles: Article[] = []
    let latestDate: string | null = null

    for (const filePath of walkDir(CONFIG.blogsDir, '.md')) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { attributes } = matter(content)
        const stats = fs.statSync(filePath)

        const id = attributes.id
        if (!id) continue

        const articleDate = attributes.date ? formatDate(attributes.date) : formatDate(stats.mtime)

        if (!latestDate || articleDate > latestDate) {
            latestDate = articleDate
        }

        articles.push({ id, date: articleDate })
    }

    return { articles, latestDate }
}

/**
 * 格式化 URL 条目为 XML
 */
function formatUrlEntry(page: SitemapPage, lastmod: string): string {
    return `    <url>
        <loc>${CONFIG.siteUrl}${page.loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`
}

/**
 * 生成完整的 sitemap XML
 */
function generateSitemap(articles: Article[], latestDate: string | null): string {
    const pageDate = latestDate || formatDate(new Date())

    const pageEntries = CONFIG.pages.map(page => formatUrlEntry(page, pageDate))
    const articleEntries = articles.map(article =>
        formatUrlEntry(
            {
                loc: `/article/${article.id}`,
                changefreq: CONFIG.articleChangefreq,
                priority: CONFIG.articlePriority,
            },
            article.date
        )
    )

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries.join('\n')}
${articleEntries.join('\n')}
</urlset>`
}

function main() {
    console.log('📄 生成 sitemap.xml...')

    const { articles, latestDate } = scanArticles()
    console.log(`✓ ${articles.length} 篇文章`)
    if (latestDate) {
        console.log(`✓ 最新文章日期: ${latestDate}`)
    }

    const xml = generateSitemap(articles, latestDate)
    fs.writeFileSync(CONFIG.outputPath, xml, 'utf-8')
    console.log(`✓ ${CONFIG.outputPath}`)
}

main()
