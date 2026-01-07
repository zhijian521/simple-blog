<template>
    <div class="home-page">
        <section class="hero">
            <h1 class="hero-title">耶温博客</h1>
            <p class="hero-subtitle">记录思考，分享知识</p>
        </section>

        <section class="latest-articles">
            <h2 class="section-title">最新文章</h2>
            <div class="articles-preview">
                <ArticleCard
                    v-for="article in latestArticles"
                    :key="article.slug"
                    :article="article"
                    :show-tags="false"
                />
            </div>
            <div class="view-all">
                <router-link to="/articles" class="view-all-link">查看所有文章 →</router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '@/utils/markdown'
import ArticleCard from '@/components/common/ArticleCard.vue'
import type { Article } from '@/types/article'

const latestArticles = ref<Article[]>([])

onMounted(() => {
    const articles = getArticles()
    latestArticles.value = articles.slice(0, 3)
})
</script>

<style scoped>
.home-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
}

.hero {
    text-align: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
}

.hero-title {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-md);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
}

.hero-subtitle {
    font-size: var(--font-size-2xl);
    color: var(--color-text-light);
    font-weight: var(--font-weight-normal);
}

.section-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-lg);
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
}

.latest-articles {
    padding: 0 var(--spacing-lg) var(--spacing-2xl);
}

.articles-preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.view-all {
    text-align: center;
}

.view-all-link {
    display: inline-block;
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    padding: 0.75rem 2rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    transition: all var(--transition-base);
}

.view-all-link:hover {
    background: var(--color-accent);
    color: var(--color-bg);
    border-color: var(--color-accent);
}

@media (max-width: 768px) {
    .hero {
        padding: var(--spacing-xl) var(--spacing-lg);
    }

    .hero-title {
        font-size: var(--font-size-3xl);
    }

    .hero-subtitle {
        font-size: var(--font-size-lg);
    }

    .articles-preview {
        grid-template-columns: 1fr;
    }
}
</style>
