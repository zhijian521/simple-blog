---
title: Vue 项目中集成 PWA 实践指南
date: 2025-01-19
category: 开发/前端优化
description: 使用 vite-plugin-pwa 在 Vue 项目中集成 Progressive Web App
tags:
  - Vue
  - PWA
  - 前端优化
id: gn8jnw9p
---

## 概述

Progressive Web App (PWA) 是使用现代 Web API 和渐进增强策略构建的 Web 应用程序。通过 Service Worker 和 Web App Manifest，PWA 可以提供类似原生应用的用户体验。

### 核心特性

- **离线可用**：通过 Service Worker 缓存资源
- **可安装**：添加到主屏幕，独立窗口运行
- **自动更新**：后台检测并更新应用
- **推送通知**：接收和显示推送消息
- **性能优化**：资源缓存，减少加载时间

## 快速开始

### 1. 安装依赖

```bash
npm install -D vite-plugin-pwa
```

### 2. 配置 Vite

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        description: 'My App Description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
```

### 3. 注册 Service Worker

**src/main.ts**:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('发现新版本，是否更新？')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('应用已准备好离线使用')
  },
})

createApp(App).mount('#app')
```

### 4. 添加图标

在 `public/` 目录放置图标文件：

```
public/
├── pwa-192x192.png
├── pwa-512x512.png
└── favicon.ico
```

**图标生成工具**: [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)

## 配置说明

### registerType

| 选项         | 说明               | 适用场景   |
| ------------ | ------------------ | ---------- |
| `autoUpdate` | 自动检测并后台更新 | 工具类应用 |
| `prompt`     | 提示用户确认更新   | 内容类应用 |

### 缓存策略

**vite.config.ts**:

```typescript
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        // API 请求
        urlPattern: /^https:\/\/api\.example\.com\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24 小时
          },
        },
      },
      {
        // 图片
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
          },
        },
      },
      {
        // 静态资源
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-cache',
        },
      },
    ],
  },
})
```

### 策略对比

| 策略                   | 说明                 | 使用场景   |
| ---------------------- | -------------------- | ---------- |
| `CacheFirst`           | 优先使用缓存         | 图片、字体 |
| `NetworkFirst`         | 优先网络请求         | API 请求   |
| `StaleWhileRevalidate` | 先返回缓存，后台更新 | JS、CSS    |
| `NetworkOnly`          | 仅使用网络           | 实时数据   |

## 开发调试

### Chrome DevTools

1. 打开 DevTools > **Application** > **Service Workers**
2. 勾选 **Update on reload** 强制更新
3. 查看 **Cache Storage** 检查缓存

### Lighthouse 检测

```bash
npm install -g lighthouse
lighthouse https://your-app.com --view
```

**检测项**：

- 可安装性
- Service Worker
- 离线可用
- HTTPS 部署
- Manifest 配置

### 离线测试

1. 打开应用
2. DevTools > **Network** > 勾选 **Offline**
3. 刷新页面测试功能

## 常见问题

### Q: 开发环境 PWA 不生效？

**A**: 开发环境默认禁用，可启用测试模式：

```typescript
VitePWA({
  devOptions: {
    enabled: true,
  },
})
```

### Q: 更新不及时？

**A**: 配置立即激活：

```typescript
VitePWA({
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
  },
})
```

### Q: 跨域资源缓存失败？

**A**: 配置 CORS 请求：

```typescript
{
  urlPattern: /^https:\/\/cdn\.example\.com\/.*/,
  handler: 'NetworkFirst',
  options: {
    fetchOptions: {
      mode: 'cors',
      credentials: 'omit'
    }
  }
}
```

## 部署

### HTTPS 要求

PWA **必须** 使用 HTTPS（开发环境 localhost 除外）。

### Vercel / Netlify

自动支持 HTTPS 和 PWA，无需额外配置。

### Nginx 配置

```nginx
server {
  listen 443 ssl http2;
  server_name your-app.com;

  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;

  location / {
    root /var/www/app;
    try_files $uri $uri/ /index.html;
  }

  # Service Worker 不缓存
  location /sw.js {
    add_header Cache-Control 'no-cache';
  }
}
```

## 最佳实践

### 1. 预缓存关键资源

```typescript
VitePWA({
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
  },
})
```

### 2. 限制缓存大小

```typescript
expiration: {
  maxEntries: 50,
  maxAgeSeconds: 60 * 60 * 24 * 7  // 7 天
}
```

### 3. 添加离线提示

**src/components/OfflineBanner.vue**:

```vue
<template>
  <div v-if="!isOnline" class="offline-banner">网络不可用，显示缓存内容</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(true)

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  updateOnlineStatus()
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>
```

## 发布前检查

- [ ] Manifest 配置完整（name、icons、theme_color）
- [ ] Service Worker 正常注册
- [ ] 离线功能正常
- [ ] HTTPS 部署
- [ ] 图标尺寸正确（192x192、512x512）
- [ ] Lighthouse PWA 评分 > 90
- [ ] 更新机制测试通过

## 参考资源

### 官方文档

- [vite-plugin-pwa](https://vite-pwa-plugin.netlify.app/)
- [Workbox](https://developer.chrome.com/docs/workbox)
- [PWA Best Practices](https://web.dev/pwa/)

### 工具

- [PWA Builder](https://www.pwabuilder.com/) - PWA 生成和测试
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - 性能检测

### 示例项目

- [vite-plugin-pwa Examples](https://github.com/antfu/vite-plugin-pwa)

## 总结

PWA 通过 Service Worker 和 Manifest 提升用户体验：

- 离线可用：资源缓存，无网络也能访问
- 可安装：添加到主屏幕，独立运行
- 自动更新：后台检测更新，无缝升级
- 性能优化：缓存策略，减少加载时间

**推荐配置**：

```typescript
VitePWA({
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      { urlPattern: /^https:\/\/api\./, handler: 'NetworkFirst' },
      { urlPattern: /\.(png|jpg|svg)$/, handler: 'CacheFirst' },
    ],
  },
})
```
