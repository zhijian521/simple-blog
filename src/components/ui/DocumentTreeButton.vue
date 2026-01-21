<template>
    <button class="document-tree-button" title="文章目录" aria-label="文章目录" @click="openTree">
        <svg
            class="tree-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
        >
            <path
                d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"
            />
        </svg>
    </button>
</template>

<script setup lang="ts">
interface Emits {
    (e: 'open'): void
}

const emit = defineEmits<Emits>()

const openTree = () => {
    emit('open')
}
</script>

<style scoped>
.document-tree-button {
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

.document-tree-button:hover {
    background: rgba(0, 0, 0, 0.06);
}

.document-tree-button:active {
    background: rgba(0, 0, 0, 0.1);
}

.tree-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-light);
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .document-tree-button {
        width: 36px;
        height: 36px;
    }

    .tree-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
