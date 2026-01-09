<template>
    <div class="not-found-page">
        <div class="not-found-content">
            <h1 class="error-code">404</h1>
            <p class="error-message">抱歉，您访问的页面不存在</p>
            <ViewArticleButton to="/" text="返回首页" />
        </div>
    </div>
</template>

<script setup lang="ts">
import ViewArticleButton from '@/components/ui/ViewArticleButton.vue'
</script>

<style scoped>
.not-found-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
}

.not-found-content {
    text-align: center;
    max-width: 500px;
}

.error-code {
    font-size: 64px;
    font-weight: var(--font-weight-bold);
    color: var(--color-accent);
    line-height: 1;
    margin-bottom: var(--spacing-lg);
    opacity: 0.3;
}

.error-message {
    font-size: var(--font-size-base);
    color: var(--color-text-light);
    margin-bottom: var(--spacing-2xl);
}

@media (max-width: 768px) {
    .error-code {
        font-size: 48px;
    }

    .error-message {
        font-size: var(--font-size-sm);
    }
}
</style>
