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
                    <button
                        class="activity-btn"
                        title="折叠所有文件树"
                        aria-label="折叠所有文件树"
                        :disabled="explorerPanelView !== 'tree'"
                        @click="collapseAllDirectories"
                    >
                        <CollapseAllIcon />
                    </button>
                    <button
                        class="activity-btn"
                        title="只展开当前文章所在文件树"
                        aria-label="只展开当前文章所在文件树"
                        :disabled="explorerPanelView !== 'tree' || !activeArticleId"
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
                <button
                    class="panel-toggle-btn"
                    type="button"
                    :title="explorerPanelView === 'tree' ? '切换到时间列表' : '切换到文档树'"
                    :aria-label="explorerPanelView === 'tree' ? '切换到时间列表' : '切换到文档树'"
                    :aria-pressed="explorerPanelView === 'latest'"
                    @click="toggleExplorerPanelView"
                >
                    <component :is="explorerPanelView === 'tree' ? ListIcon : DocumentTreeIcon" />
                </button>
            </header>

            <div class="tree-list">
                <template v-if="explorerPanelView === 'tree'">
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
                </template>
                <div v-else class="latest-panel">
                    <div class="latest-list" aria-label="最新文章列表">
                        <button
                            v-for="article in pagedLatestArticles"
                            :key="article.id"
                            class="latest-item"
                            :class="{ 'is-active': article.id === activeArticleId }"
                            :title="article.title"
                            @click="selectArticle(article.id)"
                        >
                            <div class="latest-item-top">
                                <time class="latest-item-date" :datetime="article.date">
                                    {{ formatDate(article.date, 'short') }}
                                </time>
                                <span v-if="article.category" class="latest-item-category">
                                    {{ article.category }}
                                </span>
                            </div>
                            <div class="latest-item-main">
                                <span class="latest-item-title">{{ article.title }}</span>
                                <span class="latest-item-excerpt">
                                    {{ article.excerpt }}
                                </span>
                            </div>
                        </button>
                    </div>

                    <Pagination
                        v-if="latestTotalPages > 1"
                        class="latest-pagination"
                        :current-page="latestCurrentPage"
                        :total-pages="latestTotalPages"
                        @page-change="handleLatestPageChange"
                    />
                </div>
            </div>
        </aside>

        <section class="preview-panel">
            <header class="preview-header">
                <div v-if="openTabs.length > 0" class="tabs-wrap" aria-label="已打开文章">
                    <div class="tabs-scroll" role="tablist" aria-label="已打开文章">
                        <button
                            v-for="tab in openTabs"
                            :key="tab.id"
                            class="tab-item"
                            :class="{ 'is-active': tab.id === activeArticleId }"
                            role="tab"
                            :aria-selected="tab.id === activeArticleId"
                            :title="tab.title"
                            @click="selectArticle(tab.id)"
                            @contextmenu.prevent="openTabContextMenu(tab.id, $event)"
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
                    <button
                        class="tabs-more-btn"
                        type="button"
                        title="更多页签操作"
                        aria-label="更多页签操作"
                        @click.stop="openMoreTabMenu($event)"
                    >
                        <MoreHorizontalIcon />
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

        <SearchModal
            :visible="showSearch"
            :navigate-on-select="false"
            @close="showSearch = false"
            @select="handleSearchSelect"
        />

        <Teleport to="body">
            <div
                v-if="tabMenu.visible"
                ref="tabMenuRef"
                class="tab-context-menu"
                :style="{ left: `${tabMenu.x}px`, top: `${tabMenu.y}px` }"
                @contextmenu.prevent
            >
                <template v-if="tabMenu.scope?.type === 'tab'">
                    <button
                        class="tab-menu-item"
                        :disabled="!canCloseTab(tabMenu.scope.id)"
                        @click="handleTabMenuAction('close')"
                    >
                        {{ TAB_MENU_LABELS.close }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="!canCloseOthersExcept(tabMenu.scope.id)"
                        @click="handleTabMenuAction('close-others')"
                    >
                        {{ TAB_MENU_LABELS.closeOthers }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="!canCloseRightOf(tabMenu.scope.id)"
                        @click="handleTabMenuAction('close-right')"
                    >
                        {{ TAB_MENU_LABELS.closeRight }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="!canCloseLeftOf(tabMenu.scope.id)"
                        @click="handleTabMenuAction('close-left')"
                    >
                        {{ TAB_MENU_LABELS.closeLeft }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="openTabs.length === 0"
                        @click="handleTabMenuAction('close-all')"
                    >
                        {{ TAB_MENU_LABELS.closeAllForTab }}
                    </button>
                </template>
                <template v-else>
                    <button
                        class="tab-menu-item"
                        :disabled="!canClosePrimaryTab()"
                        @click="handleTabMenuAction('close')"
                    >
                        {{ TAB_MENU_LABELS.close }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="!canCloseOthers()"
                        @click="handleTabMenuAction('close-others')"
                    >
                        {{ TAB_MENU_LABELS.closeOthers }}
                    </button>
                    <button
                        class="tab-menu-item"
                        :disabled="openTabs.length === 0"
                        @click="handleTabMenuAction('close-all')"
                    >
                        {{ TAB_MENU_LABELS.closeAllForMore }}
                    </button>
                </template>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ExplorerTreeNode from '@/components/explorer/ExplorerTreeNode.vue'
import CollapseAllIcon from '@/components/icons/CollapseAllIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import DocumentTreeIcon from '@/components/icons/DocumentTreeIcon.vue'
import ExplorerDocumentIcon from '@/components/icons/ExplorerDocumentIcon.vue'
import FocusTreeIcon from '@/components/icons/FocusTreeIcon.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import GiscusComments from '@/components/comments/GiscusComments.vue'
import Pagination from '@/components/ui/Pagination.vue'
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
const explorerPanelView = ref<'tree' | 'latest'>('tree')
const latestCurrentPage = ref(1)

interface OpenTab {
    id: string
    title: string
}

type TabMenuAction = 'close' | 'close-left' | 'close-right' | 'close-others' | 'close-all'
type TabMenuScope = { type: 'tab'; id: string } | { type: 'more' } | null

const TAB_MENU_LABELS = {
    close: '\u5173\u95ed',
    closeOthers: '\u5173\u95ed\u5176\u4ed6',
    closeRight: '\u5173\u95ed\u53f3\u4fa7\u6807\u7b7e\u9875',
    closeLeft: '\u5173\u95ed\u5de6\u4fa7\u6807\u7b7e\u9875',
    closeAllForTab: '\u5168\u90e8\u5173\u95ed',
    closeAllForMore: '\u5173\u95ed\u5168\u90e8',
} as const

const openTabs = ref<OpenTab[]>([])
const tabMenuRef = ref<HTMLElement | null>(null)
const tabMenu = ref<{ visible: boolean; x: number; y: number; scope: TabMenuScope }>({
    visible: false,
    x: 0,
    y: 0,
    scope: null,
})

const indexItems = getArticleIndex()
const articleIndexById = new Map(indexItems.map(item => [item.id, item]))
const treeNodes = sortExplorerNodes(buildExplorerTree(indexItems))
expandedPaths.value = createInitialExpandedPaths(treeNodes)
const latestArticles = [...indexItems].sort((a, b) => {
    const timeDiff = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (timeDiff !== 0) {
        return timeDiff
    }
    return a.title.localeCompare(b.title, 'zh-CN')
})
const LATEST_PAGE_SIZE = 20
const latestTotalPages = computed(() => Math.max(1, Math.ceil(latestArticles.length / LATEST_PAGE_SIZE)))
const pagedLatestArticles = computed(() => {
    const start = (latestCurrentPage.value - 1) * LATEST_PAGE_SIZE
    return latestArticles.slice(start, start + LATEST_PAGE_SIZE)
})

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

function handleSearchSelect(articleId: string): void {
    void selectArticle(articleId)
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

function resetActiveArticleState(): void {
    loadingToken++
    loadingArticle.value = false
    activeArticle.value = null
    activeArticleId.value = ''
}

function applyTabs(nextTabs: OpenTab[], preferredActiveId = ''): void {
    openTabs.value = nextTabs
    if (nextTabs.length === 0) {
        resetActiveArticleState()
        return
    }

    const hasPreferred = preferredActiveId && nextTabs.some(tab => tab.id === preferredActiveId)
    const hasCurrentActive = activeArticleId.value && nextTabs.some(tab => tab.id === activeArticleId.value)
    const nextActiveId = hasPreferred
        ? preferredActiveId
        : hasCurrentActive
          ? activeArticleId.value
          : nextTabs[0].id

    if (nextActiveId !== activeArticleId.value || !activeArticle.value) {
        void selectArticle(nextActiveId)
    }
}

function findTabIndex(id: string): number {
    return openTabs.value.findIndex(tab => tab.id === id)
}

function canCloseLeftOf(id: string): boolean {
    return findTabIndex(id) > 0
}

function canCloseRightOf(id: string): boolean {
    const index = findTabIndex(id)
    return index !== -1 && index < openTabs.value.length - 1
}

function getPrimaryTabId(): string {
    return activeArticleId.value || openTabs.value[0]?.id || ''
}

function canCloseOthers(): boolean {
    return openTabs.value.length > 1 && !!getPrimaryTabId()
}

function canCloseTab(id: string): boolean {
    return findTabIndex(id) !== -1
}

function canClosePrimaryTab(): boolean {
    return !!getPrimaryTabId()
}

function canCloseOthersExcept(id: string): boolean {
    return findTabIndex(id) !== -1 && openTabs.value.length > 1
}

function closeTabsLeftOf(id: string): void {
    const index = findTabIndex(id)
    if (index <= 0) {
        return
    }
    const nextTabs = openTabs.value.filter((_, tabIndex) => tabIndex >= index)
    applyTabs(nextTabs, id)
}

function closeTabsRightOf(id: string): void {
    const index = findTabIndex(id)
    if (index === -1 || index >= openTabs.value.length - 1) {
        return
    }
    const nextTabs = openTabs.value.filter((_, tabIndex) => tabIndex <= index)
    applyTabs(nextTabs, id)
}

function closeOtherTabs(keepId: string): void {
    if (!keepId) {
        return
    }
    const nextTabs = openTabs.value.filter(tab => tab.id === keepId)
    applyTabs(nextTabs, keepId)
}

function closeAllTabs(): void {
    applyTabs([])
}

function closeTabMenu(): void {
    tabMenu.value.visible = false
    tabMenu.value.scope = null
}

function openTabMenu(scope: TabMenuScope, x: number, y: number): void {
    tabMenu.value.visible = true
    tabMenu.value.scope = scope
    tabMenu.value.x = x
    tabMenu.value.y = y

    void nextTick(() => {
        if (!tabMenu.value.visible || !tabMenuRef.value) {
            return
        }

        const menuWidth = tabMenuRef.value.offsetWidth
        const menuHeight = tabMenuRef.value.offsetHeight
        const margin = 8
        const maxX = window.innerWidth - menuWidth - margin
        const maxY = window.innerHeight - menuHeight - margin

        tabMenu.value.x = Math.max(margin, Math.min(tabMenu.value.x, maxX))
        tabMenu.value.y = Math.max(margin, Math.min(tabMenu.value.y, maxY))
    })
}

function openTabContextMenu(id: string, event: MouseEvent): void {
    openTabMenu({ type: 'tab', id }, event.clientX, event.clientY)
}

function openMoreTabMenu(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null
    if (!target) {
        return
    }
    const rect = target.getBoundingClientRect()
    openTabMenu({ type: 'more' }, rect.left, rect.bottom + 6)
}

function handleTabMenuAction(action: TabMenuAction): void {
    const scope = tabMenu.value.scope
    if (!scope) {
        return
    }

    switch (action) {
        case 'close':
            if (scope.type === 'tab') {
                closeTab(scope.id)
            } else {
                const primaryId = getPrimaryTabId()
                if (primaryId) {
                    closeTab(primaryId)
                }
            }
            break
        case 'close-left':
            if (scope.type === 'tab') {
                closeTabsLeftOf(scope.id)
            }
            break
        case 'close-right':
            if (scope.type === 'tab') {
                closeTabsRightOf(scope.id)
            }
            break
        case 'close-others': {
            const keepId = scope.type === 'tab' ? scope.id : getPrimaryTabId()
            closeOtherTabs(keepId)
            break
        }
        case 'close-all':
            closeAllTabs()
            break
    }

    closeTabMenu()
}

function onGlobalPointerDown(event: MouseEvent): void {
    if (!tabMenu.value.visible) {
        return
    }
    const target = event.target as Node | null
    if (target && tabMenuRef.value?.contains(target)) {
        return
    }
    closeTabMenu()
}

function onGlobalKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        closeTabMenu()
    }
}

function goHome(): void {
    void router.push('/')
}

function toggleExplorerPanelView(): void {
    explorerPanelView.value = explorerPanelView.value === 'tree' ? 'latest' : 'tree'
}

function handleLatestPageChange(page: number): void {
    latestCurrentPage.value = page
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
    window.addEventListener('mousedown', onGlobalPointerDown)
    window.addEventListener('keydown', onGlobalKeyDown)

    const defaultArticleId = getArticles()[0]?.id
    if (defaultArticleId) {
        void selectArticle(defaultArticleId)
    }
})

onUnmounted(() => {
    window.removeEventListener('mousedown', onGlobalPointerDown)
    window.removeEventListener('keydown', onGlobalKeyDown)
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
    justify-content: space-between;
    gap: 0.75rem;
    background: rgba(0, 0, 0, 0.02);
}

.panel-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-light);
    margin: 0;
}

.panel-toggle-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    transition:
        background 0.18s ease,
        color 0.18s ease;
}

.panel-toggle-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text);
}

