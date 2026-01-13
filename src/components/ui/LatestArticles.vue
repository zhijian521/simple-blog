<!--
  LatestArticles - 最新文章列表组件

  展示最新发布的 3 篇文章，位于首页底部与 Git 活动图之间。
  采用极简设计风格，使用项目水墨阴影系统。
-->
<template>
    <div class="latest-articles">
        <div class="articles-list">
            <RouterLink
                v-for="article in latestArticles"
                :key="article.id"
                :to="`/article/${article.id}`"
                class="article-item"
            >
                <span class="article-title">{{ article.title }}</span>
                <time class="article-date">{{ formattedDate(article.date) }}</time>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getArticles } from '@/utils/markdown'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'

const latestArticles = getArticles().slice(0, 3)

const formattedDate = (date: string): string => {
    return formatDate(date, 'short')
}
</script>

<style scoped>
.latest-articles {
    position: fixed;
    bottom: 10vh;
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
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 11px;
    text-decoration: none;
    transition: border-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease, background 0.2s ease;
    box-shadow:
        0 2px 10px rgba(0, 0, 0, 0.05),
        0 4px 20px rgba(0, 0, 0, 0.03);
    overflow: hidden;
}

.article-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
}

.article-item:hover {
    border-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px) saturate(190%);
    -webkit-backdrop-filter: blur(16px) saturate(190%);
    box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 8px 32px rgba(0, 0, 0, 0.05);
}

.article-item:hover::before {
    opacity: 1;
}

.article-item:active {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px) saturate(170%);
    -webkit-backdrop-filter: blur(8px) saturate(170%);
}

.article-title {
    position: relative;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-light);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: var(--spacing-md);
    z-index: 1;
    text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
}

.article-date {
    position: relative;
    font-size: 11px;
    font-weight: 400;
    color: var(--color-text-lighter);
    white-space: nowrap;
    letter-spacing: 0.02em;
    z-index: 1;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    opacity: 0.75;
    transition: opacity 0.3s ease;
}

.article-item:hover .article-date {
    opacity: 1;
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
        padding: 9px var(--spacing-sm);
        backdrop-filter: blur(10px) saturate(170%);
        -webkit-backdrop-filter: blur(10px) saturate(170%);
        border-radius: 10px;
    }

    .article-title {
        font-size: var(--font-size-xs);
        margin-right: var(--spacing-sm);
    }

    .article-date {
        font-size: 10px;
    }
}

@media (max-width: 640px) {
    .latest-articles {
        padding: var(--spacing-xs) var(--spacing-2xl);
    }

    .articles-list {
        gap: 7px;
    }

    .article-item {
        padding: 8px var(--spacing-sm);
    }

    .article-title {
        font-size: 0.75rem;
    }

    .article-date {
        font-size: 9px;
    }
}
</style>
