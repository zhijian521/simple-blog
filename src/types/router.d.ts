/**
 * Vue Router 类型扩展
 * 为路由元信息提供类型安全
 */

import type { RouteMeta as BaseRouteMeta } from 'vue-router'

declare module 'vue-router' {
    /**
     * 路由元信息接口扩展
     * 在路由配置中使用 meta 字段时，TypeScript 会识别这些属性
     */
    interface RouteMeta extends BaseRouteMeta {
        /**
         * 页面标题
         * 用于设置浏览器标签页标题
         */
        title?: string

        /**
         * 是否需要认证
         * 用于路由守卫判断是否需要登录
         */
        requiresAuth?: boolean

        /**
         * 页面描述
         * 用于 SEO 优化
         */
        description?: string

        /**
         * 是否显示在导航菜单中
         */
        showInNav?: boolean
    }
}
