import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    type RouteRecordRaw,
} from 'vue-router'
import { ROUTE_SEO_META } from './route-seo'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/HomePage.vue'),
        meta: ROUTE_SEO_META.Home,
    },
    {
        path: '/articles',
        name: 'Articles',
        component: () => import('../pages/ArticlesPage.vue'),
        meta: ROUTE_SEO_META.Articles,
    },
    {
        path: '/newspaper',
        name: 'Newspaper',
        component: () => import('../pages/NewspaperPage.vue'),
        meta: ROUTE_SEO_META.Newspaper,
    },
    {
        path: '/explorer',
        name: 'Explorer',
        component: () => import('../pages/ExplorerPage.vue'),
        meta: ROUTE_SEO_META.Explorer,
    },
    {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: () => import('../pages/ArticleDetailPage.vue'),
        props: true,
        meta: ROUTE_SEO_META.ArticleDetail,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/NotFoundPage.vue'),
        meta: ROUTE_SEO_META.NotFound,
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
