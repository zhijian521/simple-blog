<script setup lang="ts">
import { computed } from 'vue'

import { useArticles } from '@/entities/article/model/useArticles'

const { articles } = useArticles()

const sorted = computed(() => {
  return [...articles.value].sort((a, b) => a.title.localeCompare(b.title))
})
</script>

<template>
  <main class="page">
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
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 16px 56px;
}

.page__header {
  margin-bottom: 18px;
}

.page__title {
  margin: 0 0 6px;
  font-size: 32px;
}

.page__subtitle {
  margin: 0;
  color: var(--color-text-muted);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 14px;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list__item {
  border-radius: 10px;
}

.list__link {
  display: block;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease, transform 0.15s ease;
}

.list__link:hover {
  background: rgba(0, 0, 0, 0.03);
  transform: translateX(2px);
}

.list__title {
  font-weight: 700;
}

.list__desc {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.6;
}
</style>

