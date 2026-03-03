<template>
    <div class="explorer-page">
        <div class="activity-rail">
            <aside class="activity-bar" aria-label="快捷操作">
                <div class="activity-actions">
                    <button class="activity-btn" title="返回首页" aria-label="返回首页" @click="goHome">
                        <HomeIcon />
                    </button>
                    <button class="activity-btn" title="搜索文章" aria-label="搜索文章" @click="openSearch">
                        <SearchIcon />
                    </button>
                    <button class="activity-btn" title="折叠所有文件树" aria-label="折叠所有文件树" @click="collapseAllDirectories">
                        <CollapseAllIcon />
                    </button>
                    <button
                        class="activity-btn"
                        title="只展开当前文章所在文件树"
                        aria-label="只展开当前文章所在文件树"
                        :disabled="!activeArticleId"
                        @click="focusActiveArticleTree"
                    >
                        <FocusTreeIcon />
                    </button>
                </div>
            </aside>

            <a
                class="activity-btn activity-bottom-link"
                href="https://github.com/zhijian521/simple-blog"
                title="GitHub"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
            >
                <GitHubIcon />
            </a>
        </div>

        <aside class="tree-panel">
            <header class="panel-header">
                <p class="panel-title">资源管理器</p>
            </header>

            <div class="tree-list">
                <ExplorerTreeNode
                    v-for="node in treeNodes"
                    :key="node.path"
                    :node="node"
                    :level="0"
                    :expanded-paths="expandedPaths"
                    :active-article-id="activeArticleId"
                    @toggle-directory="toggleDirectory"
                    @select-article="selectArticle"
                />
            </div>
        </aside>

        <section class="preview-panel">
            <header class="preview-header">
                <div v-if="openTabs.length > 0" class="tabs-wrap" role="tablist" aria-label="已打开文章">
                    <button
                        v-for="tab in openTabs"
                        :key="tab.id"
                        class="tab-item"
                        :class="{ 'is-active': tab.id === activeArticleId }"
                        role="tab"
                        :aria-selected="tab.id === activeArticleId"
                        :title="tab.title"
                        @click="selectArticle(tab.id)"
                    >
                        <ExplorerDocumentIcon class="tab-icon" />
                        <span class="tab-label">{{ tab.title }}</span>
                        <span
                            class="tab-close"
                            title="关闭页签"
                            @click.stop="closeTab(tab.id)"
                        >
                            <CloseIcon />
                        </span>
                    </button>
                </div>
                <div v-else class="tabs-empty">未打开文章</div>
            </header>

            <div v-if="loadingArticle" class="preview-state">文章加载中...</div>
            <div v-else-if="activeArticle" class="preview-content">
                <div class="article-detail-meta">
                    <div class="detail-tags">
                        <span v-if="activeArticle.category" class="preview-tag is-category">
                            {{ activeArticle.category }}
                        </span>
                        <span v-for="tag in activeArticle.tags || []" :key="tag" class="preview-tag">
                            {{ tag }}
                        </span>
                    </div>
                    <time class="detail-date" :datetime="activeArticle.date">
                        {{ formatDate(activeArticle.date, 'short') }}
                    </time>
                </div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <article class="article-body" v-html="sanitizedContent"></article>

                <GiscusComments
                    v-if="giscusEnabled && activeArticle"
                    :repo="GISCUS_CONFIG.repo"
                    :repo-id="GISCUS_CONFIG.repoId"
                    :category-id="GISCUS_CONFIG.categoryId"
                    :mapping="'specific'"
                    :term="`/article/${activeArticle.id}`"
                    :theme="GISCUS_CONFIG.theme"
                    :input-position="GISCUS_CONFIG.inputPosition"
                    :lazy-load="GISCUS_CONFIG.lazyLoad"
                />
            </div>
            <div v-else class="preview-state">没有找到文章内容</div>
        </section>

        <SearchModal :visible="showSearch" @close="showSearch = false" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ExplorerTreeNode from '@/components/explorer/ExplorerTreeNode.vue'
import CollapseAllIcon from '@/components/icons/CollapseAllIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import ExplorerDocumentIcon from '@/components/icons/ExplorerDocumentIcon.vue'
import FocusTreeIcon from '@/components/icons/FocusTreeIcon.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import GiscusComments from '@/components/comments/GiscusComments.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import { GISCUS_CONFIG, isGiscusConfigured } from '@/constants/giscus'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'
import { sanitizeHtmlWithSsr } from '@/utils/dompurify'
import { formatDate } from '@/utils/date'
import {
    buildExplorerTree,
    createInitialExpandedPaths,
    expandParentPaths,
    sortExplorerNodes,
} from '@/utils/explorer-tree'
import { getArticleById, getArticleIndex, getArticles } from '@/utils/markdown'
import type { Article } from '@/types/article'

