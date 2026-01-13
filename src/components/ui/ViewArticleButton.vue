<template>
    <router-link
        :to="to"
        class="view-article-btn"
        :class="{ 'is-active': isActive }"
        @click="handleClick"
    >
        <span class="btn-text">{{ text }}</span>
        <span class="btn-underline"></span>
    </router-link>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface Props {
    to: string
    text?: string
}

withDefaults(defineProps<Props>(), {
    text: '查看文章',
})

const isActive = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleClick = () => {
    isActive.value = true
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        isActive.value = false
    }, 300)
}

onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = null
})
</script>

<style scoped>
.view-article-btn {
    position: relative;
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-xl);
    color: var(--color-text);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    transition: all var(--transition-base) ease;
}

.btn-text {
    position: relative;
    z-index: 1;
    transition: color var(--transition-base) ease;
}

.btn-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--color-accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--transition-base) ease;
}

/* Hover 状态 */
.view-article-btn:hover {
    background: var(--color-bg-secondary);
    color: var(--color-accent);
}

.view-article-btn:hover .btn-underline {
    transform: scaleX(1);
}

/* 点击激活状态 */
.view-article-btn.is-active {
    background: var(--color-bg-secondary);
    color: var(--color-accent);
}

.view-article-btn.is-active .btn-underline {
    transform: scaleX(1);
}
</style>
