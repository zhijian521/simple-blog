import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaOptions } from './src/constants/pwa.config'
import { blogWatcher } from './src/plugins/blog-watcher'
import { imagesWatcher } from './src/plugins/images-watcher'
import { getIncludedRoutes } from './src/config/ssg'

const appRoot = __dirname
const repoRoot = resolve(__dirname, '..')
const docsDir = resolve(repoRoot, 'docs')
const imagesDir = resolve(repoRoot, 'images')
const siteConfigDir = resolve(repoRoot, 'config')

const plugins = [vue(), VitePWA(pwaOptions), blogWatcher(), imagesWatcher()]

const config = defineConfig({
    root: appRoot,
    envDir: repoRoot,
    plugins,
    resolve: {
        alias: {
            '@': resolve(appRoot, 'src'),
            '@config': siteConfigDir,
            '@docs': docsDir,
        },
    },
    publicDir: resolve(appRoot, 'public'),
    build: {
        outDir: resolve(repoRoot, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(appRoot, 'index.html'),
            },
        },
    },
    server: {
        port: 3000,
        open: true,
        fs: {
            allow: [appRoot, docsDir, imagesDir, siteConfigDir],
        },
    },
})

// 添加 vite-ssg 配置（使用类型断言）
export default {
    ...config,
    ssgOptions: {
        // 从配置文件获取需要预渲染的路由列表
        includedRoutes: getIncludedRoutes,
        // 使用目录结构格式，每个页面生成独立目录和 index.html
        format: 'directory' as const,
    },
}
