/**
 * 日期处理工具
 */

/**
 * 格式化日期为 ISO 8601 (YYYY-MM-DD)
 */
export function formatDate(date: string | Date): string {
    if (typeof date === 'string') {
        const d = new Date(date)
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0]
        }
    }
    return (date as Date).toISOString().split('T')[0]
}
