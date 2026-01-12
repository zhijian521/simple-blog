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
        <router-link :to="ROUTES.ARTICLE(article.id)" class="article-link">
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
    position: relative;
}

.article-link {
    display: block;
    padding: var(--spacing-lg);
    background: transparent;
    backdrop-filter: blur(5px);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    transition: all var(--transition-base);
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
}

/* 水墨风格背景 */
.article-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: var(--gradient-ink);
    opacity: 0;
    transition: opacity var(--transition-base);
    pointer-events: none;
}

.article-link:hover::before {
    opacity: 1;
}

.article-link:hover {
    border-color: var(--color-text-light);
    box-shadow: var(--shadow-ink);
}

.article-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    position: relative;
    z-index: 1;
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
    color: var(--color-text);
    line-height: 1.4;
    flex: 1;
    letter-spacing: 0.02em;
    transition: color var(--transition-fast);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-link:hover .article-title {
    color: var(--color-link-hover);
}

.article-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-normal);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
}

.article-excerpt {
    color: var(--color-text-light);
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
    border-top: 1px solid var(--color-bg-secondary);
}

.article-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
}

.article-tags .tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    padding: 0.25rem var(--spacing-sm);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    letter-spacing: 0.03em;
}

.article-link:hover .article-tags .tag {
    background: var(--color-bg-secondary);
    border-color: var(--color-text-lighter);
}

.read-more {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-normal);
    transition: all var(--transition-fast);
    letter-spacing: 0.05em;
}

.article-link:hover .read-more {
    color: var(--color-link-hover);
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .article-link {
        padding: var(--spacing-md);
    }

    .article-title {
        font-size: var(--font-size-base);
    }

    .article-excerpt {
        font-size: 0.85rem;
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
    .article-link {
        padding: var(--spacing-md);
    }

    .article-header {
        flex-direction: row;
        gap: var(--spacing-sm);
    }

    .article-title {
        font-size: var(--font-size-sm);
        line-height: 1.4;
        min-width: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .article-date {
        font-size: 0.7rem;
    }

    .article-excerpt {
        font-size: 0.8rem;
        line-height: 1.6;
    }

    .article-tags .tag {
        font-size: 0.65rem;
        padding: 2px var(--spacing-xs);
    }

    .read-more {
        font-size: 0.65rem;
    }
}
</style>
