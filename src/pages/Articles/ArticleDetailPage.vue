<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useArticleBySlug } from '@/entities/article/model/useArticles'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { article } = useArticleBySlug(slug)
</script>

<template>
  <main class="page">
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
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 16px 56px;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 18px;
}

.header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 14px;
}

.title {
  margin: 0 0 8px;
  font-size: 32px;
  letter-spacing: -0.02em;
}

.desc {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.body {
  line-height: 1.75;
}

.muted {
  margin: 0;
  color: var(--color-text-muted);
}
</style>