.panel-toggle-btn:focus-visible {
    outline: 1px solid rgba(26, 26, 26, 0.3);
    outline-offset: 1px;
}

.panel-toggle-btn[aria-pressed='true'] {
    background: rgba(0, 0, 0, 0.08);
    color: var(--color-text);
}

.panel-toggle-btn :deep(svg) {
    width: 15px;
    height: 15px;
}

.tree-list {
    flex: 1;
    overflow: auto;
    padding: 0.5rem 0.4rem 0.8rem;
}

.latest-panel {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 0.35rem;
}

.latest-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.latest-item {
    width: 100%;
    padding: 0.78rem 0.82rem 0.8rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.55rem;
    text-align: left;
    color: var(--color-text);
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.12)),
        rgba(0, 0, 0, 0.015);
    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.03),
        0 6px 16px rgba(0, 0, 0, 0.025);
    transition:
        background 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease;
}

.latest-item:hover {
    background:
        linear-gradient(
            90deg,
            rgba(26, 26, 26, 0.07) 0%,
            rgba(26, 26, 26, 0.03) 45%,
            rgba(255, 255, 255, 0.12) 100%
        ),
        rgba(0, 0, 0, 0.035);
    border-color: rgba(26, 26, 26, 0.16);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.05),
        0 10px 20px rgba(0, 0, 0, 0.04);
}

