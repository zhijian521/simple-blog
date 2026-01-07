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
    readonly VITE_APP_TITLE: string
    readonly BASE_URL: string
    readonly MODE: string
    readonly DEV: boolean
    readonly PROD: boolean
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>
    readonly globEager: (pattern: string) => Record<string, any>
}
