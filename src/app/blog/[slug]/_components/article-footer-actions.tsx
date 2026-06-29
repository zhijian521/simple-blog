'use client';

import { IconButton } from '@/components/ui/icon-button';
import { ArrowUpIcon, HomeIcon, ListIcon } from '@/components/ui/icons';

import styles from '../page.module.css';

export function ArticleFooterActions() {
    return (
        <div className={styles.footerActions}>
            <IconButton
                aria-label="返回列表"
                href="/blog"
                icon={<ListIcon />}
                size="medium"
                title="返回列表"
            />
            <IconButton
                aria-label="返回主页"
                href="/"
                icon={<HomeIcon />}
                size="medium"
                title="返回主页"
            />
            <IconButton
                aria-label="返回顶部"
                icon={<ArrowUpIcon />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="medium"
                title="返回顶部"
            />
        </div>
    );
}
