<!--
  SearchModal - 搜索模态框组件

  液态透明玻璃效果，支持搜索文章标题、标签和简介
  展示搜索结果列表，点击可跳转到文章详情页
-->
<template>
    <Transition name="modal">
        <div v-if="visible" class="search-modal-overlay" @click="closeOnOverlay">
            <div class="search-modal-container" @click.stop>
                <!-- 搜索输入框 -->
                <div class="search-input-wrapper">
                    <svg
                        class="search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        ref="searchInputRef"
                        v-model="searchQuery"
                        type="text"
                        class="search-input"
                        placeholder="搜索文章标题、标签..."
                        @input="handleSearch"
                    />
                    <button
                        v-if="searchQuery"
                        class="clear-button"
                        @click="clearSearch"
                        aria-label="清除搜索"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <!-- 搜索结果 -->
                <div class="search-results">
                    <div v-if="loading" class="search-loading">
                        <div class="loading-spinner"></div>
                        <span>搜索中...</span>
                    </div>

                    <div v-else-if="searchQuery && results.length === 0" class="search-empty">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p>未找到相关文章</p>
                    </div>

                    <div v-else-if="results.length > 0" class="results-list">
                        <RouterLink
                            v-for="article in results"
                            :key="article.id"
                            :to="`/article/${article.id}`"
                            class="result-item"
                            @click="close"
                        >
                            <div class="result-header">
                                <h3 class="result-title">{{ article.title }}</h3>
                                <time class="result-date">{{ formatDate(article.date) }}</time>
                            </div>
                            <p class="result-excerpt">{{ article.excerpt }}</p>
                            <div v-if="article.tags.length" class="result-tags">
                                <span v-for="tag in article.tags" :key="tag" class="result-tag">{{
                                    tag
                                }}</span>
                            </div>
                        </RouterLink>
                    </div>

                    <div v-else class="search-hint">
                        <p>输入关键词搜索文章</p>
                        <div class="search-tips">
                            <span class="tip">💡 支持搜索标题、标签和简介</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { getArticles } from '@/utils/markdown'
import { searchArticles } from '@/utils/search'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'

interface Props {
    visible: boolean
}

interface Emits {
    (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const results = ref<Article[]>([])
const loading = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

let searchTimer: number | null = null

// 搜索防抖
const handleSearch = () => {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }

    loading.value = true
    searchTimer = window.setTimeout(() => {
        performSearch()
        searchTimer = null
    }, 300)
}

const performSearch = () => {
    const articles = getArticles()
    results.value = searchArticles(searchQuery.value, articles)
    loading.value = false
}

const clearSearch = () => {
    searchQuery.value = ''
    results.value = []
    loading.value = false

    // 清除待执行的搜索定时器
    if (searchTimer) {
        clearTimeout(searchTimer)
        searchTimer = null
    }

    searchInputRef.value?.focus()
}

const close = () => {
    emit('close')
}

const closeOnOverlay = () => {
    close()
}

// 监听 visible 变化，自动聚焦输入框
watch(
    () => props.visible,
    visible => {
        if (visible) {
            nextTick(() => {
                searchInputRef.value?.focus()
            })
        } else {
            clearSearch()
        }
    }
)

// 键盘事件
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
})

const handleKeydown = (e: KeyboardEvent) => {
    if (!props.visible) return

    // ESC 键关闭弹窗
    if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
    }

    // Cmd/Ctrl + K 打开搜索
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        close()
    }
}
</script>

<style scoped>
.search-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-modal-overlay .search-modal-container {
    margin-top: -25vh;
}

.search-modal-container {
    pointer-events: auto;
    width: 90%;
    max-width: 600px;
    background: var(--color-bg-page);
    backdrop-filter: blur(24px) saturate(190%);
    -webkit-backdrop-filter: blur(24px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.04),
        0 8px 32px rgba(0, 0, 0, 0.03),
        inset 0 0.5px 0 rgba(255, 255, 255, 0.8);
    overflow: hidden;
}

/* 搜索输入框 */
.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-lighter);
    margin-right: var(--spacing-md);
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    outline: none;
    padding: var(--spacing-sm) 0;
}

.search-input::placeholder {
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-normal);
}

.clear-button {
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-text-lighter);
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.clear-button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-text);
}

.clear-button svg {
    width: 14px;
    height: 14px;
}

/* 搜索结果区域 */
.search-results {
    height: 400px;
    overflow-y: auto;
    padding: var(--spacing-sm);
}

.search-results::-webkit-scrollbar {
    width: 6px;
}

.search-results::-webkit-scrollbar-track {
    background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
}

/* 加载状态 */
.search-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-2xl) 0;
    color: var(--color-text-lighter);
    font-size: var(--font-size-sm);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--color-text);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 空状态 */
.search-empty {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
    color: var(--color-text-lighter);
}

.search-empty svg {
    width: 48px;
    height: 48px;
    margin: 0 auto var(--spacing-md);
    opacity: 0.5;
}

.search-empty p {
    font-size: var(--font-size-sm);
    margin: 0;
}

/* 搜索提示 */
.search-hint {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
}

.search-hint p {
    color: var(--color-text-lighter);
    font-size: var(--font-size-sm);
    margin: 0 0 var(--spacing-md) 0;
}

.search-tips {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
}

.tip {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    background: rgba(0, 0, 0, 0.03);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
}

/* 结果列表 */
.results-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.result-item {
    display: block;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s ease;
    cursor: pointer;
}

.result-item:hover {
    background: rgba(0, 0, 0, 0.03);
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xs);
}

.result-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    margin: 0;
    color: var(--color-text);
    flex: 1;
    line-height: 1.4;
    letter-spacing: 0.02em;
}

.result-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin: 0 0 var(--spacing-sm) 0;
    line-height: 1.8;
    letter-spacing: 0.02em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.result-date {
    color: var(--color-text-lighter);
    font-size: var(--font-size-xs);
    flex-shrink: 0;
    font-weight: var(--font-weight-normal);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
}

.result-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
}

.result-tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    padding: var(--spacing-tag);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.03em;
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .search-modal-container,
.modal-leave-to .search-modal-container {
    transform: translateY(-20px) scale(0.95);
}

.modal-enter-active .search-modal-container,
.modal-leave-active .search-modal-container {
    transform: translateY(0) scale(1);
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .search-modal-container {
        width: 90%;
        max-width: 500px;
        border-radius: 16px;
    }

    .search-results {
        height: 350px;
    }

    .result-item {
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .result-title {
        font-size: var(--font-size-lg);
    }
}

@media (max-width: 640px) {
    .search-modal-container {
        width: 90%;
        max-width: none;
        border-radius: 12px;
    }

    .search-results {
        height: 300px;
    }

    .result-title {
        font-size: calc(var(--font-size-base) - 0.05rem);
    }

    .result-excerpt {
        font-size: calc(var(--font-size-sm) - 0.025rem);
        line-height: 1.6;
    }

    .result-tag {
        font-size: var(--font-size-xxs);
        padding: 2px var(--spacing-xs);
    }
}
</style>
