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
}

/**
 * 净化 HTML 内容，防止 XSS 攻击
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, DOMPURIFY_CONFIG)
}

/**
 * 净化 HTML 内容（SSR 兼容版本）
 * SSR 环境下使用简化的净化逻辑，客户端使用 DOMPurify
 */
export function sanitizeHtmlWithSsr(html: string): string {
    if (import.meta.env.SSR) {
        // SSR 环境下使用简化的标签过滤（移除危险标签和属性）
        // 虽然文章是可信的 Markdown 文件，但为保证安全性统一进行基础净化
        return sanitizeHtmlServer(html)
    }

    // 客户端环境使用 DOMPurify 进行完整净化
    return sanitizeHtml(html)
}

/**
 * 服务端简化的 HTML 净化函数
 * 移除 script 标签和 on* 事件属性
 */
function sanitizeHtmlServer(html: string): string {
    // 移除 script 标签
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // 移除 on* 事件属性（如 onclick、onload 等）
    sanitized = sanitized.replace(/\s+on\w+="[^"]*"/gi, '')
    sanitized = sanitized.replace(/\s+on\w+='[^']*'/gi, '')
    sanitized = sanitized.replace(/\s+on\w+=[^\s>]*/gi, '')

    // 移除 javascript: 协议
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')

    return sanitized
}
