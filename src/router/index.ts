import { createRouter, createWebHistory } from 'vue-router';

import type { RouteLocationNormalized } from 'vue-router';

import { routes } from './routes';

/**
 * Router 实例（仅负责路由创建与全局 hooks 注册）。
 * 约定：页面标题使用 `route.meta.title?: string`。
 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

function applyDocumentTitle(to: RouteLocationNormalized): void {
    const baseTitle = import.meta.env.VITE_APP_TITLE || 'Vite Vue';
    const title = typeof to.meta.title === 'string' ? to.meta.title : undefined;

    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
}

router.afterEach((to) => {
    applyDocumentTitle(to);
});
