import { Tag } from '@/components/ui/tag';
import { TextLink } from '@/components/ui/text-link';

import styles from './post-card.module.css';

export interface PostCardProps {
    /** 卡片顶部视觉区内容，传入渐变 div 或图片。不传则为纯文字卡片 */
    visual?: React.ReactNode;
    /** 标签文字 */
    tag?: string;
    /** 标签变体 */
    tagVariant?: 'default' | 'primary';
    /** 日期文字 */
    date?: string;
    /** 文章标题 */
    title: string;
    /** 文章摘要 */
    summary?: string;
    /** 文章链接 */
    href: string;
}

/*== PostCard 文章卡片 — 有封面图时图片+渐变+内容叠层，无封面图时纯文字 ==*/
export function PostCard({
    visual,
    tag,
    tagVariant = 'default',
    date,
    title,
    summary,
    href,
}: PostCardProps) {
    const hasVisual = !!visual;

    return (
        <article className={styles.card}>
            {hasVisual ? (
                /* 封面图 + 渐变叠层 + 内容 */
                <div className={styles.visualCard}>
                    <div className={styles.visualImage}>{visual}</div>
                    <div className={styles.visualGradient} />
                    <div className={styles.visualBody}>
                            <h3 className={styles.title}>{title}</h3>
                            <div className={styles.metaRow}>
                                {tag ? <Tag variant={tagVariant} size="mini">{tag}</Tag> : null}
                                {date ? <span className={styles.date}>{date}</span> : null}
                            </div>
                            {summary ? <p className={styles.summary}>{summary}</p> : null}
                            <TextLink href={href}>阅读更多</TextLink>
                        </div>
                </div>
            ) : (
                /* 纯文字卡片 */
                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.metaRow}>
                        {tag ? <Tag variant={tagVariant} size="mini">{tag}</Tag> : null}
                        {date ? <span className={styles.date}>{date}</span> : null}
                    </div>
                    {summary ? <p className={styles.summary}>{summary}</p> : null}
                    <div className={styles.divider} />
                    <TextLink href={href}>阅读更多</TextLink>
                </div>
            )}
        </article>
    );
}
