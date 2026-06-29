import Link from 'next/link';

import styles from './pagination.module.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
    /** 当前页码，1-based */
    current: number;
    /** 总页数 */
    total: number;
    /** 目标页链接生成函数 */
    getHref?: (page: number) => string;
    /** 页码变更回调 */
    onPageChange?: (page: number) => void;
}

/*== 生成带省略号的页码列表 ==*/
function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [1];

    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);

    if (rangeStart > 2) {
        pages.push('ellipsis');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }

    if (rangeEnd < total - 1) {
        pages.push('ellipsis');
    }

    pages.push(total);

    return pages;
}

/*== Pagination 分页：支持链接模式和回调模式 ==*/
export function Pagination({
    current, total, getHref, onPageChange,
    className, ...props
}: PaginationProps) {
    const pages = buildPageNumbers(current, total);

    function renderPageButton(page: number, isNav = false, label?: string) {
        const text = label ?? String(page);
        const buttonClass = `${styles.btn}${page === current && !isNav ? ` ${styles.active}` : ''}${isNav ? ` ${styles.navBtn}` : ''}`;

        if (getHref) {
            const isDisabled = isNav && ((label === '上一页' && current <= 1) || (label === '下一页' && current >= total));
            if (isDisabled) {
                return (
                    <span aria-disabled='true' className={`${buttonClass} ${styles.disabledLink}`}>
                        {text}
                    </span>
                );
            }

            return (
                <Link
                    aria-current={page === current && !isNav ? 'page' : undefined}
                    className={buttonClass}
                    href={getHref(page)}
                >
                    {text}
                </Link>
            );
        }

        if (!onPageChange) {
            return null;
        }

        const isDisabled = isNav && ((label === '上一页' && current <= 1) || (label === '下一页' && current >= total));

        return (
            <button
                aria-current={page === current && !isNav ? 'page' : undefined}
                className={buttonClass}
                disabled={isDisabled}
                onClick={() => onPageChange(page)}
                type='button'
            >
                {text}
            </button>
        );
    }

    return (
        <nav aria-label='分页导航' className={`${styles.root}${className ? ` ${className}` : ''}`} {...props}>
            {renderPageButton(current - 1, true, '上一页')}

            {pages.map((page, index) =>
                page === 'ellipsis' ? (
                    <span aria-hidden='true' className={styles.ellipsis} key={`ellipsis-${index}`}>
                        …
                    </span>
                ) : (
                    <span key={page}>
                        {renderPageButton(page)}
                    </span>
                ),
            )}

            {renderPageButton(current + 1, true, '下一页')}
        </nav>
    );
}
