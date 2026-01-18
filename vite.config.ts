import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaOptions } from './src/constants'
import { blogWatcher } from './src/plugins/blog-watcher'
import { getIncludedRoutes } from './src/config/ssg'

const plugins = [vue(), VitePWA(pwaOptions), blogWatcher()]

export default defineConfig({
    plugins,
    ssgOptions: {
        // 从配置文件获取需要预渲染的路由列表
        includedRoutes: getIncludedRoutes,
        // 使用目录结构格式，每个页面生成独立目录和 index.html
        format: 'directory',
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
})
