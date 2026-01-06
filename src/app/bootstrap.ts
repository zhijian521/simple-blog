import type { App } from 'vue';

import { router } from '@/router';

/**
 * 应用启动入口：集中注册全局能力（router / store / plugins 等）。
 * 约束：不要在此处编写业务逻辑，保持启动流程可读、可测试。
 */
export function bootstrapApp(app: App): void {
    app.use(router);
}
