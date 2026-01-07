import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.css'

// 页面组件
import HomePage from './pages/HomePage.vue'
import ArticlesPage from './pages/ArticlesPage.vue'
import ArticleDetailPage from './pages/ArticleDetailPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/articles', component: ArticlesPage },
  { path: '/article/:slug(.*)', component: ArticleDetailPage, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
