import DOMPurify from 'dompurify'

/**
 * DOMPurify 配置
 * 使用保守的标签白名单，仅保留 Markdown 渲染必需的基础标签
 */

const DOMPURIFY_CONFIG = {
    // 基础文本和格式
    ALLOWED_TAGS: [
        'p', // 段落
        'br', // 换行
        'strong', // 粗体
        'em', // 斜体
        'u', // 下划线
        's', // 删除线
        'code', // 行内代码
        'pre', // 代码块
        'blockquote', // 引用
        // 列表
        'ul', // 无序列表
        'ol', // 有序列表
        'li', // 列表项
        // 标题
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        // 链接和图片
        'a', // 链接
        'img', // 图片
        // 分隔线
        'hr',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class'],
    ALLOW_DATA_ATTR: false,
    // 禁止 JavaScript 协议链接
    ALLOWED_URI_REGEXP:
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
} as const

/**
 * 净化 HTML 内容，防止 XSS 攻击
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, DOMPURIFY_CONFIG)
}

/**
 * 净化 HTML 内容（SSR 兼容版本）
 * SSR 环境下直接返回内容（文章内容是可信的 Markdown 文件）
 */
export function sanitizeHtmlWithSsr(html: string): string {
    // SSR 环境下直接返回内容（不需要净化）
    if (import.meta.env.SSR) {
        return html
    }

    // 客户端环境进行净化
    return sanitizeHtml(html)
}
