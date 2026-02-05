<template>
    <div class="newspaper-page">
        <div class="ink-bg-decoration"></div>

        <header class="newspaper-header">
            <div class="header-border-top"></div>
            <div class="header-content">
                <div class="header-seal"></div>
                <h1 class="newspaper-title">耶温博客</h1>
                <div class="header-divider-line"></div>
                <p class="newspaper-subtitle">记录思考 · 分享知识 · 探索技术</p>
                <div class="newspaper-meta">
                    <span class="meta-item">{{ currentDateFormatted }}</span>
                    <span class="meta-separator">·</span>
                    <span class="meta-item">第 {{ currentWeekNumber }} 周</span>
                    <span class="meta-separator">·</span>
                    <span class="meta-item">共 {{ totalArticles }} 篇</span>
                </div>
            </div>
            <div class="header-border-bottom"></div>
        </header>

        <div class="waterfall-container">
            <div
                v-for="(column, colIndex) in articleColumns"
                :key="colIndex"
                class="waterfall-column"
            >
                <div
                    v-for="article in column"
                    :key="article.id"
                    class="article-card"
                    :class="[article.cardStyle, { pinned: article.sticky && article.sticky > 0 }]"
                >
                    <div class="card-corner-top-left"></div>
                    <div class="card-corner-bottom-right"></div>

                    <h3 class="article-title-row">
                        <router-link :to="`/article/${article.id}`" class="article-title">
                            <span
                                v-if="article.category"
                                class="article-category"
                                @click.stop="handleCategoryClick(article.category)"
                            >
                                {{ getCategoryName(article.category) }}
                            </span>
                            {{ article.title }}
                        </router-link>
                    </h3>

                    <p class="article-excerpt">{{ article.excerpt }}</p>

                    <div class="article-divider"></div>

                    <div class="article-footer">
                        <time class="article-date">{{ article.formattedDate }}</time>
                        <router-link :to="`/article/${article.id}`" class="article-link">
                            阅读全文 →
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-decoration">
            <div class="footer-seal"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { getArticles } from '@/utils/markdown'
import type { Article } from '@/types/article'

const EXCERPT_MAX_LENGTH = 80
const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7

type CardStyle = 'featured' | 'highlight' | 'standard'

interface DisplayArticle extends Article {
    index: number
    cardStyle: CardStyle
    excerpt: string
    formattedDate: string
}

/**
 * 根据窗口宽度计算列数（与 CSS 媒体查询保持一致）
 */
function getColCount(width: number): number {
    if (width >= 2560) return 6
    if (width >= 1920) return 5
    if (width >= 1600) return 4
    if (width >= 1440) return 3
    if (width >= 1024) return 3
    if (width >= 768) return 2
    if (width >= 641) return 2
    return 1
}

const windowWidth = ref(0)

const updateWindowWidth = (): void => {
    if (typeof window === 'undefined') return
    windowWidth.value = window.innerWidth
}

onMounted(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
})

// 缓存文章列表，避免重复调用
const rawArticles = getArticles()

/**
 * 将文章分配到多个列中，实现错落效果
 *
 * 例如：5 篇文章，3 列
 * 列 0: [文章0, 文章3]
 * 列 1: [文章1, 文章4]
 * 列 2: [文章2]
 */
const articleColumns = computed<DisplayArticle[][]>(() => {
    const cols = getColCount(windowWidth.value)

    // 创建空列
    const columns: DisplayArticle[][] = Array.from({ length: cols }, () => [])

    // 分配文章到各列（从左到右顺序）
    rawArticles.forEach((article, index) => {
        const colIndex = index % cols
        columns[colIndex].push({
            ...article,
            index,
            cardStyle: getCardStyle(index),
            excerpt: getExcerpt(article),
            formattedDate: formatShortDate(article.date),
        })
    })

    return columns
})

const totalArticles = computed(() => rawArticles.length)

const currentDateFormatted = computed(() => {
    const now = new Date()
    return formatDate(now)
})

const currentWeekNumber = computed(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - start.getTime()
    return Math.ceil(diff / MS_PER_WEEK)
})

function getCardStyle(index: number): CardStyle {
    const styles: CardStyle[] = ['featured', 'highlight', 'standard']
    return styles[index % styles.length]
}

function getCategoryName(category: string): string {
    return category.split('/').pop() || category
}

function handleCategoryClick(category: string): void {
    // TODO: 实现分类筛选功能
    // 当前只打印日志，未来可以跳转到分类筛选页面
    // router.push({ path: '/articles', query: { category } })
    console.log('点击分类:', category)
}

