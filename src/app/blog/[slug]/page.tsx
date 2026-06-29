import { notFound } from 'next/navigation';

import { ArticleView } from '@/components/site/article-view';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { SITE_METADATA } from '@/lib/site';
import { ArticleFooterActions } from './_components/article-footer-actions';
import type { Metadata } from 'next';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.summary || SITE_METADATA.blogDescription,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className={styles.page}>
            <article className={styles.article}>
                <ArticleView
                    categoryName={post.categoryName}
                    content={post.content}
                    coverImage={post.coverImage}
                    publishedAt={post.publishedAt}
                    summary={post.summary}
                    tagNames={post.tagNames}
                    title={post.title}
                />

                <footer className={styles.footer}>
                    <div className={styles.footerTags}>
                        {post.tagNames?.map((tag) => (
                            <span className={styles.footerTag} key={tag.id}>{tag.name}</span>
                        ))}
                    </div>
                    <ArticleFooterActions />
                </footer>
            </article>
        </main>
    );
}
