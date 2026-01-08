/**
 * Vite 环境类型声明
 * 扩展 ImportMeta 接口以支持 Vite 的 glob 功能
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  // 添加更多环境变量类型
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (pattern: string, options?: {
    query?: string
    import?: string
    eager?: boolean
  }) => Record<string, unknown>
  readonly globEager: (pattern: string) => Record<string, unknown>
}
