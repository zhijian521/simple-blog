import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    type RouteRecordRaw,
} from 'vue-router'

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
        path: '/article/:id',
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
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
        // 如果有保存的位置（如浏览器后退），则恢复到该位置
        if (savedPosition) {
            return savedPosition
        }
        // 跳转到文章详情页时，滚动到顶部
        if (to.name === 'ArticleDetail') {
            return { top: 0, behavior: 'auto' }
        }
        // 其他情况也滚动到顶部
        return { top: 0, behavior: 'auto' }
    },
})

export { router }
