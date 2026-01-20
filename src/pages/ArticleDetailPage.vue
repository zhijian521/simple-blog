<template>
    <div class="article-detail">
        <NotFoundPage v-if="!article" />

        <article v-else class="article-content">
            <div class="article-header">
                <h1 class="article-title">{{ article.title }}</h1>
                <ArticleBreadcrumb :category="article.category" :date="article.date" />
                <ArticleMeta :article="article" />
                <div v-if="article.tags && article.tags.length" class="article-tags">
                    <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
            </div>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="article-body" v-html="sanitizedContent"></div>

            <!-- Giscus 评论系统 -->
            <GiscusComments
                v-if="isGiscusConfigured && article"
                :repo="GISCUS_CONFIG.repo"
                :repo-id="GISCUS_CONFIG.repoId"
                :category-id="GISCUS_CONFIG.categoryId"
                :mapping="GISCUS_CONFIG.mapping"
                :theme="GISCUS_CONFIG.theme"
                :input-position="GISCUS_CONFIG.inputPosition"
                :lazy-load="GISCUS_CONFIG.lazyLoad"
            />
        </article>

        <!-- macOS 风格 Dock 菜单栏 -->
        <Dock
            v-if="!loading && article"
            :items="dockItems"
            position="bottom"
            :search-visible="showSearch"
        />

        <!-- 搜索模态框 -->
        <SearchModal v-if="!loading && article" :visible="showSearch" @close="showSearch = false" />

        <!-- 文档树模态框 -->
        <DocumentTreeModal
            v-if="!loading && article"
            :visible="showDocumentTree"
            @close="showDocumentTree = false"
        />

        <!-- 文章目录模态框 -->
        <TableOfContentsModal
            v-if="!loading && article"
            :visible="showToc"
            :content="article?.content"
            @close="showToc = false"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById, highlightCodeBlocks, disposeHighlighter } from '@/utils/markdown'
import { useArticleSeo } from '@/utils/seo'
import { sanitizeHtmlWithSsr } from '@/utils/dompurify'
import { extractRouteId, isValidRouteId } from '@/utils/router'
import ArticleMeta from '@/components/article/ArticleMeta.vue'
import ArticleBreadcrumb from '@/components/article/ArticleBreadcrumb.vue'
import GiscusComments from '@/components/comments/GiscusComments.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import Dock from '@/components/ui/Dock.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import DocumentTreeModal from '@/components/ui/DocumentTreeModal.vue'
import TableOfContentsModal from '@/components/ui/TableOfContentsModal.vue'
import { createDockItems } from '@/constants/dock'
import { GISCUS_CONFIG, isGiscusConfigured } from '@/constants/giscus'
import type { Article } from '@/types/article'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)
const highlighting = ref(false)
const showSearch = ref(false)
const showDocumentTree = ref(false)
const showToc = ref(false)

// 创建 Dock 配置，传入搜索、列表和目录动作
const dockItems = createDockItems(
    () => {
        showSearch.value = true
    },
    () => {
        showDocumentTree.value = true
    },
    () => {
        showToc.value = true
    }
).articleDetail

// SEO 优化：动态生成页面元数据和结构化数据，提升搜索引擎收录效果
useArticleSeo(article)

// 净化 HTML 内容，防止 XSS 攻击
const sanitizedContent = computed(() => {
    if (!article.value) return ''
    return sanitizeHtmlWithSsr(article.value.content)
})

// 高亮代码块
const highlightCode = async () => {
    if (highlighting.value) return

    highlighting.value = true
    try {
        await nextTick()
        const container = document.querySelector('.article-body')
        if (container) {
            await highlightCodeBlocks(container as HTMLElement)
        }
    } catch (error) {
        console.error('代码高亮失败:', error)
    } finally {
        highlighting.value = false
    }
}

const loadArticle = (id: string) => {
    // 验证 ID
    if (!isValidRouteId(id)) {
        console.error('Invalid article ID:', id)
        article.value = null
        loading.value = false
        return
    }

    // 获取文章数据
    const foundArticle = getArticleById(id)

    if (!foundArticle) {
        console.warn(`Article not found: ${id}`)
        article.value = null
        loading.value = false
        return
    }

    article.value = foundArticle
    loading.value = false
}

// 立即加载文章数据（支持 SSR）
// 在服务端渲染时同步执行，确保生成的 HTML 包含完整内容
const id = extractRouteId(route.params.id)
loadArticle(id)

onMounted(() => {
    // 客户端导航时重新加载数据
    loadArticle(id)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'auto' })
    // 高亮代码块
    highlightCode()
})

onUnmounted(() => {
    // 清理 Shiki 高亮器实例，释放资源
    disposeHighlighter()
})

watch(
    () => route.params.id,
    async newId => {
        const validatedId = extractRouteId(newId)
        if (validatedId) {
            loadArticle(validatedId)
            // 只在客户端环境执行
            if (!import.meta.env.SSR) {
                // 等待 DOM 更新
                await nextTick()
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'auto' })
                // 高亮代码
                highlightCode()
            }
        }
    }
)
</script>

<style scoped>
.article-detail {
    max-width: var(--article-max-width);
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-lg);
    padding-bottom: 1rem;
}

.article-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    /* 使用更淡的分隔线 */
    border-bottom: 1px solid var(--color-bg-secondary);
}

.article-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-text);
    line-height: 1.4;
    font-weight: 400;
}

.article-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-top: var(--spacing-md);
}

