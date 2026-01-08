import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/HomePage.vue'),
        meta: { title: '首页' },
    },
    {
        path: '/articles',
        name: 'Articles',
        component: () => import('../pages/ArticlesPage.vue'),
        meta: { title: '文章列表' },
    },
    {
        path: '/article/:slug(.*)',
        name: 'ArticleDetail',
        component: () => import('../pages/ArticleDetailPage.vue'),
        props: true,
        meta: { title: '文章详情' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFoundPage.vue'),
        meta: { title: '页面未找到' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    },
})

export default router
