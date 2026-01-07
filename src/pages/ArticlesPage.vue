<template>
  <div class="articles-page">
    <h1 class="page-title">文章列表</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="articles.length === 0" class="empty">
      <p>暂无文章</p>
    </div>

    <div v-else class="articles-list">
      <article
        v-for="article in articles"
        :key="article.slug"
        class="article-card"
      >
        <router-link :to="`/article/${article.slug}`" class="article-link">
          <h2 class="article-title">{{ article.title }}</h2>
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.date) }}</span>
            <span v-if="article.author" class="article-author">{{ article.author }}</span>
          </div>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div v-if="article.tags && article.tags.length" class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </router-link>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '../utils/markdown'
import { formatDate } from '../utils/date'
import type { Article } from '../types/article'

const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(() => {
  articles.value = getArticles()
  loading.value = false
})
</script>

<style scoped>
.articles-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.loading, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.article-excerpt {
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
}
</style>
