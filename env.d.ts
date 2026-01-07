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
