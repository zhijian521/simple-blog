<template>
    <div class="article-detail">
        <LoadingState v-if="loading" />

        <EmptyState v-else-if="!article" title="文章未找到" message="抱歉，您访问的文章不存在">
            <template #actions>
                <router-link to="/articles" class="btn">返回文章列表</router-link>
            </template>
        </EmptyState>

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
import DOMPurify from 'dompurify'
import { getArticleBySlug } from '@/utils/markdown'
import ArticleMeta from '@/components/article/ArticleMeta.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { Article } from '@/types/article'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

// 净化 HTML 内容，防止 XSS 攻击
// 使用保守的标签白名单，仅保留 Markdown 渲染必需的基础标签
const sanitizedContent = computed(() => {
    if (!article.value) return ''
    return DOMPurify.sanitize(article.value.content, {
        // 基础文本和格式
        ALLOWED_TAGS: [
            'p', // 段落
            'br', // 换行
            'strong', // 粗体
            'em', // 斜体
            'u', // 下划线
            's', // 删除线
            'code', // 行内代码
            'pre', // 代码块
            'blockquote', // 引用
            // 列表
            'ul', // 无序列表
            'ol', // 有序列表
            'li', // 列表项
            // 标题
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            // 链接和图片
            'a', // 链接
            'img', // 图片
            // 分隔线
            'hr',
        ],
        ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class'],
        ALLOW_DATA_ATTR: false,
        // 禁止 JavaScript 协议链接
        ALLOWED_URI_REGEXP:
            /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    })
})

const loadArticle = (slug: string) => {
    loading.value = true
    const decodedSlug = decodeURIComponent(slug)
    article.value = getArticleBySlug(decodedSlug)
    loading.value = false
}

onMounted(() => {
    const slug = route.params.slug as string
    loadArticle(slug)
})

watch(
    () => route.params.slug,
    newSlug => {
        if (newSlug) {
            loadArticle(newSlug as string)
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

.btn {
    display: inline-block;
    padding: var(--spacing-btn-vertical) var(--spacing-lg);
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    border-radius: var(--radius-sm);
    text-decoration: none;
    margin-top: var(--spacing-md);
}
</style>
