<template>
    <div class="articles-page">
        <SearchButton @open="showSearch = true" />
        <header class="page-header">
            <h1 class="page-title">文章列表</h1>
        </header>

        <EmptyState v-if="articles.length === 0" title="暂无文章" message="还没有发布任何文章" />

        <div v-else class="articles-list">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
        </div>

        <!-- macOS 风格 Dock 菜单栏 -->
        <Dock :items="dockItems" position="bottom" />

        <!-- 搜索模态框 -->
        <SearchModal :visible="showSearch" @close="showSearch = false" />

        <!-- 文档树模态框 -->
        <DocumentTreeModal :visible="showDocumentTree" @close="showDocumentTree = false" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getArticles } from '@/utils/markdown'
import ArticleCard from '@/components/article/ArticleCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Dock from '@/components/ui/Dock.vue'
import SearchButton from '@/components/ui/SearchButton.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import DocumentTreeModal from '@/components/ui/DocumentTreeModal.vue'
import { createDockItems } from '@/constants/dock'
import type { Article } from '@/types/article'

const articles = getArticles() as Article[]
const showSearch = ref(false)
const showDocumentTree = ref(false)

// 创建 Dock 配置，传入搜索和列表动作
const dockItems = createDockItems(
    () => {
        showSearch.value = true
    },
    () => {
        showDocumentTree.value = true
    }
).articleList
</script>

<style scoped>
.articles-page {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg);
    padding-bottom: 5rem;
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
        padding: var(--spacing-2xl) var(--spacing-mobile);
        padding-bottom: 4rem;
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
        padding: var(--spacing-xl) var(--spacing-mobile);
        padding-bottom: 4rem;
    }

    .page-title {
        font-size: var(--font-size-lg);
    }
}
</style>
