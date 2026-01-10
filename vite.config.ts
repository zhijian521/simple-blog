/// <reference types="vite-ssg/client" />

import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteSSG } from 'vite-ssg'
import { pwaOptions } from './src/constants'
import { blogWatcher } from './src/plugins/blog-watcher'
import { getIncludedRoutes } from './src/config/ssg'

const plugins = [vue(), VitePWA(pwaOptions), blogWatcher()]

// 只在 SSR 环境下添加 ViteSSG 插件
// 检查 import.meta.env 是否存在且 SSR 为 true
if (typeof import.meta.env !== 'undefined' && import.meta.env.SSR) {
    plugins.push(ViteSSG())
}

const config: UserConfig = {
    plugins,
    ssgOptions: {
        // 从配置文件获取需要预渲染的路由列表
        includedRoutes: getIncludedRoutes,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
}

export default defineConfig(config)
