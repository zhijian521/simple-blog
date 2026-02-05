<template>
    <button class="search-button" :title="shortcutHint" aria-label="搜索文章" @click="openSearch">
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
    return isMac.value ? '快捷键：⌘K 或 Q' : '快捷键：Ctrl + K 或 Q'
})

const openSearch = () => {
    emit('open')
}

const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
        return
    }

    if (e.key === 'q' || e.key === 'Q') {
        const target = e.target as HTMLElement
        const isInputFocused =
            target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

        if (!isInputFocused) {
            e.preventDefault()
            openSearch()
        }
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

@media (max-width: 768px) {
    .search-button {
        width: 36px;
        height: 36px;
    }

    .search-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
