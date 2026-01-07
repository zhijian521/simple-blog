<script setup lang="ts">
const { articles, pending, error } = useArticles()

useHead({
  title: '文章列表 - 耶温博客'
})
</script>

<template>
  <div class="articles">
    <h1 class="articles__title">文章列表</h1>
    <div v-if="pending" class="articles__state">加载中...</div>
    <Alert v-else-if="error" color="red" class="articles__state">
      加载文章列表失败，请稍后重试。
    </Alert>
    <div v-else-if="!articles || articles.length === 0" class="articles__empty">
      暂无文章
    </div>
    <ul v-else class="articles__list">
      <li v-for="article in articles" :key="article._path" class="articles__item">
        <NuxtLink :to="article._path" class="articles__link">
          <h2 class="articles__item-title">{{ article.title || article._path }}</h2>
          <p v-if="article.description" class="articles__item-desc">{{ article.description }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.articles {
  max-width: 800px;
  margin: 0 auto;
}

.articles__title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 32px;
}

.articles__empty,
.articles__state {
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.articles__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.articles__item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.articles__item:last-child {
  border-bottom: none;
}

.articles__link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
}

.articles__link:hover {
  transform: translateX(4px);
}

.articles__item-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px;
}

.articles__link:hover .articles__item-title {
  color: #3b82f6;
}

.articles__item-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}
</style>

