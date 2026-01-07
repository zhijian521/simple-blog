<template>
  <div class="home-page">
    <section class="hero">
      <h1 class="hero-title">欢迎来到我的博客</h1>
      <p class="hero-subtitle">分享技术，记录生活，持续学习</p>
      <router-link to="/articles" class="cta-button">浏览文章</router-link>
    </section>

    <section class="features">
      <h2 class="section-title">博客特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3 class="feature-title">Markdown 写作</h3>
          <p class="feature-description">使用 Markdown 语法轻松编写文章</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">快速构建</h3>
          <p class="feature-description">基于 Vite，享受极致的开发体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">响应式设计</h3>
          <p class="feature-description">完美适配各种设备屏幕</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3 class="feature-title">静态部署</h3>
          <p class="feature-description">可打包成静态页面，部署简单</p>
        </div>
      </div>
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
import type { Article } from '../types/article'

const latestArticles = ref<Article[]>([])

onMounted(async () => {
  const articles = await getArticles()
  // 显示最新的 3 篇文章
  latestArticles.value = articles.slice(0, 3)
})

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.features {
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

.latest-articles {
  padding: 0 2rem;
}

.articles-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.article-preview-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-date {
  color: #42b983;
  font-size: 0.9rem;
}

.view-all {
  text-align: center;
}

.view-all-link {
  display: inline-block;
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s;
}

.view-all-link:hover {
  color: #359268;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .features-grid,
  .articles-preview {
    grid-template-columns: 1fr;
  }
}
</style>
