<template>
    <div v-show="visible" class="search-modal" @click.self="handleClose">
        <div class="modal-wrapper">
            <div class="modal-background-layer"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">文章搜索</h2>
                    <button aria-label="关闭" class="modal-close" @click="handleClose">
                        <CloseIcon class="close-icon" />
                    </button>
                </div>

                    <div class="search-input-wrapper">
                        <svg
                            class="search-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
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
                            aria-label="搜索文章"
                            @input="handleSearch"
                        />
                        <button
                            v-if="searchQuery"
                            class="clear-button"
                            aria-label="清除搜索"
                            @click="clearSearch"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                aria-hidden="true"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div class="modal-content">
                        <div v-if="loading" class="search-loading">
                            <div class="loading-spinner" aria-hidden="true"></div>
                            <span>搜索中...</span>
                        </div>

                        <div v-else-if="searchQuery && results.length === 0" class="search-empty">
                            <p>未找到相关文章</p>
                        </div>

                        <div v-else-if="results.length > 0" class="results-list">
                            <RouterLink
                                v-for="article in results"
                                :key="article.id"
                                :to="`/article/${article.id}`"
                                class="result-item"
                                @click="handleClose"
                            >
                                <div class="result-header">
                                    <h3 class="result-title">{{ article.title }}</h3>
                                    <time class="result-date" :datetime="article.date">
                                        {{ formatDate(article.date) }}
                                    </time>
                                </div>
                                <p class="result-excerpt">{{ article.excerpt }}</p>
                                <div v-if="article.tags.length" class="result-tags">
                                    <span v-for="tag in article.tags" :key="tag" class="result-tag">
                                        {{ tag }}
                                    </span>
                                </div>
                            </RouterLink>
                        </div>

                        <div v-else class="search-hint">
                            <p>输入关键词搜索文章</p>
                            <div class="search-tips">
                                <span class="tip">支持搜索标题、标签和简介</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { getArticles } from '@/utils/markdown'
import { searchArticles } from '@/utils/search'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'
import CloseIcon from '@/components/icons/CloseIcon.vue'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

// 常量配置
const SEARCH_DEBOUNCE_MS = 300

// 响应式状态
const searchQuery = ref('')
const results = ref<Article[]>([])
const loading = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
let searchTimer: number | null = null



// 执行搜索
const performSearch = () => {
    const articles = getArticles()
    results.value = searchArticles(searchQuery.value, articles)
    loading.value = false
}

// 搜索输入处理（防抖）
const handleSearch = () => {
    if (searchTimer) {
        clearTimeout(searchTimer)
    }

    loading.value = true
    searchTimer = window.setTimeout(() => {
        performSearch()
        searchTimer = null
    }, SEARCH_DEBOUNCE_MS)
}

// 清除搜索
const clearSearch = () => {
    searchQuery.value = ''
    results.value = []
    loading.value = false

    if (searchTimer) {
        clearTimeout(searchTimer)
        searchTimer = null
    }

    searchInputRef.value?.focus()
}

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
    // ESC: 关闭弹窗
    if (e.key === 'Escape') {
        handleClose()
        return
    }

    // Q: 关闭弹窗（输入框无焦点时）
    if ((e.key === 'q' || e.key === 'Q') && document.activeElement !== searchInputRef.value) {
        handleClose()
    }
}

// 监听弹窗可见性
watch(
    () => props.visible,
    (isVisible) => {
        if (isVisible) {
            document.addEventListener('keydown', handleKeydown)
            nextTick(() => {
                searchInputRef.value?.focus()
            })
        } else {
            document.removeEventListener('keydown', handleKeydown)
            clearSearch()
        }
    }
)

// 组件卸载时清理
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (searchTimer) {
        clearTimeout(searchTimer)
    }
})
</script>

<style scoped>
.search-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    background: transparent;
}

.modal-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 600px;
    pointer-events: auto;
}

.modal-background-layer {
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -1px 0 rgba(0, 0, 0, 0.02);
    pointer-events: none;
}

.modal-background-layer::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.15) 100%
    );
    pointer-events: none;
}

.modal-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
}

.modal-title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    letter-spacing: 0.05em;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.625rem;
    height: 1.625rem;
    padding: 0;
    border: none;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0.625rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
}

.modal-close:active {
    transform: scale(0.95);
}

.close-icon {
    width: 0.875rem;
    height: 0.875rem;
    stroke: var(--color-text-light);
    stroke-width: 2;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    flex-shrink: 0;
}

.search-icon {
    position: absolute;
    left: calc(1.5rem + 0.75rem);
    width: 1.25rem;
    height: 1.25rem;
    stroke: var(--color-text-light);
    stroke-width: 2;
    pointer-events: none;
    z-index: 1;
}

.search-input {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.5);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    outline: none;
    padding: 0.75rem 0.75rem 0.75rem 2.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.search-input:focus {
    border-color: rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.8);
}

.search-input::placeholder {
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-normal);
}

.clear-button {
    position: absolute;
    right: calc(1.5rem + 0.75rem);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    cursor: pointer;
    stroke: var(--color-text-lighter);
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.clear-button:hover {
    background: rgba(0, 0, 0, 0.1);
    stroke: var(--color-text);
}

.clear-button svg {
    width: 0.875rem;
    height: 0.875rem;
}

.modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    overflow-x: hidden;
}

.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.15);
}

.search-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3rem 0;
    color: var(--color-text-lighter);
    font-size: var(--font-size-sm);
}

.loading-spinner {
    width: 1.25rem;
    height: 1.25rem;
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

.search-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
}

.search-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    text-align: center;
}

.search-hint p {
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
    margin: 0 0 0.75rem 0;
}

.search-tips {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.tip {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    background: rgba(0, 0, 0, 0.03);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
}

.results-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.result-item {
    display: block;
    padding: 0.75rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s ease;
    cursor: pointer;
}

.result-item:hover {
    background: rgba(0, 0, 0, 0.04);
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.result-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    margin: 0;
    color: var(--color-text);
}

.result-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
}

.result-excerpt {
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
    margin: 0 0 0.5rem 0;
    line-height: 1.6;
}

.result-tags {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
}

.result-tag {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    background: rgba(0, 0, 0, 0.04);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
}
</style>
