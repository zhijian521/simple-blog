import { computed, type Ref } from 'vue'
import { useHead } from '@vueuse/head'
import { SITE_CONFIG } from '../../../config/site.config'
import type { Article } from '../types/article'

const META_DESCRIPTION_MAX_LENGTH = 160
const META_KEYWORD_MAX_COUNT = 18

function normalizeMetaDescription(text: string): string {
    const normalized = text.replace(/\s+/g, ' ').trim()
    if (normalized.length <= META_DESCRIPTION_MAX_LENGTH) {
        return normalized
    }
    return `${normalized.slice(0, META_DESCRIPTION_MAX_LENGTH - 3)}...`
}

function normalizeKeywords(keywords: string[], maxCount = META_KEYWORD_MAX_COUNT): string {
    const normalizedKeywords: string[] = []
    const seen = new Set<string>()

    for (const keyword of keywords.map(item => item.trim()).filter(Boolean)) {
        const key = keyword.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        normalizedKeywords.push(keyword)
        if (normalizedKeywords.length >= maxCount) break
    }

    return normalizedKeywords.join(', ')
}

function splitCategoryKeywords(category?: string): string[] {
    if (!category) return []
    const parts = category
        .split('/')
        .map(item => item.trim())
        .filter(Boolean)
    return [category, ...parts]
}

function extractTitleKeywords(title?: string): string[] {
    if (!title) return []
    const parts = title
        .split(/[|：:·,，\-—\s]+/)
        .map(item => item.trim())
        .filter(item => item.length > 1)
    return [title, ...parts]
}

type ArticleSeoInput = Pick<Article, 'title' | 'excerpt' | 'category' | 'tags'> | null

export function buildArticleMetaDescription(article: ArticleSeoInput): string {
    if (!article) {
        return normalizeMetaDescription(SITE_CONFIG.description)
    }

    const contextParts: string[] = []
    if (article.category) {
        contextParts.push(`分类：${article.category}`)
    }
    if (article.tags && article.tags.length > 0) {
        contextParts.push(`标签：${article.tags.slice(0, 3).join('、')}`)
    }

    const baseDescription = article.excerpt || SITE_CONFIG.description
    const contextualDescription = contextParts.length
        ? `${baseDescription} ${contextParts.join('，')}。`
        : baseDescription

    return normalizeMetaDescription(contextualDescription)
}

export function buildArticleMetaKeywords(article: ArticleSeoInput): string {
    const siteKeywords = SITE_CONFIG.keywords.split(',').map(item => item.trim())
    const articleKeywords = article
        ? [
              ...splitCategoryKeywords(article.category),
              ...(article.tags || []),
              ...extractTitleKeywords(article.title),
              '技术文章',
              '技术教程',
              '开发实践',
          ]
        : []

    return normalizeKeywords([...articleKeywords, ...siteKeywords])
}

export function useArticleSeo(article: Ref<Article | null>): void {
    const pageTitle = computed(() => {
        return article.value ? `${article.value.title} - ${SITE_CONFIG.title}` : SITE_CONFIG.title
    })

    const pageDescription = computed(() => {
        return buildArticleMetaDescription(article.value)
    })

    const pageUrl = computed(() => {
        return article.value ? `${SITE_CONFIG.url}/article/${article.value.id}` : SITE_CONFIG.url
    })

    const pageImage = computed(() => {
        return `${SITE_CONFIG.url}/logo.png`
    })

    const pageKeywords = computed(() => {
        return buildArticleMetaKeywords(article.value)
    })

    const jsonLd = computed(() => {
        if (!article.value) return null

        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.value.title,
            description: pageDescription.value,
            image: pageImage.value,
            author: {
                '@type': 'Person',
                name: SITE_CONFIG.author,
            },
            publisher: {
                '@type': 'Organization',
                name: SITE_CONFIG.title,
                url: SITE_CONFIG.url,
                logo: {
                    '@type': 'ImageObject',
                    url: pageImage.value,
                },
            },
            datePublished: article.value.date,
            dateModified: article.value.date,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': pageUrl.value,
            },
        }
    })

    useHead({
        title: pageTitle,
        link: [{ rel: 'canonical', href: pageUrl }],
        meta: [
            { name: 'description', content: pageDescription },
            { name: 'author', content: SITE_CONFIG.author },
            { name: 'keywords', content: pageKeywords },
            { property: 'og:title', content: pageTitle },
            { property: 'og:description', content: pageDescription },
            { property: 'og:type', content: 'article' },
            { property: 'og:url', content: pageUrl },
            { property: 'og:image', content: pageImage },
            { property: 'og:locale', content: 'zh_CN' },
            { property: 'og:site_name', content: SITE_CONFIG.title },
            { property: 'article:published_time', content: article.value?.date },
            { property: 'article:modified_time', content: article.value?.date },
            { property: 'article:author', content: SITE_CONFIG.author },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:url', content: pageUrl },
            { name: 'twitter:title', content: pageTitle },
            { name: 'twitter:description', content: pageDescription },
            { name: 'twitter:image', content: pageImage },
        ],
        script: article.value
            ? [
                  {
                      type: 'application/ld+json',
                      children: JSON.stringify(jsonLd.value),
                  },
              ]
            : [],
    })
}
