<template>
    <div class="article-meta">
        <span v-if="article.date" class="article-date">{{ formatDate(article.date) }}</span>
        <span v-if="article.author" class="article-author">{{ article.author }}</span>
        <span v-if="article.readingTime" class="article-reading-time">
            {{ article.readingTime }} 分钟阅读
        </span>
    </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/date'
import type { Article } from '@/types/article'

interface Props {
    article: Article
}

defineProps<Props>()
</script>

<style scoped>
.article-meta {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
}

.article-meta > * {
    display: inline-flex;
    align-items: center;
}

.article-meta > *::before {
    content: '·';
    margin-right: var(--spacing-sm);
}

.article-meta > *:first-child::before {
    content: none;
    margin-right: 0;
}
</style>
