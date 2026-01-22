<template>
    <BaseModal :visible="visible" title="文章搜索" @close="handleClose">
        <template #default>
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
                    <div v-if="article.tags && article.tags.length" class="result-tags">
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
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'
import { getArticles } from '@/utils/markdown'
import { searchArticles } from '@/utils/search'
import { SEARCH_DEBOUNCE_MS } from '@/constants/animation'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/date'
import BaseModal from './BaseModal.vue'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

// 响应式状态
const searchQuery = ref('')
const results = ref<Article[]>([])
const loading = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

// 搜索输入处理（使用 VueUse 防抖）
const performSearch = () => {
    const articles = getArticles()
    results.value = searchArticles(searchQuery.value, articles)
    loading.value = false
}

const handleSearch = useDebounceFn(() => {
    performSearch()
}, SEARCH_DEBOUNCE_MS)

// 清除搜索
const clearSearch = () => {
    searchQuery.value = ''
    results.value = []
    loading.value = false
    searchInputRef.value?.focus()
}

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// ESC: 关闭弹窗（只在弹窗可见时生效）
useKeyboardShortcut('Escape', handleClose, {
    condition: () => props.visible,
})

// Q: 关闭弹窗（输入框无焦点时，且弹窗可见时生效）
useKeyboardShortcut('q', handleClose, {
    ignoreInputs: true,
    condition: () => props.visible && document.activeElement !== searchInputRef.value,
})

// 监听弹窗可见性
watch(
    () => props.visible,
    isVisible => {
        if (isVisible) {
            nextTick(() => {
                searchInputRef.value?.focus()
            })
        } else {
            clearSearch()
        }
    }
)
</script>

<style scoped>
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

@media (max-width: 768px) {
    .search-input-wrapper {
        padding: 0.875rem 1.25rem;
    }

    .search-icon {
        left: calc(1.25rem + 0.75rem);
    }

    .search-input {
        font-size: 0.9rem;
        padding: 0.625rem 0.625rem 0.625rem 2.5rem;
    }

    .clear-button {
        right: calc(1.25rem + 0.75rem);
    }

    .result-item {
        padding: 0.625rem;
    }

    .result-title {
        font-size: 0.9rem;
    }

    .result-date {
        font-size: 0.75rem;
    }

    .result-excerpt {
        font-size: 0.8rem;
    }

    .result-tag {
        font-size: 0.7rem;
        padding: 0.125rem 0.25rem;
    }

    .search-loading,
    .search-empty,
    .search-hint {
        padding: 2rem 0;
    }

    .search-hint p,
    .search-loading span,
    .search-empty p {
        font-size: 0.85rem;
    }

    .tip {
        font-size: 0.7rem;
    }
}

@media (max-width: 480px) {
    .search-input-wrapper {
        padding: 0.75rem 1rem;
    }

    .search-icon {
        left: calc(1rem + 0.625rem);
        width: 1rem;
        height: 1rem;
    }

    .search-input {
        font-size: 0.85rem;
        padding: 0.5rem 0.5rem 0.5rem 2.25rem;
    }

    .clear-button {
        right: calc(1rem + 0.625rem);
        width: 1.25rem;
        height: 1.25rem;
    }

    .clear-button svg {
        width: 0.75rem;
        height: 0.75rem;
    }

    .result-item {
        padding: 0.5rem;
    }

    .result-header {
        gap: 0.5rem;
        margin-bottom: 0.375rem;
    }

    .result-title {
        font-size: 0.85rem;
    }

    .result-date {
        font-size: 0.7rem;
    }

    .result-excerpt {
        font-size: 0.75rem;
        margin-bottom: 0.375rem;
    }

    .result-tag {
        font-size: 0.65rem;
        padding: 0.0625rem 0.25rem;
    }

    .search-loading,
    .search-empty,
    .search-hint {
        padding: 1.5rem 0;
    }

    .search-loading span,
    .search-empty p,
    .search-hint p {
        font-size: 0.75rem;
    }

    .tip {
        font-size: 0.65rem;
        padding: 0.1875rem 0.375rem;
    }
}
</style>
