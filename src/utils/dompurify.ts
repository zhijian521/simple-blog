import DOMPurify from 'dompurify'

const DOMPURIFY_CONFIG = {
    ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'code',
        'pre',
        'blockquote',
        'ul',
        'ol',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'img',
        'hr',
        'span',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
    ],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class', 'id', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
}

export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, DOMPURIFY_CONFIG)
}

export function sanitizeHtmlWithSsr(html: string): string {
    if (import.meta.env.SSR) {
        return sanitizeHtmlServer(html)
    }
    return sanitizeHtml(html)
}

function sanitizeHtmlServer(html: string): string {
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    sanitized = sanitized.replace(/\s+on\w+="[^"]*"/gi, '')
    sanitized = sanitized.replace(/\s+on\w+='[^']*'/gi, '')
    sanitized = sanitized.replace(/\s+on\w+=[^\s>]*/gi, '')
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
    return sanitized
}
