import fs from 'fs'
import path from 'path'
import matter from 'front-matter'
import { walkDir } from './fs.js'
import { formatDate } from './date.js'

export interface ArticleIndexItem {
    id: string
    slug: string
    title: string
    date: string
    excerpt: string
    author?: string
    category?: string
    tags?: string[]
    sticky?: number
}

const DEFAULT_EXCERPT_LENGTH = 200

function normalizeTags(tags: unknown): string[] {
    if (Array.isArray(tags)) {
        return tags.map(tag => String(tag))
    }
    if (tags) {
        return [String(tags)]
    }
    return []
}

function extractExcerpt(content: string, maxLength = DEFAULT_EXCERPT_LENGTH): string {
    const plainText = content.replace(/[#*`_[\]]/g, '').replace(/\s+/g, ' ').trim()
    if (plainText.length <= maxLength) {
        return plainText
    }
    return `${plainText.slice(0, maxLength)}...`
}

function toSlug(filePath: string, docsDir: string): string {
    const relativePath = path.relative(docsDir, filePath).replace(/\\/g, '/')
    return relativePath.replace(/\.md$/i, '')
}

export function buildArticleIndex(docsDir: string): ArticleIndexItem[] {
    const items: ArticleIndexItem[] = []

    for (const filePath of walkDir(docsDir, '.md')) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { attributes, body } = matter<Record<string, unknown>>(content)
        const stats = fs.statSync(filePath)

        const id = attributes.id ? String(attributes.id) : ''
        if (!id) continue

        const slug = toSlug(filePath, docsDir)
        const title = attributes.title ? String(attributes.title) : path.basename(slug)
        const date = attributes.date ? formatDate(String(attributes.date)) : formatDate(stats.mtime)
        const excerpt =
            (attributes.excerpt ? String(attributes.excerpt) : '') ||
            (attributes.description ? String(attributes.description) : '') ||
            extractExcerpt(body)

        const stickyRaw = attributes.sticky
        const sticky = typeof stickyRaw === 'number' ? stickyRaw : Number(stickyRaw || 0)

        items.push({
            id,
            slug,
            title,
            date,
            excerpt,
            author: attributes.author ? String(attributes.author) : undefined,
            category: attributes.category ? String(attributes.category) : undefined,
            tags: normalizeTags(attributes.tags),
            sticky: Number.isFinite(sticky) ? sticky : 0,
        })
    }

    return items
}
