import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';

/**
 * Router 实例。
 * - history 使用 HTML5 history
 * - routes 单独维护，利于模块化拆分
 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

router.afterEach((to) => {
    const title = typeof to.meta.title === 'string' ? to.meta.title : undefined;
    document.title = title ? `${title} | Vite Vue` : 'Vite Vue';
});
