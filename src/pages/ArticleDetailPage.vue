<template>
    <div class="article-detail">
        <LoadingState v-if="loading" />

        <NotFoundPage v-else-if="!article" />

        <article v-else class="article-content">
            <div class="article-header">
                <h1 class="article-title">{{ article.title }}</h1>
                <ArticleBreadcrumb :category="article.category" :date="article.date" />
                <ArticleMeta :article="article" />
                <div v-if="article.tags && article.tags.length" class="article-tags">
                    <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
            </div>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="article-body" v-html="sanitizedContent"></div>

            <div class="article-footer">
                <ViewArticleButton to="/articles" text="返回列表" />
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
import ArticleBreadcrumb from '@/components/article/ArticleBreadcrumb.vue'
import ViewArticleButton from '@/components/ui/ViewArticleButton.vue'
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
    padding: var(--spacing-xl) var(--spacing-lg);
}

.article-content {
    /* 移除背景、边框和圆角，采用简洁的水墨风格 */
}

.article-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    /* 使用更淡的分隔线 */
    border-bottom: 1px solid var(--color-bg-secondary);
}

.article-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    line-height: 1.4;
    font-weight: 400;
}

.article-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-top: var(--spacing-md);
}

/* Markdown 内容样式 */
.article-body {
    color: var(--color-text);
    line-height: 1.8;
    font-size: var(--font-size-base);
    font-weight: 390;
    word-wrap: break-word;
}

/* 标题样式 */
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
    margin-top: var(--spacing-2xl);
    margin-bottom: var(--spacing-md);
    font-weight: 400;
    color: var(--color-text);
    line-height: 1.4;
}

.article-body :deep(h2) {
    font-size: var(--font-size-2xl);
    margin-top: var(--spacing-2xl);
}

.article-body :deep(h3) {
    font-size: var(--font-size-xl);
}

.article-body :deep(h4) {
    font-size: var(--font-size-lg);
}

/* 段落样式 */
.article-body :deep(p) {
    margin-bottom: var(--spacing-md);
}

.article-body :deep(p:last-child) {
    margin-bottom: 0;
}

/* 链接样式 */
.article-body :deep(a) {
    color: var(--color-accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all var(--transition-fast) ease;
    position: relative;
}

.article-body :deep(a:hover) {
    border-bottom-color: var(--color-accent);
    opacity: 0.7;
}

.article-body :deep(a code) {
    color: inherit;
}

/* 列表样式 */
.article-body :deep(ul),
.article-body :deep(ol) {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
}

.article-body :deep(ul) {
    list-style-type: disc;
}

.article-body :deep(ol) {
    list-style-type: decimal;
}

.article-body :deep(li) {
    margin-bottom: var(--spacing-xs);
    line-height: 1.8;
}

.article-body :deep(li > p) {
    margin-bottom: var(--spacing-xs);
}

.article-body :deep(ul ul),
.article-body :deep(ol ul),
.article-body :deep(ul ol),
.article-body :deep(ol ol) {
    margin-top: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
}

/* 引用块样式 */
.article-body :deep(blockquote) {
    border-left: var(--border-width-md) solid var(--color-border);
    padding: var(--spacing-sm) var(--spacing-md);
    margin: var(--spacing-md) 0;
    color: var(--color-text-light);
    background: var(--color-bg-page);
    border-radius: 0 var(--spacing-sm) var(--spacing-sm) 0;
}

.article-body :deep(blockquote p) {
    margin-bottom: 0;
}

.article-body :deep(blockquote p + p) {
    margin-top: var(--spacing-sm);
}

/* 行内代码样式 */
.article-body :deep(code) {
    background: rgba(0, 0, 0, 0.04);
    padding: var(--spacing-code-inline);
    border-radius: var(--radius-sm);
    font-size: 0.875em;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    border: 1px solid rgba(0, 0, 0, 0.06);
    color: var(--color-text);
    word-wrap: break-word;
}

.article-body :deep(a code) {
    background: rgba(26, 26, 26, 0.08);
    border-color: rgba(26, 26, 26, 0.12);
}

/* 代码块样式 */
.article-body :deep(pre) {
    background: var(--color-bg-page);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    overflow-x: auto;
    margin: var(--spacing-md) 0;
    font-size: 0.875em;
    line-height: 1.6;
}

.article-body :deep(pre::-webkit-scrollbar) {
    height: 6px;
}

.article-body :deep(pre::-webkit-scrollbar-track) {
    background: transparent;
}

.article-body :deep(pre::-webkit-scrollbar-thumb) {
    background: var(--color-border);
    border-radius: 3px;
}

.article-body :deep(pre::-webkit-scrollbar-thumb:hover) {
    background: var(--color-text-lighter);
}

.article-body :deep(pre code) {
    background: transparent;
    padding: 0;
    border-radius: 0;
    border: none;
    font-size: inherit;
    color: inherit;
}

/* 图片样式 */
.article-body :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--spacing-md) 0;
    display: block;
}

/* 表格样式 */
.article-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-md) 0;
    font-size: 0.9375em;
    overflow-x: auto;
    display: block;
}

.article-body :deep(thead) {
    border-bottom: 2px solid var(--color-border);
}

.article-body :deep(th),
.article-body :deep(td) {
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
}

.article-body :deep(th) {
    background: var(--color-bg-page);
    font-weight: 500;
    color: var(--color-text);
}

.article-body :deep(tbody tr) {
    border-bottom: 1px solid var(--color-border);
}

.article-body :deep(tbody tr:last-child) {
    border-bottom: none;
}

.article-body :deep(tbody tr:hover) {
    background: var(--color-bg-page);
}

/* 分隔线样式 */
.article-body :deep(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-2xl) 0;
}

/* 文本强调样式 */
.article-body :deep(strong) {
    font-weight: 500;
    color: var(--color-text);
}

.article-body :deep(em) {
    font-style: italic;
    color: var(--color-text-light);
}

.article-body :deep(del),
.article-body :deep(s) {
    color: var(--color-text-lighter);
    text-decoration: line-through;
}

.article-footer {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-bg-secondary);
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .article-detail {
        padding: var(--spacing-xl) var(--spacing-mobile);
    }

    .article-title {
        font-size: var(--font-size-2xl);
    }

    .article-body {
        font-size: var(--font-size-sm);
    }

    .article-body :deep(h2) {
        font-size: var(--font-size-xl);
    }

    .article-body :deep(h3) {
        font-size: var(--font-size-lg);
    }

    .article-body :deep(pre) {
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
    }

    .article-body :deep(table) {
        font-size: 0.875em;
    }

    .article-body :deep(th),
    .article-body :deep(td) {
        padding: var(--spacing-xs) var(--spacing-sm);
    }
}

@media (max-width: 480px) {
    .article-detail {
        padding: var(--spacing-lg) var(--spacing-mobile);
    }

    .article-title {
        font-size: var(--font-size-xl);
    }

    .article-body {
        font-size: var(--font-size-sm);
        line-height: 1.7;
    }
}
</style>