/* Markdown 内容样式 */
.article-body {
    color: var(--color-text);
    line-height: 1.8;
    font-size: var(--font-size-base);
    font-weight: 400;
    word-wrap: break-word;
    /* 允许选择和复制文本 */
    -webkit-user-select: text;
    user-select: text;
    -webkit-touch-callout: default;
}

/* 未高亮的代码块初始样式（防止闪烁） */
.article-body :deep(pre:not(.shiki)) {
    position: relative;
    margin: var(--spacing-md) 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    overflow-x: auto;
    line-height: 1.6;
    font-size: var(--font-size-base);
    background: var(--color-bg-secondary);
    color: var(--color-code-text);
}

.article-body :deep(pre:not(.shiki) code) {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    background: transparent;
    color: inherit;
}

/* 标题样式 */
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
    margin-top: var(--spacing-2xl);
    margin-bottom: var(--spacing-md);
    font-weight: 400;
    color: var(--color-text);
    line-height: 1.4;
}

.article-body :deep(h2) {
    font-size: var(--font-size-2xl);
    margin-top: var(--spacing-2xl);
}

.article-body :deep(h3) {
    font-size: var(--font-size-xl);
}

.article-body :deep(h4) {
    font-size: var(--font-size-lg);
}

/* 段落样式 */
.article-body :deep(p) {
    margin-bottom: var(--spacing-md);
}

.article-body :deep(p:last-child) {
    margin-bottom: 0;
}

/* 链接样式 */
.article-body :deep(a) {
    color: var(--color-accent);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all var(--transition-fast) ease;
    position: relative;
}

.article-body :deep(a:hover) {
    border-bottom-color: var(--color-accent);
    opacity: 0.7;
}

.article-body :deep(a code) {
    color: inherit;
}

/* 列表样式 */
.article-body :deep(ul),
.article-body :deep(ol) {
    margin-bottom: var(--spacing-md);
    padding-left: var(--spacing-lg);
}

.article-body :deep(ul) {
    list-style-type: disc;
}

.article-body :deep(ol) {
    list-style-type: decimal;
}

.article-body :deep(li) {
    margin-bottom: var(--spacing-xs);
    line-height: 1.8;
}

.article-body :deep(li > p) {
    margin-bottom: var(--spacing-xs);
}

.article-body :deep(ul ul),
.article-body :deep(ol ul),
.article-body :deep(ul ol),
.article-body :deep(ol ol) {
    margin-top: var(--spacing-xs);
    margin-bottom: var(--spacing-xs);
}

/* 引用块样式 - 水墨风格优化（更浅） */
.article-body :deep(blockquote) {
    position: relative;
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md) var(--spacing-lg);
    padding-left: var(--spacing-xl);
    color: var(--color-text-light);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    /* 更浅的阴影 */
    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.03),
        0 2px 8px rgba(0, 0, 0, 0.02);
    font-weight: 400;
    line-height: 1.8;
    overflow: hidden;
    /* 左侧浅色边框 */
    border-left: 3px solid rgba(26, 26, 26, 0.15);
}

.article-body :deep(blockquote p) {
    margin-bottom: 0;
}

.article-body :deep(blockquote p + p) {
    margin-top: var(--spacing-sm);
}

/* 行内代码样式 */
.article-body :deep(code) {
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    color: var(--color-text);
    word-wrap: break-word;
}

.article-body :deep(a code) {
    background: rgba(26, 26, 26, 0.08);
}

/* 代码块样式由全局 code-block.css 控制 */

/* 图片样式 */
.article-body :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--spacing-md) 0;
    display: block;
}

/* 表格样式 */
.article-body :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: var(--spacing-md) 0;
    font-size: 0.9375em;
    overflow: hidden;
    border-radius: var(--radius-md);
}

.article-body :deep(thead) {
    border-bottom: 1px solid var(--color-bg-secondary);
}

.article-body :deep(th),
.article-body :deep(td) {
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
}

.article-body :deep(th) {
    background: var(--color-bg-page);
    font-weight: 500;
    color: var(--color-text);
}

.article-body :deep(tbody tr) {
    border-bottom: 1px solid var(--color-bg-secondary);
}

.article-body :deep(tbody tr:last-child) {
    border-bottom: none;
}

.article-body :deep(tbody tr:hover) {
    background: var(--color-bg-page);
}

/* 分隔线样式 */
.article-body :deep(hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--spacing-2xl) 0;
}

/* 文本强调样式 */
.article-body :deep(strong) {
    font-weight: 500;
    color: var(--color-text);
}

.article-body :deep(em) {
    font-style: italic;
    color: var(--color-text-light);
}

.article-body :deep(del),
.article-body :deep(s) {
    color: var(--color-text-lighter);
    text-decoration: line-through;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .article-detail {
        padding: var(--spacing-xl) var(--spacing-mobile);
        padding-bottom: 1rem;
    }

    .article-title {
        font-size: var(--font-size-2xl);
    }

    .article-body {
        font-size: var(--font-size-sm);
    }

    .article-body :deep(h2) {
        font-size: var(--font-size-xl);
    }

    .article-body :deep(h3) {
        font-size: var(--font-size-lg);
    }

    .article-body :deep(table) {
        font-size: 0.875em;
    }

    .article-body :deep(blockquote) {
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .article-detail {
        padding: var(--spacing-lg) var(--spacing-mobile);
        padding-bottom: 1rem;
    }

    .article-title {
        font-size: var(--font-size-xl);
    }

    .article-body {
        font-size: var(--font-size-sm);
        line-height: 1.7;
    }

    .article-body :deep(blockquote) {
        padding: var(--spacing-sm);
        padding-left: var(--spacing-md);
        margin: var(--spacing-md) 0;
    }
}
</style>
