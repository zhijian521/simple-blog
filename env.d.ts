/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'front-matter' {
    interface FrontMatterResult<T = any> {
        attributes: T
        body: string
        bodyBegin: string
    }
    function frontMatter<T = any>(content: string): FrontMatterResult<T>
    export = frontMatter
}

interface ImportMetaEnv {
    // 只定义自定义的环境变量
    // Vite 自带的 BASE_URL, MODE, DEV, PROD, SSR 已由 @vite/client 提供
    readonly VITE_APP_TITLE?: string
}
