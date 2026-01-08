<template>
    <div class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    message?: string
}

withDefaults(defineProps<Props>(), {
    message: '加载中...',
})
</script>

<style scoped>
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-light);
    font-size: var(--font-size-lg);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-bg-secondary);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: var(--spacing-md);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    margin: 0;
}
</style>
