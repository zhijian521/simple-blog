# Vue 3 + Vite + TypeScript Starter

一个遵循“模块化/工程化最佳实践”的 Vue3 前端项目骨架：

- Vue 3 + Vite + TypeScript
- Vue Router 4
- ESLint 9（Flat Config）+ Prettier
- 路由懒加载 + Layout 组织

## Scripts

```bash
npm run dev
npm run build
npm run preview

npm run lint
npm run lint:fix

npm run format
npm run format:write
```

## 目录结构

```txt
src/
  app/            # 应用启动/全局注册
  router/         # 路由
  layouts/        # 布局（承载 RouterView）
  views/          # 页面
  modules/        # 业务模块（建议按领域拆分）
  services/       # API / 请求层
  shared/         # 可复用能力（components/composables/utils/types）
```
