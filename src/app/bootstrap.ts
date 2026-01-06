import type { App } from 'vue';

import { router } from '@/router';

/**
 * 统一注册“全局能力”：router / store / directives / plugins 等。
 * 好处：main.ts 保持极简，启动流程清晰。
 */
export function bootstrapApp(app: App): void {
  app.use(router);
}

