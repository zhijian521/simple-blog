<script setup lang="ts">
import { computed } from 'vue'

import { useArticles } from '@/entities/article/model/useArticles'

const { articles } = useArticles()

const sorted = computed(() => {
  return [...articles.value].sort((a, b) => a.title.localeCompare(b.title))
})
</script>

<template>
  <main class="page container">
    <header class="page__header">
      <h1 class="page__title">文章列表</h1>
      <p class="page__subtitle">所有文章</p>
    </header>

    <section class="card" aria-label="文章列表">
      <p v-if="sorted.length === 0" class="muted">暂无文章</p>

      <ul v-else class="list">
        <li v-for="a in sorted" :key="a.slug" class="list__item">
          <RouterLink class="list__link" :to="`/articles/${a.slug}`">
            <div class="list__title">{{ a.title }}</div>
            <div v-if="a.description" class="list__desc">{{ a.description }}</div>
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-2xl);
}

.page__header {
  margin-bottom: var(--spacing-lg);
}

.page__title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-3xl);
  color: var(--color-text);
}

.page__subtitle {
  margin: 0;
  color: var(--color-text-light);
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-md);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.list__link {
  display: block;
  padding: var(--spacing-md);
  border-radius: var(--radius);
  color: inherit;
  transition: background var(--transition-fast) ease, transform var(--transition-fast) ease;
}

.list__link:hover {
  background: rgba(0, 0, 0, 0.03);
  transform: translateX(2px);
}

.list__title {
  font-weight: 700;
}

.list__desc {
  margin-top: var(--spacing-xs);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}
</style>
