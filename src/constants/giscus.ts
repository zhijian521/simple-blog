/**
 * Giscus 评论系统配置
 *
 * 配置步骤：
 * 1. 在 GitHub 仓库中启用 Discussions
 * 2. 访问 https://giscus.app 获取配置参数
 * 3. 将获取到的参数填入下方
 */

export const GISCUS_CONFIG = {
    /** GitHub 仓库，格式：owner/repo */
    repo: 'zhijian521/blog-comments',

    /** GitHub Discussions 的 repository ID（从 giscus.app 获取） */
    repoId: 'R_kgDOMNskgg',

    /** GitHub Discussions 的 category ID（从 giscus.app 获取） */
    categoryId: 'DIC_kwDOMNskgs4CgWpW',

    /**
     * Giscus 主题
     * @see https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#theme
     */
    theme: 'fro' as const,

    /**
     * 映射关系
     * - pathname: URL 路径（推荐，适合博客文章）
     * - url: 完整 URL
     * - title: 页面标题
     * - og:title: OG 标题
     * - specific: 自定义字符串
     * - number: Discussion 编号
     * - term: 自定义 term 属性
     */
    mapping: 'pathname' as const,

    /** 评论框位置：top | bottom */
    inputPosition: 'bottom' as const,

    /** 是否懒加载 */
    lazyLoad: false,
} as const

/**
 * 检查 Giscus 是否已配置
 */
export function isGiscusConfigured(): boolean {
    return !!(GISCUS_CONFIG.repo && GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId)
}
