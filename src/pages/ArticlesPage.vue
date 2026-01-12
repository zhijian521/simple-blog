<template>
    <div class="articles-page">
        <header class="page-header">
            <h1 class="page-title">文章列表</h1>
        </header>

        <LoadingState v-if="loading" />

        <EmptyState
            v-else-if="articles.length === 0"
            title="暂无文章"
            message="还没有发布任何文章"
        />

        <div v-else class="articles-list">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '@/utils/markdown'
import ArticleCard from '@/components/article/ArticleCard.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import type { Article } from '@/types/article'

const articles = ref<Article[]>([])
const loading = ref(true)

loadArticles()

onMounted(() => {
    loadArticles()
})

function loadArticles() {
    articles.value = getArticles()
    loading.value = false
}
</script>

<style scoped>
.articles-page {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-lg);
}

.page-header {
    margin: var(--spacing-md) 0;
    padding: 0 var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
}

.page-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
}

.articles-list {
    display: flex;
    flex-direction: column;
}

@media (max-width: 768px) {
    .articles-page {
        padding: var(--spacing-xl) var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .articles-page {
        padding: var(--spacing-lg) var(--spacing-lg);
    }
}

@media (max-width: 360px) {
    .articles-page {
        padding: var(--spacing-md) var(--spacing-md);
    }
}
</style>
