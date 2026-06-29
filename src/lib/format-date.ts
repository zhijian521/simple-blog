const CHINA_TIME_ZONE = 'Asia/Shanghai';
const CHINA_UTC_OFFSET_HOURS = 8;
const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

export function parsePostDate(value: string | null): Date | null {
    if (!value) return null;

    if (/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) {
        const directDate = new Date(value);
        return Number.isNaN(directDate.getTime()) ? null : directDate;
    }

    const matched = value.match(DATE_TIME_PATTERN);
    if (matched) {
        const [, year, month, day, hours = '00', minutes = '00', seconds = '00'] = matched;
        return new Date(Date.UTC(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours) - CHINA_UTC_OFFSET_HOURS,
            Number(minutes),
            Number(seconds),
        ));
    }

    const fallbackDate = new Date(value.replace(' ', 'T'));
    return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate;
}

export function toPostIsoDateTime(value: string | null): string | undefined {
    const date = parsePostDate(value);
    return date ? date.toISOString() : undefined;
}

export function formatPostDate(value: string | null): string {
    if (!value) return '未发布';
    const date = parsePostDate(value);
    if (!date) return value;
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: CHINA_TIME_ZONE,
    }).format(date);
}