const router = useRouter()
const showSearch = ref(false)
const loadingArticle = ref(false)
const activeArticle = ref<Article | null>(null)
const activeArticleId = ref('')
const expandedPaths = ref<Set<string>>(new Set())

interface OpenTab {
    id: string
    title: string
}

const openTabs = ref<OpenTab[]>([])

const indexItems = getArticleIndex()
const articleIndexById = new Map(indexItems.map(item => [item.id, item]))
const treeNodes = sortExplorerNodes(buildExplorerTree(indexItems))
expandedPaths.value = createInitialExpandedPaths(treeNodes)

const sanitizedContent = computed(() => {
    if (!activeArticle.value) {
        return ''
    }
    return sanitizeHtmlWithSsr(activeArticle.value.content)
})

const giscusEnabled = computed(() => isGiscusConfigured())

let loadingToken = 0

function openSearch(): void {
    showSearch.value = true
}

function ensureTabOpened(id: string): void {
    const indexItem = articleIndexById.get(id)
    const nextTitle = indexItem?.title || id
    const existing = openTabs.value.find(tab => tab.id === id)

    if (existing) {
        existing.title = nextTitle
        return
    }

    openTabs.value.push({ id, title: nextTitle })
}

function resolveNextTabId(closedId: string, tabs: OpenTab[]): string {
    const closedIndex = tabs.findIndex(tab => tab.id === closedId)
    if (closedIndex === -1) {
        return ''
    }

    const rightTab = tabs[closedIndex + 1]
    if (rightTab) {
        return rightTab.id
    }

    const leftTab = tabs[closedIndex - 1]
    return leftTab?.id || ''
}

function closeTab(id: string): void {
    const previousTabs = openTabs.value
    const nextActiveId = resolveNextTabId(id, previousTabs)
    const wasActive = activeArticleId.value === id
    openTabs.value = previousTabs.filter(tab => tab.id !== id)

    if (!wasActive) {
        return
    }

    if (!nextActiveId) {
        loadingToken++
        loadingArticle.value = false
        activeArticle.value = null
        activeArticleId.value = ''
        return
    }

    void selectArticle(nextActiveId)
}

function goHome(): void {
    void router.push('/')
}

function toggleDirectory(path: string): void {
    const next = new Set(expandedPaths.value)
    if (next.has(path)) {
        next.delete(path)
    } else {
        next.add(path)
    }
    expandedPaths.value = next
}

function collapseAllDirectories(): void {
    expandedPaths.value = new Set()
}

function focusActiveArticleTree(): void {
    const indexItem = articleIndexById.get(activeArticleId.value)
    if (!indexItem) {
        return
    }
    expandedPaths.value = expandParentPaths(new Set<string>(), indexItem.slug)
}

function ensureParentDirectoriesExpanded(id: string): void {
    const indexItem = articleIndexById.get(id)
    if (!indexItem) {
        return
    }
    expandedPaths.value = expandParentPaths(expandedPaths.value, indexItem.slug)
}

async function loadSelectedArticle(id: string): Promise<void> {
    const token = ++loadingToken
    loadingArticle.value = true
    try {
        const article = await getArticleById(id)

        if (token !== loadingToken) {
            return
        }

        activeArticle.value = article
        activeArticleId.value = article?.id || ''
    } catch {
        if (token !== loadingToken) {
            return
        }
        activeArticle.value = null
        activeArticleId.value = ''
    } finally {
        if (token === loadingToken) {
            loadingArticle.value = false
        }
    }
}

async function selectArticle(id: string): Promise<void> {
    ensureParentDirectoriesExpanded(id)
    ensureTabOpened(id)
    activeArticleId.value = id
    await loadSelectedArticle(id)
}

useKeyboardShortcut('k', openSearch, {
    ctrlKey: true,
    preventDefault: true,
    ignoreInputs: true,
})

useKeyboardShortcut('q', openSearch, {
    ignoreInputs: true,
})

onMounted(() => {
    const defaultArticleId = getArticles()[0]?.id
    if (defaultArticleId) {
        void selectArticle(defaultArticleId)
    }
})
</script>

