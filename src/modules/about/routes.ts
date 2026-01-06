import type { RouteRecordRaw } from 'vue-router';

/** About 模块路由（模块内部自包含，供 router 聚合）。 */
export const aboutRoutes: RouteRecordRaw[] = [
    {
        path: '/about',
        name: 'about',
        component: () => import('./pages/AboutPage.vue'),
        meta: { title: 'About' },
    },
];

