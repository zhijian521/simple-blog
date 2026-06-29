import Image from 'next/image';

import { GhostButton } from '@/components/ui/ghost-button';
import { ArrowLeftIcon } from '@/components/ui/icons';

import styles from './status-page.module.css';

export interface StatusPageProps {
    /** HTTP 状态码，如 403、404 */
    code: number;
    /** 主标题，诗意长句 */
    title: string;
    /** 副文，一行补充 */
    subtitle?: string;
}

/*== StatusPage 通用状态页：水墨背景 + 大号水印码 + 毛玻璃卡片 + 诗意文案 + 返回首页。 ==*/
export function StatusPage({ code, title, subtitle }: StatusPageProps) {
    return (
        <main className={styles.page}>
            {/* 水墨背景图 */}
            <div className={styles.bg} />

            {/* 半透明遮罩层 */}
            <div className={styles.overlay} />

            {/* 大号水印状态码 */}
            <span aria-hidden className={styles.watermark}>{code}</span>

            {/* 毛玻璃卡片 */}
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <Image
                        src='/images/logo.webp'
                        alt='纸笺'
                        width={80}
                        height={80}
                        className={styles.logo}
                    />
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
                </div>
                <GhostButton
                    variant='primary'
                    icon={<ArrowLeftIcon />}
                    href='/'
                >
                    返回首页
                </GhostButton>
            </div>
        </main>
    );
}
