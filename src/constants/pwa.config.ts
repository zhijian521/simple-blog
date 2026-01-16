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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,xml,txt}'],

        // 运行时缓存策略：处理动态请求
        runtimeCaching: [
            {
                // 匹配所有本地路径
                urlPattern: /^\/.*$/,

                // NetworkFirst: 优先尝试网络，失败时使用缓存
                // 适合需要获取最新内容但又要离线可用的场景
                handler: 'NetworkFirst',

                options: {
                    cacheName: 'runtime-cache',
                    expiration: {
                        maxEntries: 100, // 最多缓存 100 个请求
                        maxAgeSeconds: 3600 * 24 * 7, // 7 天后过期
                    },
                    cacheableResponse: {
                        statuses: [0, 200], // 只缓存成功的响应
                    },
                },
            },
        ],
    },
}

export const pwaOptions = pwaConfig as VitePWAOptions