.latest-item.is-active {
    background:
        linear-gradient(
            90deg,
            rgba(26, 26, 26, 0.07) 0%,
            rgba(26, 26, 26, 0.03) 45%,
            rgba(255, 255, 255, 0.12) 100%
        ),
        rgba(0, 0, 0, 0.035);
    border-color: rgba(26, 26, 26, 0.16);
    color: var(--color-text);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.05),
        0 10px 20px rgba(0, 0, 0, 0.04);
}

.latest-item:focus-visible {
    outline: 1px solid rgba(26, 26, 26, 0.28);
    outline-offset: 1px;
}

.latest-item-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.latest-item-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.32rem;
}

.latest-item-title {
    width: 100%;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.55;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.latest-item-excerpt {
    width: 100%;
    font-size: 11px;
    line-height: 1.65;
    color: var(--color-text-light);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.latest-item-category,
.latest-item-date {
    font-size: 11px;
    color: var(--color-text-lighter);
    line-height: 1.4;
}

.latest-item-category {
    max-width: 58%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.12rem 0.45rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.05);
}

.latest-pagination {
    margin-top: auto;
    padding: 0.15rem 0 0.05rem;
}

.latest-pagination :deep(.pagination) {
    gap: 0.35rem;
    margin-top: 0;
}

.latest-pagination :deep(.pagination-pages) {
    gap: 0.35rem;
}

.latest-pagination :deep(.pagination-btn),
.latest-pagination :deep(.pagination-page),
.latest-pagination :deep(.pagination-ellipsis) {
    width: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 11px;
}

.latest-pagination :deep(.pagination-page) {
    padding: 0 0.35rem;
}

.latest-pagination :deep(.pagination-btn:hover:not(:disabled)),
.latest-pagination :deep(.pagination-page:hover) {
    transform: none;
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
    align-items: flex-end;
    height: 37px;
    margin-top: 3px;
    width: 100%;
    padding: 0 0.3rem;
    position: relative;
    overflow: hidden;
}

.tabs-scroll {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    gap: 0.12rem;
    align-items: flex-end;
    overflow-x: auto;
    overflow-y: hidden;
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

.tabs-scroll::-webkit-scrollbar {
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

.tabs-more-btn {
    width: 28px;
    height: 28px;
    min-width: 28px;
    margin: 0 0.16rem 0 0.2rem;
    padding: 0;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-lighter);
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    align-self: center;
    transform: translateY(-1px);
    transition:
        background 0.18s ease,
        color 0.18s ease;
}

.tabs-more-btn :deep(svg) {
    width: 14px;
    height: 14px;
}

.tabs-more-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text);
}

.tabs-more-btn:focus-visible {
    outline: 1px solid rgba(26, 26, 26, 0.3);
    outline-offset: 1px;
}

.tab-context-menu {
    position: fixed;
    width: max-content;
    min-width: 0;
    max-width: min(220px, calc(100vw - 16px));
    padding: 0.28rem;
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 10px;
    background: rgba(241, 234, 220, 0.98);
    box-shadow:
        0 10px 28px rgba(0, 0, 0, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.55);
    z-index: 2200;
}

.tab-menu-item {
    width: auto;
    display: flex;
    align-items: center;
    min-height: 30px;
    padding: 0 0.65rem;
    border-radius: 6px;
    text-align: left;
    white-space: nowrap;
    color: var(--color-text-light);
    font-size: 12px;
    transition:
        background 0.15s ease,
        color 0.15s ease;
}

.tab-menu-item:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-text);
}

.tab-menu-item:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.tab-menu-item:disabled:hover {
    background: transparent;
    color: var(--color-text-light);
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

    .latest-item {
        padding: 0.7rem 0.72rem 0.74rem;
    }

    .latest-item-top {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.32rem;
    }

    .latest-item-category {
        max-width: 100%;
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
