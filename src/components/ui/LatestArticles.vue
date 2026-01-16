<template>
    <div class="latest-articles">
        <div v-if="loading" class="articles-list">
            <div v-for="i in 3" :key="i" class="article-item skeleton">
                <span class="article-title skeleton-text"></span>
                <time class="article-date skeleton-text skeleton-text-small"></time>
            </div>
        </div>
        <div v-else class="articles-list">
            <RouterLink
                v-for="article in latestArticles"
                :key="article.id"
                :to="`/article/${article.id}`"
                class="article-item"
                :aria-label="`查看文章：${article.title}`"
            >
                <span class="article-title">{{ article.title }}</span>
                <time class="article-date">{{ formattedDate(article.date) }}</time>
                <span class="article-underline"></span>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '@/utils/markdown'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'

const loading = ref(true)
const latestArticles = ref<Article[]>([])

const formattedDate = (date: string): string => {
    return formatDate(date, 'short')
}

onMounted(() => {
    latestArticles.value = getArticles().slice(0, 3)
    loading.value = false
})
</script>

<style scoped>
.latest-articles {
    position: fixed;
    bottom: var(--latest-articles-bottom);
    left: 0;
    right: 0;
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    z-index: 10;
    pointer-events: none;
}

.articles-list {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: 0 auto;
}

.article-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px var(--spacing-md);
    background: transparent;
    border-radius: var(--radius-sm);
    text-decoration: none;
    transition: all var(--transition-base) ease;
    overflow: hidden;
}

.article-item:hover {
    background: var(--color-bg-secondary);
}

.article-item:hover .article-title,
.article-item:hover .article-date {
    color: var(--color-accent);
}

.article-item:hover .article-date {
    opacity: 1;
}

.article-title {
    position: relative;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-light);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: var(--spacing-md);
    z-index: 1;
    transition: color var(--transition-base) ease;
}

.article-date {
    position: relative;
    font-size: 11px;
    font-weight: 400;
    color: var(--color-text-lighter);
    white-space: nowrap;
    letter-spacing: 0.02em;
    z-index: 1;
    opacity: 0.75;
    transition:
        opacity var(--transition-base) ease,
        color var(--transition-base) ease;
}

.article-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--color-accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform calc(var(--transition-base) * 2) ease;
}

.article-item:hover .article-underline {
    transform: scaleX(1);
}

/* 骨架屏样式 */
.skeleton {
    pointer-events: none;
    cursor: default;
}

.skeleton-text {
    display: inline-block;
    background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.06) 25%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 4px;
    color: transparent !important;
}

.skeleton-text-small {
    width: 80px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .latest-articles {
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .articles-list {
        gap: 8px;
        max-width: 360px;
    }

    .article-item {
        padding: 12px var(--spacing-md);
        border-radius: var(--radius-sm);
    }

    .article-title {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        margin-right: var(--spacing-sm);
    }

    .article-date {
        font-size: 11px;
    }
}

@media (max-width: 640px) {
    .latest-articles {
        padding: var(--spacing-sm) var(--spacing-2xl);
    }

    .articles-list {
        gap: 8px;
    }

    .article-item {
        padding: 11px var(--spacing-md);
    }

    .article-title {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        margin-right: var(--spacing-sm);
    }

    .article-date {
        font-size: 12px;
    }
}
</style>