function getExcerpt(article: Article): string {
    const excerpt = article.excerpt || ''
    return excerpt.length > EXCERPT_MAX_LENGTH
        ? excerpt.substring(0, EXCERPT_MAX_LENGTH) + '...'
        : excerpt
}

function formatDate(dateStr: string | Date): string {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}年${month}月${day}日`
}

function formatShortDate(dateStr: string): string {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
}
</script>

<style scoped>
.newspaper-page {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
}

.ink-bg-decoration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
}

.newspaper-header {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem 1rem 1.5rem;
    border-bottom: 3px double #2c2c2c99;
}

.header-border-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #2c2c2c 30%, #2c2c2c 70%, transparent 100%);
}

.header-border-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
}

.header-content {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
}

.header-seal {
    position: absolute;
    top: -10px;
    right: calc(50% + 80px);
    width: 28px;
    height: 28px;
    border: 2px solid #c8302c;
    border-radius: 3px;
    transform: rotate(45deg);
    opacity: 0.15;
}

.header-seal::before {
    content: '耶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 14px;
    color: #c8302c;
    font-family: 'Noto Serif SC', serif;
}

.newspaper-title {
    font-family: 'Noto Serif SC', 'Songti SC', serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: var(--font-weight-medium);
    color: #1a1a1a;
    margin: 0 0 0.75rem;
    letter-spacing: 0.35em;
    text-indent: 0.35em;
    position: relative;
}

.header-divider-line {
    width: 120px;
    height: 2px;
    margin: 0 auto 1rem;
    background: linear-gradient(90deg, transparent 0%, #8b7355 20%, #8b7355 80%, transparent 100%);
    position: relative;
}

.header-divider-line::before,
.header-divider-line::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 6px;
    height: 6px;
    background: #8b7355;
    border-radius: 50%;
    transform: translateY(-50%);
}

.header-divider-line::before {
    left: -10px;
}

.header-divider-line::after {
    right: -10px;
}

.newspaper-subtitle {
    font-family: 'Noto Serif SC', serif;
    font-size: clamp(0.8125rem, 1.5vw, 1rem);
    font-weight: 400;
    color: #666;
    margin: 0 0 1rem;
    letter-spacing: 0.15em;
}

.newspaper-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #666;
    font-family: 'Times New Roman', serif;
    letter-spacing: 0.05em;
}

.meta-item {
    position: relative;
}

.meta-separator {
    color: #bbb;
    font-weight: 300;
}

.waterfall-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 1.5rem 1rem;
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    overflow: hidden;
}

.waterfall-column {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 320px;
}

.article-card {
    border: 1px solid rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    padding: 1rem;
    background: rgba(26, 26, 26, 0.02);
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.04),
        0 2px 4px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.article-card.pinned {
    border-left: 2px solid #1a1a1a;
    background: linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.05) 0%,
        rgba(26, 26, 26, 0.02) 50%,
        transparent 100%
    );
    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.04),
        0 2px 8px rgba(0, 0, 0, 0.02);
}

.article-card.pinned .article-title {
    color: #1a1a1a;
    font-weight: var(--font-weight-medium);
}

.article-card.pinned:hover {
    border-left: 2px solid #1a1a1a;
    background: linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.08) 0%,
        rgba(26, 26, 26, 0.04) 50%,
        transparent 100%
    );
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.06),
        0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-corner-top-left,
.card-corner-bottom-right {
    position: absolute;
    width: 12px;
    height: 12px;
    border-color: rgba(139, 115, 85, 0.15);
    border-style: solid;
    pointer-events: none;
}

.card-corner-top-left {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
    border-top-left-radius: 4px;
}

.card-corner-bottom-right {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
    border-bottom-right-radius: 4px;
}

.article-card:hover {
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.03),
        0 4px 8px rgba(0, 0, 0, 0.02);
    background: rgba(26, 26, 26, 0.04);
}

.article-card.featured .article-title {
    font-size: 1.0625rem;
}

.article-card.highlight .article-title {
    font-size: 1rem;
}

.article-card.standard .article-title {
    font-size: 0.9375rem;
}

.article-category {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    background: linear-gradient(135deg, #8b7355 0%, #9a826a 100%);
    color: white;
    font-size: 0.6875rem;
    font-weight: 400;
    border-radius: 2px;
    margin-right: 0.5rem;
    letter-spacing: 0.08em;
    box-shadow: 0 1px 2px rgba(139, 115, 85, 0.25);
    transition: all 0.25s ease;
    white-space: nowrap;
    cursor: pointer;
    vertical-align: baseline;
}

.article-category:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(139, 115, 85, 0.3);
}

.article-title-row {
    margin: 0 0 0.625rem;
    line-height: 1.4;
    font-weight: var(--font-weight-medium);
}

.article-title {
    color: #1a1a1a;
    text-decoration: none;
    transition: color 0.25s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    overflow-wrap: break-word;
}

.article-title:hover {
    color: #8b7355;
}

.article-excerpt {
    font-size: 0.8125rem;
    color: #333;
    line-height: 1.7;
    margin: 0 0 0.875rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.article-divider {
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(0, 0, 0, 0.08) 20%,
        rgba(0, 0, 0, 0.08) 80%,
        transparent 100%
    );
    margin: 0.75rem 0;
}

.article-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.125rem;
}

.article-date {
    font-size: 0.6875rem;
    color: #666;
    font-family: 'Times New Roman', serif;
    font-style: italic;
}

.article-link {
    font-size: 0.75rem;
    color: #8b7355;
    text-decoration: none;
    font-weight: 400;
    letter-spacing: 0.05em;
    transition: all 0.25s ease;
    position: relative;
}

.article-link:hover {
    color: #6b5345;
}

.footer-decoration {
    position: relative;
    z-index: 1;
    height: 80px;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-seal {
    width: 36px;
    height: 36px;
    border: 2px solid #c8302c;
    border-radius: 4px;
    transform: rotate(45deg);
    opacity: 0.12;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-seal::before {
    content: '博客';
    transform: rotate(-45deg);
    font-size: 14px;
    color: #c8302c;
    font-family: 'Noto Serif SC', serif;
}

/* 超宽屏 (≥2560px) - 7列 */
@media (min-width: 2560px) {
    .waterfall-container {
        gap: 2rem;
        padding: 2.5rem 2rem;
    }

    .waterfall-column {
        gap: 2rem;
    }

    .article-card {
        padding: 1.25rem;
    }
}

/* 大屏 (1920-2560px) - 6列 */
/* 无需额外样式，flex 自动适应 */

/* 中大屏 (1600-1920px) - 5列 */
/* 无需额外样式，flex 自动适应 */

/* 中等屏 (1440-1600px) - 4列 */
@media (max-width: 1600px) {
    .waterfall-container {
        gap: 1.5rem;
        padding: 1.75rem 1.25rem;
    }

    .waterfall-column {
        gap: 1.5rem;
    }
}

/* 平板横屏 (1024-1440px) - 3列 */
@media (max-width: 1440px) {
    .waterfall-container {
        gap: 1.25rem;
        padding: 1.5rem 1rem;
    }

    .waterfall-column {
        gap: 1.25rem;
    }

    .newspaper-header {
        padding: 2rem 1rem 1.5rem;
    }
}

/* 平板 (768-1024px) - 2列 */
@media (max-width: 1024px) {
    .waterfall-container {
        gap: 1rem;
        padding: 1.25rem 0.875rem;
    }

    .waterfall-column {
        gap: 1rem;
    }

    .article-card {
        padding: 0.875rem;
    }

    .newspaper-header {
        padding: 1.75rem 0.875rem 1.25rem;
    }

    .newspaper-title {
        letter-spacing: 0.3em;
        text-indent: 0.3em;
    }
}

/* 移动端大屏 (640-768px) - 2列紧凑 */
@media (max-width: 768px) {
    .waterfall-container {
        gap: 0.875rem;
        padding: 1rem 0.75rem;
    }

    .waterfall-column {
        gap: 0.875rem;
    }

    .article-card {
        padding: 0.75rem;
    }

    .newspaper-header {
        padding: 1.5rem 0.75rem 1rem;
    }

    .newspaper-title {
        letter-spacing: 0.25em;
        text-indent: 0.25em;
    }

    .header-seal {
        width: 24px;
        height: 24px;
        right: calc(50% + 70px);
    }

    .header-seal::before {
        font-size: 12px;
    }
}

/* 移动端 (≤640px) - 1列 */
@media (max-width: 640px) {
    .waterfall-container {
        gap: 0;
        padding: 1rem 0.625rem;
    }

    .waterfall-column {
        gap: 0;
    }

    .article-card {
        padding: 0.875rem;
        margin-bottom: 0.875rem;
    }

    .newspaper-header {
        padding: 1.5rem 0.625rem 1rem;
    }

    .newspaper-title {
        letter-spacing: 0.2em;
        text-indent: 0.2em;
    }

    .article-excerpt {
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    .article-card.featured .article-title,
    .article-card.highlight .article-title,
    .article-card.standard .article-title {
        font-size: 1rem;
    }

    /* 移动端置顶文章样式 */
    .article-card.pinned {
        border-left: 2px solid #1a1a1a;
    }
}
</style>
