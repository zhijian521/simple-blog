<template>
    <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3 class="empty-title">{{ title }}</h3>
        <p class="empty-message">{{ message }}</p>
        <slot name="actions"></slot>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    message?: string
}

withDefaults(defineProps<Props>(), {
    title: '暂无内容',
    message: '暂时没有找到相关内容',
})
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    text-align: center;
}

.empty-icon {
    font-size: var(--spacing-icon);
    margin-bottom: var(--spacing-lg);
}

.empty-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm) 0;
}

.empty-message {
    color: var(--color-text-light);
    margin: 0;
}
</style>
