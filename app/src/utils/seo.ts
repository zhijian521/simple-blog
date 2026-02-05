import { computed, type Ref } from 'vue'
import { useHead } from '@vueuse/head'
import { SITE_CONFIG } from '@/constants'
import type { Article } from '@/types/article'

export function useArticleSeo(article: Ref<Article | null>): void {
    const pageTitle = computed(() => {
        return article.value ? `${article.value.title} - ${SITE_CONFIG.title}` : SITE_CONFIG.title
    })

    const pageDescription = computed(() => {
        return article.value?.excerpt || SITE_CONFIG.description
    })

    const pageUrl = computed(() => {
        return article.value ? `${SITE_CONFIG.url}/article/${article.value.id}` : SITE_CONFIG.url
    })

    const pageImage = computed(() => {
        return `${SITE_CONFIG.url}/logo.png`
    })

    const jsonLd = computed(() => {
        if (!article.value) return null

        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.value.title,
            description: article.value.excerpt || SITE_CONFIG.description,
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
            { name: 'keywords', content: article.value?.tags?.join(', ') || SITE_CONFIG.keywords },
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
