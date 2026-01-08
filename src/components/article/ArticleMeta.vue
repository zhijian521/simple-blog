<!--
  ArticleMeta - 文章元信息组件

  用途：
  - 显示文章的发布日期和作者信息
  - 用于文章卡片和文章详情页

  功能：
  - 格式化日期显示
  - 显示作者信息
  - 使用点分隔符布局

  Props:
  - article: Article - 文章对象（包含 date 和 author 字段）
-->
<template>
    <div class="article-meta">
        <span v-if="article.date" class="article-date">{{ formatDate(article.date) }}</span>
        <span v-if="article.author" class="article-author">{{ article.author }}</span>
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
