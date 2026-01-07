<template>
  <div class="article-detail">
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="!article" class="not-found">
      <h1>文章未找到</h1>
      <router-link to="/articles">返回文章列表</router-link>
    </div>

    <article v-else class="article-content">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <span v-if="article.author" class="article-author">作者：{{ article.author }}</span>
        </div>
        <div v-if="article.tags && article.tags.length" class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="article-body" v-html="article.content"></div>

      <div class="article-footer">
        <router-link to="/articles" class="back-link">← 返回文章列表</router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleBySlug } from '../utils/markdown'
import { formatDate } from '../utils/date'
import type { Article } from '../types/article'

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)

const loadArticle = (slug: string) => {
  loading.value = true
  const decodedSlug = decodeURIComponent(slug)
  article.value = getArticleBySlug(decodedSlug)
  loading.value = false
}

onMounted(() => {
  const slug = route.params.slug as string
  loadArticle(slug)
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadArticle(newSlug as string)
  }
})
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e74c3c;
}

.article-content {
  background: white;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.article-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #666;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.tag {
  background: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.article-body :deep(h2) {
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.article-body :deep(h3) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #34495e;
}

.article-body :deep(p) {
  margin-bottom: 1rem;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-body :deep(li) {
  margin-bottom: 0.5rem;
}

.article-body :deep(code) {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-body :deep(blockquote) {
  border-left: 4px solid #42b983;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #666;
  font-style: italic;
}

.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.back-link {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #359268;
}
</style>
