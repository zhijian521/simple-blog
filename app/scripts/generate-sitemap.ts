#!/usr/bin/env node

/**
 * 生成 sitemap.xml
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { SitemapPage, Article } from './shared/types.js'
import { formatDate } from './shared/date.js'
import { buildArticleIndex } from './shared/article-index.js'
import { SITE_CONFIG } from '../../config/site.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    siteUrl: SITE_CONFIG.url,
    docsDir: path.resolve(__dirname, '../../docs'),
    outputPath: path.resolve(__dirname, '../public/sitemap.xml'),
    articlePriority: '0.6' as const,
    articleChangefreq: 'monthly' as const,
    pages: [
        { loc: '/', changefreq: 'daily' as const, priority: '1.0' as const },
        { loc: '/articles', changefreq: 'weekly' as const, priority: '0.8' as const },
        { loc: '/newspaper', changefreq: 'weekly' as const, priority: '0.7' as const },
    ] satisfies SitemapPage[],
} as const

/**
 * 扫描文章并获取日期信息
 */
function scanArticles(): { articles: Article[]; latestDate: string | null } {
    const indexItems = buildArticleIndex(CONFIG.docsDir)
    let latestDate: string | null = null

    const articles: Article[] = indexItems.map(item => {
        if (!latestDate || item.date > latestDate) {
            latestDate = item.date
        }
        return { id: item.id, date: item.date }
    })

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
