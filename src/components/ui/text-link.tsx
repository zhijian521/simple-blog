import Link from 'next/link';

import { ArrowRightIcon } from '@/components/ui/icons';

import styles from './text-link.module.css';

export interface TextLinkProps extends React.ComponentProps<typeof Link> {
    /** 是否显示右侧箭头图标，默认 true */
    showArrow?: boolean;
}

/*== TextLink 纯文字链接 — 朱砂红文字+箭头，hover 淡出 ==*/
export function TextLink({ showArrow = true, children, className, ...props }: TextLinkProps) {
    return (
        <Link className={`${styles.link} ${className || ''}`} {...props}>
            {children}
            {showArrow ? <ArrowRightIcon className={styles.icon} /> : null}
        </Link>
    );
}
