<template>
    <div class="home-page">
        <section class="hero">
            <h1 class="hero-title">耶温博客</h1>
            <p class="hero-subtitle">记录思考，分享知识</p>
            <div class="hero-actions">
                <ViewArticleButton to="/articles" text="查看文章" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import ViewArticleButton from '@/components/common/ViewArticleButton.vue'
</script>

<style scoped>
.home-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero {
    text-align: center;
}

.hero-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
    letter-spacing: 0;
}

.hero-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-light);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0;
}

.hero-actions {
    margin-top: var(--spacing-2xl);
}

@media (max-width: 768px) {
    .home-page {
        height: 100vh;
    }

    .hero-title {
        font-size: var(--font-size-2xl);
    }

    .hero-subtitle {
        font-size: var(--font-size-sm);
    }
}
</style>
