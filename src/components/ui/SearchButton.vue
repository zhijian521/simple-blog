<!--
  SearchButton - 搜索按钮组件

  位于首页右上角，点击打开搜索模态框
  液态透明玻璃效果，支持快捷键 Cmd/Ctrl + K
-->
<template>
    <button
        class="search-button"
        @click="openSearch"
        :title="shortcutHint"
        aria-label="搜索文章"
    >
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
        </svg>
    </button>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

interface Emits {
    (e: 'open'): void
}

const emit = defineEmits<Emits>()

const isMac = computed(() => {
    return typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
})

const shortcutHint = computed(() => {
    return isMac.value ? '快捷键：⌘K' : '快捷键：Ctrl + K'
})

const openSearch = () => {
    emit('open')
}

// 监听快捷键
const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.search-button {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    z-index: 100;
    transition: background 0.2s ease;
}

.search-button:hover {
    background: rgba(0, 0, 0, 0.06);
}

.search-button:active {
    background: rgba(0, 0, 0, 0.1);
}

.search-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-light);
    flex-shrink: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .search-button {
        top: var(--spacing-md);
        right: var(--spacing-md);
        width: 36px;
        height: 36px;
    }

    .search-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
