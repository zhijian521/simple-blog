export function formatDate(
    date: string | Date,
    format: 'full' | 'short' | 'monthYear' = 'full'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date

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
