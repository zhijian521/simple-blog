import type { RouteRecordRaw } from 'vue-router';

/** Home 模块路由（模块内部自包含，供 router 聚合）。 */
export const homeRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('./pages/HomePage.vue'),
        meta: { title: 'Home' },
    },
];
