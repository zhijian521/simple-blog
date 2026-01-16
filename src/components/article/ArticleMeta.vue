<!--
  ArticleMeta - 文章元信息组件

  用途：
  - 显示文章的作者信息
  - 用于文章卡片和文章详情页

  Props:
  - article: Article - 文章对象（包含 author 字段）
-->
<template>
    <div v-if="article.author" class="article-meta">
        <span class="author-prefix">by</span>
        <span class="author-name">{{ article.author }}</span>
    </div>
</template>

<script setup lang="ts">
import type { Article } from '@/types/article'

interface Props {
    article: Article
}

defineProps<Props>()
</script>

<style scoped>
.article-meta {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
}

.author-prefix {
    margin-right: 0.25rem;
}

.author-name {
    font-weight: var(--font-weight-medium);
}

@media (max-width: 480px) {
    .article-meta {
        font-size: 0.7rem;
    }

    .author-prefix {
        margin-right: 2px;
    }
}
</style>
