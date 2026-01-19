<template>
    <div class="pagination">
        <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            aria-label="上一页"
            @click="goToPage(currentPage - 1)"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>

        <div class="pagination-pages">
            <template
                v-for="(item, index) in visiblePages"
                :key="typeof item === 'number' ? item : `ellipsis-${index}`"
            >
                <button
                    v-if="typeof item === 'number'"
                    class="pagination-page"
                    :class="{ active: item === currentPage }"
                    @click="goToPage(item)"
                >
                    {{ item }}
                </button>
                <span v-else class="pagination-ellipsis">...</span>
            </template>
        </div>

        <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            aria-label="下一页"
            @click="goToPage(currentPage + 1)"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    currentPage: number
    totalPages: number
}

const emit = defineEmits<{
    (e: 'pageChange', page: number): void
}>()

const props = defineProps<Props>()

type PageItem = number | 'ellipsis'

// 计算显示的页码
const visiblePages = computed<PageItem[]>(() => {
    const { currentPage, totalPages } = props

    // 总页数小于等于7，全部显示
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: PageItem[] = []

    // 始终显示第一页
    pages.push(1)

    // 当前页靠近开头
    if (currentPage <= 4) {
        pages.push(2, 3, 4, 5, 'ellipsis', totalPages)
    }
    // 当前页靠近结尾
    else if (currentPage >= totalPages - 3) {
        pages.push(
            'ellipsis',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
        )
    }
    // 当前页在中间
    else {
        pages.push(
            'ellipsis',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            'ellipsis',
            totalPages
        )
    }

    return pages
})

const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('pageChange', page)
    }
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-2xl);
}

.pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: var(--border-width-sm) solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-ink);
}

.pagination-btn:hover:not(:disabled) {
    background: var(--color-bg-page);
    border-color: var(--color-text-light);
    box-shadow: var(--shadow-ink-hover);
    transform: translateY(-1px);
}

.pagination-btn:active:not(:disabled) {
    transform: translateY(0);
}

.pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    box-shadow: none;
}

.pagination-pages {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.pagination-page {
    min-width: 36px;
    height: 36px;
    padding: 0 var(--spacing-sm);
    border: var(--border-width-sm) solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-ink);
}

.pagination-page:hover {
    background: var(--color-bg-page);
    border-color: var(--color-text-light);
    box-shadow: var(--shadow-ink-hover);
    transform: translateY(-1px);
}

.pagination-page.active {
    background: var(--color-text);
    color: var(--color-bg);
    border-color: var(--color-text);
    box-shadow: var(--shadow-md);
}

.pagination-ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    padding: 0 var(--spacing-sm);
    color: var(--color-text-lighter);
    font-size: var(--font-size-sm);
    user-select: none;
}

/* 移动端响应式 */
@media (max-width: 480px) {
    .pagination {
        gap: var(--spacing-xs);
    }

    .pagination-btn,
    .pagination-page,
    .pagination-ellipsis {
        width: 32px;
        height: 32px;
        min-width: 32px;
        font-size: var(--font-size-xs);
    }
}
</style>
