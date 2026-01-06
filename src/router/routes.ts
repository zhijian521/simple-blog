import type { RouteRecordRaw } from 'vue-router';

import { aboutRoutes } from '@/modules/about/routes';
import { homeRoutes } from '@/modules/home/routes';
import { notFoundRoutes } from '@/modules/not-found/routes';

/**
 * 应用路由聚合层。
 * 约定：各业务模块在 `src/modules/<module>/routes.ts` 内自维护路由，并在此处聚合。
 */
export const routes: RouteRecordRaw[] = [...homeRoutes, ...aboutRoutes, ...notFoundRoutes];