<style scoped>
.explorer-page {
    --preview-surface-solid: #f1eadc;
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-columns: 48px 320px minmax(0, 1fr);
    grid-template-areas: 'activity tree preview';
    gap: 0.75rem;
    padding: 0.75rem;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--color-bg-page);
    color: var(--color-text);
}

.activity-bar,
.tree-panel,
.preview-panel {
    border-radius: 16px;
    background: var(--preview-surface-solid);
    backdrop-filter: blur(14px) saturate(120%);
    -webkit-backdrop-filter: blur(14px) saturate(120%);
    position: relative;
    overflow: hidden;
}

.activity-rail {
    grid-area: activity;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.activity-bar {
    align-self: start;
    border: 1px solid rgba(255, 255, 255, 0.38);
    box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.42);
    padding: 0.6rem 0.35rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.activity-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
}

.activity-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    transition:
        background 0.2s ease,
        color 0.2s ease;
}

.activity-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text);
}

.activity-btn:focus-visible {
    outline: 2px solid rgba(26, 26, 26, 0.35);
    outline-offset: 1px;
}

.activity-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.activity-btn:disabled:hover {
    background: transparent;
    color: var(--color-text-light);
}

.activity-bottom-link {
    width: 36px;
    height: 36px;
    text-decoration: none;
}

.activity-bottom-link :deep(svg) {
    width: 17px;
    height: 17px;
}

.activity-btn :deep(svg) {
    width: 15px;
    height: 15px;
}

.tree-panel {
    grid-area: tree;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.42);
    min-width: 0;
}

.panel-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    height: 40px;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.02);
}

.panel-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-light);
    margin: 0;
}

.tree-list {
    flex: 1;
    overflow: auto;
    padding: 0.5rem 0.4rem 0.8rem;
}

.preview-panel {
    grid-area: preview;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

.preview-header {
    border-bottom: none;
    padding: 0;
    height: 40px;
    min-height: 40px;
    background: rgba(0, 0, 0, 0.02);
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.tabs-wrap {
    display: flex;
    gap: 0.12rem;
    align-items: flex-end;
    overflow-x: auto;
    overflow-y: hidden;
    height: 37px;
    margin-top: 3px;
    width: 100%;
    padding: 0 0.3rem;
    position: relative;
}

.tabs-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
    pointer-events: none;
    z-index: 0;
}

.tabs-wrap::-webkit-scrollbar {
    height: 4px;
}

.tab-item {
    min-width: 120px;
    max-width: 240px;
    height: 35px;
    padding: 0 0.7rem;
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    color: var(--color-text-light);
    background: transparent;
    transition:
        background 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-radius: 0;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
}

.tab-item:hover:not(.is-active) {
    background: rgba(0, 0, 0, 0.04);
    color: var(--color-text);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.tab-item.is-active {
    background: var(--preview-surface-solid);
    color: var(--color-text);
    border-top: 1px solid rgba(0, 0, 0, 0.14);
    border-left: 1px solid rgba(0, 0, 0, 0.14);
    border-right: 1px solid rgba(0, 0, 0, 0.14);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    height: 37px;
    margin-bottom: -1px;
    position: relative;
    z-index: 3;
}

.tab-item.is-active::after {
    content: '';
    position: absolute;
    left: -1px;
    right: -1px;
    bottom: -2px;
    height: 4px;
    background: var(--preview-surface-solid);
}

.tab-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

.tab-label {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tab-close {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-lighter);
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0;
    pointer-events: none;
    transition:
        opacity 0.18s ease,
        background 0.18s ease,
        color 0.18s ease;
}

.tab-item:hover .tab-close,
.tab-item.is-active .tab-close {
    opacity: 1;
    pointer-events: auto;
}

.tab-close:hover {
    background: rgba(0, 0, 0, 0.08);
    color: var(--color-text);
}

.tab-close:focus-visible {
    outline: 1px solid rgba(26, 26, 26, 0.3);
    outline-offset: 1px;
}

.tab-close :deep(svg) {
    width: 10px;
    height: 10px;
}

.tabs-empty {
    font-size: 12px;
    height: 37px;
    margin-top: 3px;
    padding: 0 0.9rem;
    color: var(--color-text-lighter);
    display: flex;
    align-items: center;
}

.preview-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem clamp(1.25rem, 3vw, 2.25rem) 2.25rem;
    background: var(--preview-surface-solid);
    position: relative;
    z-index: 1;
}

.article-detail-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    margin: 0 0 1.25rem;
    padding-top: 0.4rem;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
}

