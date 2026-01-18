#!/usr/bin/env node

/**
 * 生成 sitemap.xml
 * 在 build 时自动执行
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://www.yuwb.dev'

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function scanArticles() {
  const blogsDir = path.resolve(process.cwd(), 'blogs')
  const articles = []

  const scanDirectory = dir => {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      if (file.isDirectory()) {
        scanDirectory(fullPath)
      } else if (file.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const idMatch = content.match(/^id:\s*(.+)$/m)
        const dateMatch = content.match(/^date:\s*(.+)$/m)

        if (idMatch) {
          const stats = fs.statSync(fullPath)
          articles.push({
            id: idMatch[1].trim(),
            date: dateMatch ? dateMatch[1].trim() : formatDate(stats.mtime),
          })
        }
      }
    }
  }

  try {
    scanDirectory(blogsDir)
  } catch (error) {
    console.error('扫描文章失败:', error.message)
  }

  return articles
}

function main() {
  console.log('📄 开始生成 sitemap.xml...')

  const articles = scanArticles()
  console.log(`✓ 找到 ${articles.length} 篇文章`)

  const updated = formatDate(new Date())

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${updated}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/articles</loc>
        <lastmod>${updated}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
${articles
  .map(
    article => `    <url>
        <loc>${SITE_URL}/article/${article.id}</loc>
        <lastmod>${article.date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`
  )
  .join('\n')}
</urlset>`

  const publicDir = path.resolve(process.cwd(), 'public')
  const outputPath = path.join(publicDir, 'sitemap.xml')

  fs.writeFileSync(outputPath, xml, 'utf-8')

  console.log(`✓ sitemap.xml 已生成: ${outputPath}`)
  console.log('✓ 完成！')
}

main()
