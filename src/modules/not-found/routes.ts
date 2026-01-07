import type { RouteRecordRaw } from 'vue-router';

/** 兜底路由（必须放在最后）。 */
export const notFoundRoutes: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('./pages/NotFoundPage.vue'),
        meta: { title: 'Not Found' },
    },
];
