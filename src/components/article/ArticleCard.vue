<!--
  ArticleCard - 文章卡片组件

  用途：
  - 用于文章列表页展示文章摘要信息
  - 提供统一的文章卡片样式

  功能：
  - 显示文章标题、元数据、摘要和标签
  - 支持点击跳转到文章详情页
  - 可控制是否显示摘要和标签
  - Hover 显示边框高亮和阴影效果

  Props:
  - article: Article - 文章对象
  - showExcerpt?: boolean - 是否显示摘要（默认：true）
  - showTags?: boolean - 是否显示标签（默认：true）
-->
<template>
    <article class="article-card">
        <router-link :to="`/article/${article.id}`" class="article-link">
            <h3 class="article-title">{{ article.title }}</h3>
            <ArticleMeta :article="article" />
            <p v-if="showExcerpt" class="article-excerpt">
                {{ article.excerpt }}
            </p>
            <div v-if="showTags && article.tags && article.tags.length" class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
        </router-link>
    </article>
</template>

<script setup lang="ts">
import ArticleMeta from './ArticleMeta.vue'
import type { Article } from '@/types/article'

interface Props {
    article: Article
    showExcerpt?: boolean
    showTags?: boolean
}

withDefaults(defineProps<Props>(), {
    showExcerpt: true,
    showTags: true,
})
</script>

<style scoped>
.article-card {
    background: var(--color-bg);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
}

.article-card:hover {
    border-color: var(--color-accent);
    box-shadow: var(--shadow-md);
}

.article-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.article-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.article-excerpt {
    color: var(--color-text-light);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-top: var(--spacing-md);
}
</style>
