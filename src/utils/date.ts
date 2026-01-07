/**
 * 日期格式化工具
 */

/**
 * 格式化日期为中文格式
 * @param date - 日期字符串或 Date 对象
 * @param format - 格式类型，默认为 'full'
 */
export function formatDate(
  date: string | Date,
  format: 'full' | 'short' | 'monthYear' = 'full'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'monthYear' ? 'long' : 'long',
    day: format === 'monthYear' ? undefined : 'numeric'
  }

  return dateObj.toLocaleDateString('zh-CN', options)
}
