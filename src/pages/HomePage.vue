<template>
  <div class="home-page">
    <section class="hero">
      <h1 class="hero-title">耶温博客</h1>
      <p class="hero-subtitle">记录思考，分享知识</p>
    </section>

    <section class="latest-articles">
      <h2 class="section-title">最新文章</h2>
      <div class="articles-preview">
        <article
          v-for="article in latestArticles"
          :key="article.slug"
          class="article-preview-card"
        >
          <router-link :to="`/article/${article.slug}`" class="article-link">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <span class="article-date">{{ formatDate(article.date) }}</span>
          </router-link>
        </article>
      </div>
      <div class="view-all">
        <router-link to="/articles" class="view-all-link">查看所有文章 →</router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '../utils/markdown'
import { formatDate } from '../utils/date'
import type { Article } from '../types/article'

const latestArticles = ref<Article[]>([])

onMounted(() => {
  const articles = getArticles()
  latestArticles.value = articles.slice(0, 3)
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 6rem 2rem;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #2c3e50;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #666;
  font-weight: 300;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  border-left: 4px solid #42b983;
  padding-left: 1rem;
}

.latest-articles {
  padding: 0 2rem 4rem;
}

.articles-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.article-preview-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e8e8e8;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.article-preview-card:hover {
  border-color: #42b983;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.1);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-title {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #2c3e50;
  font-weight: 600;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  color: #999;
  font-size: 0.9rem;
}

.view-all {
  text-align: center;
}

.view-all-link {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  padding: 0.8rem 2rem;
  border: 1px solid #42b983;
  border-radius: 4px;
  transition: all 0.3s;
}

.view-all-link:hover {
  background: #42b983;
  color: white;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .articles-preview {
    grid-template-columns: 1fr;
  }
}
</style>
