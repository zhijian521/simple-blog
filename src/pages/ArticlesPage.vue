<template>
    <div class="articles-page">
        <header class="page-header">
            <h1 class="page-title">文章列表</h1>
        </header>

        <EmptyState
            v-if="articles.length === 0"
            title="暂无文章"
            message="还没有发布任何文章"
        />

        <div v-else class="articles-list">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getArticles } from '@/utils/markdown'
import ArticleCard from '@/components/article/ArticleCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { Article } from '@/types/article'

// 同步加载文章数据（从内存缓存读取，无需 loading 状态）
const articles = getArticles() as Article[]
</script>

<style scoped>
.articles-page {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg);
    min-height: 100vh;
    position: relative;
}

/* 水墨风格装饰 */
.articles-page::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: var(--gradient-ink);
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.5;
    pointer-events: none;
}

.page-header {
    margin-bottom: var(--spacing-xl);
}

.page-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-normal);
    color: var(--color-text);
    letter-spacing: 0.08em;
}

.articles-list {
    display: grid;
    gap: var(--spacing-lg);
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .articles-page {
        padding: var(--spacing-xl) var(--spacing-lg);
    }

    .articles-page::before {
        width: 200px;
        height: 200px;
    }

    .page-header {
        margin-bottom: var(--spacing-lg);
    }

    .page-title {
        font-size: var(--font-size-xl);
    }

    .articles-list {
        gap: var(--spacing-md);
    }
}

@media (max-width: 480px) {
    .articles-page {
        padding: var(--spacing-lg) var(--spacing-md);
    }

    .page-title {
        font-size: var(--font-size-lg);
    }
}
</style>
