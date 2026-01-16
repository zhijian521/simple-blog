<!--
  ArticleCard - 文章卡片组件

  用途：
  - 用于文章列表页展示文章摘要信息
  - 采用卡片式布局，悬停时有微妙效果

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
        <router-link
            :to="ROUTES.ARTICLE(article.id)"
            class="article-link"
            :aria-label="`阅读全文：${article.title}`"
        >
            <div class="article-content">
                <div class="article-header">
                    <h3 class="article-title">{{ article.title }}</h3>
                    <time class="article-date">{{ formatDate(article.date) }}</time>
                </div>

                <ArticleMeta :article="article" />

                <p v-if="showExcerpt" class="article-excerpt">
                    {{ article.excerpt }}
                </p>

                <div v-if="showTags && article.tags && article.tags.length" class="article-footer">
                    <div class="article-tags">
                        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                    <span class="read-more">阅读全文 →</span>
                </div>
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
    display: block;
}

.article-link {
    display: block;
    padding: var(--spacing-lg);
    background: var(--card-default-bg);
    border: 1px solid var(--card-default-border);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: inherit;
    box-shadow: var(--card-default-shadow);
    transition: all var(--transition-base) ease;
}

.article-link:hover {
    background: var(--card-hover-bg);
    border-color: var(--card-hover-border);
    box-shadow: var(--card-hover-shadow);
}

.article-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    color: var(--color-text);
    transition: color var(--transition-base) ease;
}

.article-link:hover .article-content {
    color: var(--color-accent);
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
}

.article-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    line-height: 1.4;
    flex: 1;
    letter-spacing: 0.02em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-date {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
}

.article-excerpt {
    font-size: var(--font-size-sm);
    line-height: 1.8;
    letter-spacing: 0.02em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-sm);
}

.article-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
}

.article-tags .tag {
    font-size: var(--font-size-xs);
    padding: var(--spacing-tag);
    background: var(--color-bg-page);
    border-radius: var(--radius-sm);
    letter-spacing: 0.03em;
    font-weight: var(--font-weight-medium);
}

.read-more {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    letter-spacing: 0.05em;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .article-link {
        padding: var(--spacing-md);
    }

    .article-footer {
        flex-direction: row;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .article-tags {
        flex: 1;
        min-width: 0;
        display: flex;
        gap: var(--spacing-xs);
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .article-tags::-webkit-scrollbar {
        display: none;
    }

    .article-tags .tag {
        flex-shrink: 0;
    }

    .read-more {
        flex-shrink: 0;
    }
}

@media (max-width: 480px) {
    .article-header {
        gap: var(--spacing-sm);
    }

    .article-title {
        font-size: calc(var(--font-size-base) - 0.05rem);
    }

    .article-excerpt {
        font-size: calc(var(--font-size-sm) - 0.025rem);
        line-height: 1.6;
    }

    .article-tags .tag {
        font-size: var(--font-size-xxs);
        padding: 2px var(--spacing-xs);
    }

    .read-more {
        font-size: var(--font-size-xxs);
    }
}
</style>
