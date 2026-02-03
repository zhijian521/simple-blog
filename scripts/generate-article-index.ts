#!/usr/bin/env node

/**
 * 生成文章索引（用于列表/搜索，避免打包全部文章内容）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildArticleIndex } from './shared/article-index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    blogsDir: path.resolve(__dirname, '../blogs'),
    outputDir: path.resolve(__dirname, '../src/generated'),
    outputPath: path.resolve(__dirname, '../src/generated/article-index.json'),
} as const

function main() {
    const items = buildArticleIndex(CONFIG.blogsDir)

    fs.mkdirSync(CONFIG.outputDir, { recursive: true })
    fs.writeFileSync(CONFIG.outputPath, JSON.stringify(items, null, 2), 'utf-8')

    console.log(`✓ 文章索引已生成: ${CONFIG.outputPath}`)
    console.log(`✓ 共 ${items.length} 篇文章`)
}

main()
