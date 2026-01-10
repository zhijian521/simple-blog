<template>
    <div class="article-detail">
        <LoadingState v-if="loading" />

        <NotFoundPage v-else-if="!article" />

        <article v-else class="article-content">
            <div class="article-header">
                <h1 class="article-title">{{ article.title }}</h1>
                <ArticleMeta :article="article" />
                <div v-if="article.tags && article.tags.length" class="article-tags">
                    <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
            </div>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="article-body" v-html="sanitizedContent"></div>

            <div class="article-footer">
                <router-link to="/articles" class="back-link">← 返回文章列表</router-link>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '@/utils/markdown'
import { useArticleSeo } from '@/utils/seo'
import { sanitizeHtmlWithSsr } from '@/utils/dompurify'
import ArticleMeta from '@/components/article/ArticleMeta.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import type { Article } from '@/types/article'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

// SEO 优化：动态生成页面元数据和结构化数据，提升搜索引擎收录效果
useArticleSeo(article)

// 净化 HTML 内容，防止 XSS 攻击
const sanitizedContent = computed(() => {
    if (!article.value) return ''
    return sanitizeHtmlWithSsr(article.value.content)
})

const loadArticle = (id: string) => {
    if (!id || typeof id !== 'string' || id.length === 0) {
        console.error('Invalid article ID:', id)
        article.value = null
        loading.value = false
        return
    }
    // getArticleById 是同步操作，直接获取数据并结束加载状态
    article.value = getArticleById(id)
    loading.value = false
}

// 立即加载文章数据（支持 SSR）
// 在服务端渲染时同步执行，确保生成的 HTML 包含完整内容
const id = route.params.id
const validatedId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
loadArticle(validatedId)

onMounted(() => {
    // 客户端导航时重新加载数据
    loadArticle(validatedId)
})

watch(
    () => route.params.id,
    newId => {
        if (newId) {
            const validatedId =
                typeof newId === 'string' ? newId : Array.isArray(newId) ? newId[0] : ''
            loadArticle(validatedId)
        }
    }
)
</script>

<style scoped>
.article-detail {
    max-width: var(--article-max-width);
    margin: 0 auto;
    padding: var(--spacing-lg);
}

.article-content {
    background: var(--color-bg);
    border-radius: var(--radius-md);
    padding: var(--spacing-2xl);
    border: 1px solid var(--color-border);
}

.article-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
}

.article-title {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    line-height: 1.3;
    font-weight: var(--font-weight-bold);
}

.article-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-top: var(--spacing-md);
}

.article-body {
    font-size: var(--font-size-lg);
    line-height: 1.8;
    color: var(--color-text);
}

.article-body :deep(h2) {
    font-size: var(--font-size-3xl);
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.article-body :deep(h3) {
    font-size: var(--font-size-2xl);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.article-body :deep(p) {
    margin-bottom: var(--spacing-md);
}

.article-body :deep(ul),
.article-body :deep(ol) {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
}

.article-body :deep(li) {
    margin-bottom: var(--spacing-sm);
}

.article-body :deep(code) {
    background: var(--color-bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.9em;
}

.article-body :deep(pre) {
    background: var(--color-code-bg);
    color: var(--color-code-text);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin-bottom: var(--spacing-md);
}

.article-body :deep(pre code) {
    background: none;
    padding: 0;
    color: inherit;
}

.article-body :deep(blockquote) {
    border-left: 3px solid var(--color-accent);
    padding-left: var(--spacing-md);
    margin: var(--spacing-md) 0;
    color: var(--color-text-light);
}

.article-footer {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
}

.back-link {
    display: inline-block;
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: color var(--transition-fast);
}

.back-link:hover {
    color: var(--color-accent);
}
</style>
