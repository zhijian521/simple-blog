/**
 * 日期格式化工具
 */

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @param format - 格式类型：'full'(完整), 'short'(简短), 'monthYear'(年月)
 * @returns 格式化后的日期字符串
 */
export function formatDate(
    date: string | Date,
    format: 'full' | 'short' | 'monthYear' = 'full'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // 验证日期是否有效
    if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', date)
        return '无效日期'
    }

    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    switch (format) {
        case 'full':
            return `${year}年${parseInt(month)}月${parseInt(day)}日`
        case 'short':
            return `${year}-${month}-${day}`
        case 'monthYear':
            return `${year}年${parseInt(month)}月`
        default:
            return `${year}年${parseInt(month)}月${parseInt(day)}日`
    }
}
