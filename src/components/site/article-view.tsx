import { MarkdownArticle } from '@/components/site/markdown-article';
import { formatPostDate } from '@/lib/format-date';

import styles from './article-view.module.css';

export interface ArticleViewProps {
    content: string;
    title?: string;
    summary?: string;
    coverImage?: string | null;
    altText?: string | null;
    categoryName?: string | null;
    tagNames?: { id: number; name: string; slug: string }[] | string[];
    publishedAt?: string | null;
    updatedAt?: string | null;
}

/*== ArticleView 文章展示组件 ==*/
export function ArticleView({
    content,
    title,
    summary,
    coverImage,
    altText,
    categoryName,
    tagNames,
    publishedAt,
    updatedAt,
}: ArticleViewProps) {
    const hasHeader = title || summary || coverImage || categoryName || (tagNames && tagNames.length > 0) || publishedAt;
    const tagLabels = tagNames?.map((tag) => typeof tag === 'string' ? tag : tag.name) ?? [];

    return (
        <div className={styles.article}>
            {hasHeader ? (
                <div className={styles.header}>
                    {coverImage ? (
                        <img
                            alt={altText || title || '封面图'}
                            className={styles.coverImage}
                            src={coverImage}
                        />
                    ) : null}
                    {title ? <h1 className={styles.headerTitle}>{title}</h1> : null}
                    {summary ? <p className={styles.headerSummary}>{summary}</p> : null}
                    <div className={styles.headerMeta}>
                        {categoryName ? <span className={styles.category}>{categoryName}</span> : null}
                        {tagLabels.map((name) => (
                            <span className={styles.tag} key={name}>{name}</span>
                        ))}
                        {publishedAt ? (
                            <span className={styles.date}>
                                {formatPostDate(publishedAt)}
                            </span>
                        ) : null}
                    </div>
                </div>
            ) : null}
            <MarkdownArticle content={content} />
            {updatedAt && updatedAt !== publishedAt ? (
                <div className={styles.updatedDate}>
                    最后更新于： {formatPostDate(updatedAt)}
                </div>
            ) : null}
        </div>
    );
}
