#!/usr/bin/env node

/**
 * 确保 Markdown 文章都有 ID 字段
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'front-matter'
import type { FrontMatterAttributes } from './shared/types.js'
import { walkDir } from './shared/fs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    idLength: 8,
    charset: 'abcdefghijklmnopqrstuvwxyz0123456789',
    blogsDir: path.join(__dirname, '../blogs'),
} as const

/**
 * 生成随机 ID（加密安全）
 */
function generateId(): string {
    const array = new Uint8Array(CONFIG.idLength)
    crypto.getRandomValues(array)
    return Array.from(array, byte => CONFIG.charset[byte % CONFIG.charset.length]).join('')
}

/**
 * 格式化 front-matter 属性值
 */
function formatAttribute(key: string, value: unknown): string {
    if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
    }
    if (typeof value === 'string') {
        return `${key}: ${value}`
    }
    return `${key}: ${JSON.stringify(value)}`
}

/**
 * 更新文章文件的 front-matter
 */
function writeArticle(filePath: string, attributes: FrontMatterAttributes, body: string): void {
    const frontMatter = Object.entries(attributes)
        .map(([key, value]) => formatAttribute(key, value))
        .join('\n')

    const content = `---\n${frontMatter}\n---\n\n${body}`
    fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * 处理单个文章文件
 */
function processArticle(filePath: string, blogsDir: string): boolean {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { attributes, body } = matter(content)

    if (attributes.id) {
        console.log(`✓ ${path.relative(blogsDir, filePath)}: ${attributes.id}`)
        return false
    }

    const newId = generateId()
    writeArticle(filePath, { ...attributes, id: newId }, body)
    console.log(`+ ${path.relative(blogsDir, filePath)}: ${newId}`)
    return true
}

function main() {
    const files = Array.from(walkDir(CONFIG.blogsDir, '.md'))

    console.log(`扫描 ${files.length} 个文件`)

    let updatedCount = 0
    for (const filePath of files) {
        if (processArticle(filePath, CONFIG.blogsDir)) {
            updatedCount++
        }
    }

    console.log(`\n✓ 更新 ${updatedCount} 个文件`)
}

main()
