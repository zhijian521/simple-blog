import MarkdownIt from 'markdown-it'
import frontMatter from 'front-matter'
import type { Article } from '../types/article'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 使用 Vite 的 import.meta.glob 动态导入所有 markdown 文件
const markdownModules = import.meta.glob('../../blogs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

// 解析所有文章
const articlesMap = new Map<string, Article>()
const articlesList: Article[] = []

// 初始化文章列表
Object.entries(markdownModules).forEach(([path, content]) => {
  // 从路径中提取相对路径作为 slug (例如: blogs/开发/Git/Git基础命令.md -> 开发/Git/Git基础命令)
  const slug = path.replace(/^.*\/blogs\//, '').replace(/\.md$/, '')
  const article = parseMarkdown(content as string, slug)
  articlesMap.set(slug, article)
  articlesList.push(article)
})

// 按日期排序（最新的在前）
articlesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export async function getArticles(): Promise<Article[]> {
  return articlesList
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articlesMap.get(slug) || null
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function parseMarkdown(markdownContent: string, slug: string): Article {
  const { attributes, body } = frontMatter(markdownContent)

  return {
    slug,
    title: attributes.title || 'Untitled',
    date: attributes.date || new Date().toISOString().split('T')[0],
    excerpt: attributes.excerpt || attributes.description || body.slice(0, 200) + '...',
    content: renderMarkdown(body),
    author: attributes.author,
    tags: attributes.tags || []
  }
}
