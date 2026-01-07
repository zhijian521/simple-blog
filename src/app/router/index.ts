import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/Home/HomePage.vue'
import ArticlesPage from '@/pages/Articles/ArticlesPage.vue'
import ArticleDetailPage from '@/pages/Articles/ArticleDetailPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesPage,
    },
    {
      path: '/articles/:slug',
      name: 'article-detail',
      component: ArticleDetailPage,
    },
  ],
})

