import type { App } from 'vue';

import { createPinia } from 'pinia';
import { router } from '@/router';

/**
 * 应用启动入口：集中注册全局能力（router / store / plugins 等）。
 * 约束：不要在此处编写业务逻辑，保持启动流程可读、可测试。
 */
export function bootstrapApp(app: App): void {
    // 注册 Pinia 状态管理
    const pinia = createPinia();
    app.use(pinia);

    // 注册 Vue Router
    app.use(router);

    // 未来可以在这里注册其他全局插件
    // 例如：app.use(pluginName)
}
