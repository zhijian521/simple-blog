<!--
  ArticleCard - 文章卡片组件（时间线模式）

  用途：
  - 用于文章列表页展示文章摘要信息
  - 采用时间线布局

 功能：
   - 显示文章标题、日期、作者、摘要和标签
   - 支持点击跳转到文章详情页
   - 可控制是否显示摘要和标签

  Props:
   - article: Article - 文章对象
   - showExcerpt?: boolean - 是否显示摘要（默认：true）
   - showTags?: boolean - 是否显示标签（默认：true）
-->
<template>
    <article class="article-card">
        <div class="timeline-dot"></div>
        <router-link :to="ROUTES.ARTICLE(article.id)" class="article-link">
            <div class="article-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <div class="article-date">{{ formatDate(article.date) }}</div>
            </div>
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
import { ROUTES } from '@/constants'
import { formatDate as formatDateUtil } from '@/utils/date'

interface Props {
    article: Article
    showExcerpt?: boolean
    showTags?: boolean
}

withDefaults(defineProps<Props>(), {
    showExcerpt: true,
    showTags: true,
})

function formatDate(date: string) {
    return formatDateUtil(date, 'short')
}
</script>

<style scoped>
.article-card {
    position: relative;
    padding-left: var(--spacing-xl);
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-lg);
}

.article-card:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 28px;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--color-border) 0%, transparent 100%);
}

.timeline-dot {
    position: absolute;
    left: 0;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-border);
    border: 2px solid var(--color-bg-page);
    box-shadow: 0 0 0 2px var(--color-bg-page);
}

.article-card:hover .timeline-dot {
    background: var(--color-accent);
}

.article-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xs);
}

.article-title {
    font-size: var(--font-size-base);
    color: var(--color-text);
    font-weight: var(--font-weight-medium);
    line-height: 1.4;
    flex: 1;
}

.article-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
}

.article-excerpt {
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
    line-height: 1.7;
    margin-top: var(--spacing-sm);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
    margin-top: var(--spacing-sm);
}

.article-tags .tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    padding: 2px var(--spacing-sm);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
    .article-card {
        padding-left: var(--spacing-lg);
        padding-top: var(--spacing-sm);
        padding-bottom: var(--spacing-md);
    }

    .article-card:not(:last-child)::before {
        left: 6px;
        top: 24px;
    }

    .timeline-dot {
        top: 4px;
        width: 10px;
        height: 10px;
    }

    .article-header {
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .article-title {
        font-size: var(--font-size-sm);
    }

    .article-excerpt {
        font-size: 0.85rem;
        margin-top: var(--spacing-xs);
    }

    .article-tags .tag {
        font-size: 0.75rem;
        padding: 1px var(--spacing-xs);
    }
}

@media (max-width: 480px) {
    .article-card {
        padding-left: var(--spacing-md);
        padding-top: var(--spacing-xs);
        padding-bottom: var(--spacing-sm);
    }

    .article-card:not(:last-child)::before {
        left: 6px;
        top: 22px;
    }

    .timeline-dot {
        top: 3px;
        width: 8px;
        height: 8px;
    }

    .article-header {
        gap: 2px;
    }

    .article-title {
        font-size: var(--font-size-sm);
        line-height: 1.3;
    }

    .article-date {
        font-size: 0.65rem;
    }

    .article-excerpt {
        font-size: 0.8rem;
        margin-top: 4px;
        line-height: 1.6;
    }

    .article-tags .tag {
        font-size: 0.7rem;
    }
}

@media (max-width: 360px) {
    .article-card {
        padding-left: calc(var(--spacing-sm) + 4px);
        padding-top: 2px;
        padding-bottom: calc(var(--spacing-xs) + 2px);
    }

    .article-card:not(:last-child)::before {
        left: 5px;
        top: 20px;
    }

    .timeline-dot {
        left: 1px;
        top: 2px;
        width: 7px;
        height: 7px;
    }

    .article-excerpt {
        font-size: 0.75rem;
    }
}
</style>
