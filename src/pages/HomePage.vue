<template>
    <div class="home-page">
        <section class="hero">
            <h1 class="hero-title">耶温博客</h1>
            <p class="hero-subtitle">记录思考，分享知识</p>
            <div class="hero-actions">
                <router-link to="/articles" class="btn-view-articles">查看文章</router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.home-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
    min-height: calc(100vh - 80px);
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
    margin-top: var(--spacing-xl);
}

.btn-view-articles {
    display: inline-block;
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-btn-vertical) var(--spacing-xl);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
}

.btn-view-articles:hover {
    background: var(--color-accent);
    color: var(--color-bg);
    border-color: var(--color-accent);
}

@media (max-width: 768px) {
    .home-page {
        min-height: calc(100vh - 70px);
    }

    .hero-title {
        font-size: var(--font-size-2xl);
    }

    .hero-subtitle {
        font-size: var(--font-size-sm);
    }
}
</style>
