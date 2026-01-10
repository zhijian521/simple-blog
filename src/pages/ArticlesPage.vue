<template>
    <div class="articles-page">
        <h1 class="page-title">文章列表</h1>

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

// 立即加载文章列表（支持 SSR）
// 在服务端渲染时同步执行，确保生成的 HTML 包含完整内容
const loadArticles = () => {
    articles.value = getArticles()
    loading.value = false
}

loadArticles()

onMounted(() => {
    // 客户端导航时重新加载数据
    loadArticles()
})
</script>

<style scoped>
.articles-page {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-lg);
}

.page-title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
    line-height: 1.2;
}

.articles-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}
</style>
