import type { VitePWAOptions } from 'vite-plugin-pwa'

/**
 * PWA 配置
 * 离线访问、自动更新、应用图标等 PWA 功能
 */
const pwaConfig = {
    // Service Worker 注册策略
    // autoUpdate: 后台自动检测更新，发现新版本时提示用户刷新
    registerType: 'autoUpdate',

    // 额外包含在预缓存中的资源文件（不在 globPatterns 中匹配的文件）
    includeAssets: ['logo.png'],

    // 应用清单
    manifest: {
        name: '耶温博客',
        short_name: '耶温博客',
        description: '记录思考，分享知识',
        // 使用项目主题色（与 variables.css 保持一致）
        theme_color: '#ebe6da', // 对应 --color-bg-page，状态栏背景色
        background_color: '#ebe6da', // 应用启动时的背景色
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
            {
                src: 'logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: 'logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
    },

    // Workbox 缓存配置
    workbox: {
        // 预缓存文件模式：构建时将这些文件加入缓存清单
        globPatterns: ['**/*.{js,css,html,ico,png,svg,xml,txt,woff2}'],

        // 运行时缓存策略：根据资源类型使用不同的策略
        runtimeCaching: [
            // 1. HTML 文档 - 网络优先（确保获取最新内容）
            {
                urlPattern: /^https?:\/\/.*\/$|^https?:\/\/.*\/.*\.html$/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'html-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 3600 * 24, // 1 天
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },

            // 2. JavaScript 和 CSS - 网络优先（开发时确保获取最新代码）
            {
                urlPattern: /^https?:\/\/.*\.(?:js|css)$/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-resources-cache',
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 3600 * 24 * 7, // 7 天
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },

            // 3. 图片资源 - 缓存优先（减少带宽消耗）
            {
                urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images-cache',
                    expiration: {
                        maxEntries: 60,
                        maxAgeSeconds: 3600 * 24 * 30, // 30 天
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },

            // 4. 字体文件 - 缓存优先（几乎不变）
            {
                urlPattern: /^https?:\/\/.*\.(?:woff|woff2|ttf|otf|eot)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 3600 * 24 * 365, // 1 年
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },

            // 5. API 数据 - 网络优先（确保数据最新）
            {
                urlPattern: /^https?:\/\/.*\/api\/.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    expiration: {
                        maxEntries: 20,
                        maxAgeSeconds: 3600, // 1 小时
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                    networkTimeoutSeconds: 10, // 10 秒超时后回退到缓存
                },
            },

            // 6. 外部 CDN 资源 - 网络优先（StaleWhileRevalidate 平衡性能和新鲜度）
            {
                urlPattern: /^https:\/\/cdn\.|https:\/\/unpkg\.com/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'cdn-cache',
                    expiration: {
                        maxEntries: 30,
                        maxAgeSeconds: 3600 * 24 * 7, // 7 天
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ],
    },
}

export const pwaOptions = pwaConfig as VitePWAOptions