.detail-date {
    font-size: 0.78rem;
    color: var(--color-text-light);
    white-space: nowrap;
}

.preview-tag {
    display: inline-block;
    padding: 0.08rem 0.5rem;
    border-radius: 999px;
    background: var(--color-bg-secondary);
    color: var(--color-text-light);
    font-size: 0.72rem;
    line-height: 1.6;
}

.preview-tag.is-category {
    color: var(--color-text);
    font-weight: 500;
}

.preview-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.article-body {
    color: var(--color-text);
    line-height: 1.8;
    font-size: var(--font-size-base);
    font-weight: 400;
    word-wrap: break-word;
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
    color: rgba(58, 58, 58, 0.92);
    font-weight: 500;
    font-size: 0.75rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    background-image: linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.07) 0%,
        rgba(26, 26, 26, 0.02) 50%,
        rgba(26, 26, 26, 0.07) 100%
    );
    border-bottom: 1px solid rgba(26, 26, 26, 0.32);
    border-radius: 3px;
    padding: 0.08em 0.4em 0.08em 0.45em;
    margin: 0 0.12em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    transition:
        color var(--transition-fast) ease,
        background-image var(--transition-fast) ease,
        border-bottom-color var(--transition-fast) ease;
}

.article-body :deep(a)::before {
    content: '';
    width: 0.8rem;
    height: 0.8rem;
    margin-left: 0.08em;
    margin-right: 0.38em;
    flex: 0 0 auto;
    background: currentColor;
    mask: url('../assets/link-icon.svg') no-repeat center / contain;
    -webkit-mask: url('../assets/link-icon.svg') no-repeat center / contain;
    opacity: 0.85;
}

.article-body :deep(a:hover) {
    color: var(--color-accent);
    background-image: linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.1) 0%,
        rgba(26, 26, 26, 0.04) 50%,
        rgba(26, 26, 26, 0.1) 100%
    );
    border-bottom-color: rgba(26, 26, 26, 0.5);
}

.article-body :deep(a:focus-visible) {
    outline: 2px solid rgba(26, 26, 26, 0.35);
    outline-offset: 1px;
    background-image: linear-gradient(
        90deg,
        rgba(26, 26, 26, 0.12) 0%,
        rgba(26, 26, 26, 0.05) 50%,
        rgba(26, 26, 26, 0.12) 100%
    );
    border-bottom-color: rgba(26, 26, 26, 0.56);
}

.article-body :deep(a code) {
    color: inherit;
    background: rgba(26, 26, 26, 0.12);
    border-radius: 3px;
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

.article-body :deep(blockquote) {
    position: relative;
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md) var(--spacing-lg);
    padding-left: var(--spacing-xl);
    color: var(--color-text-light);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.03),
        0 2px 8px rgba(0, 0, 0, 0.02);
    font-weight: 400;
    line-height: 1.8;
    overflow: hidden;
    border-left: 3px solid rgba(26, 26, 26, 0.15);
}

.article-body :deep(blockquote p) {
    margin-bottom: 0;
}

.article-body :deep(blockquote p + p) {
    margin-top: var(--spacing-sm);
}

.article-body :deep(code) {
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    color: var(--color-text);
    word-wrap: break-word;
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

@media (max-width: 1200px) {
    .explorer-page {
        grid-template-columns: 44px 280px minmax(0, 1fr);
    }
}

@media (max-width: 960px) {
    .explorer-page {
        height: auto;
        min-height: 100vh;
        grid-template-columns: 44px minmax(0, 1fr);
        grid-template-rows: 45vh minmax(55vh, auto);
        grid-template-areas:
            'activity tree'
            'activity preview';
    }

    .tree-panel {
        grid-column: auto;
        grid-row: auto;
    }

    .preview-panel {
        grid-column: auto;
        grid-row: auto;
        min-height: 55vh;
    }
}

@media (max-width: 768px) {
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

@media (max-width: 640px) {
    .explorer-page {
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .activity-bar,
    .tree-panel,
    .preview-panel {
        border-radius: 12px;
    }

    .panel-header {
        height: 40px;
        padding: 0 0.8rem;
    }

    .preview-content {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .tab-item {
        min-width: 100px;
        max-width: 200px;
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
