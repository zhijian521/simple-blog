<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useArticleBySlug } from '@/entities/article/model/useArticles'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { article } = useArticleBySlug(slug)
</script>

<template>
  <main class="page container">
    <p v-if="!article" class="muted">未找到文章</p>

    <article v-else class="card">
      <header class="header">
        <h1 class="title">{{ article.title }}</h1>
        <p v-if="article.description" class="desc">{{ article.description }}</p>
      </header>

      <section class="body">
        <p class="muted">（占位）后续可接入 Markdown 渲染或后端 API。</p>
      </section>
    </article>
  </main>
</template>

<style scoped>
.page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-2xl);
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-lg);
}

.header {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-md);
}

.title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-3xl);
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.desc {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.6;
}

.body {
  line-height: 1.75;
}
</style>
