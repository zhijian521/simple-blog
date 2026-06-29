'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import { Tag } from '@/components/ui/tag';
import { Pagination } from '@/components/ui/pagination';
import { formatPostDate } from '@/lib/format-date';
import type { Post } from '@/lib/posts';

import styles from '../page.module.css';

interface FilterOption {
    href: string;
    label: string;
    slug: string;
}

interface BlogListClientProps {
    categoryOptions: FilterOption[];
    tagOptions: FilterOption[];
    posts: Post[];
}

const PAGE_SIZE = 10;

export default function BlogListClient({
    categoryOptions,
    tagOptions,
    posts: allPosts,
}: BlogListClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeCategorySlug = searchParams.get('category') || '';
    const activeTagSlugs = (searchParams.get('tags') || '').split(',').filter(Boolean);
    const activeTagSet = new Set(activeTagSlugs);
    const currentPage = Number(searchParams.get('page')) || 1;

    const filteredPosts = allPosts.filter((post) => {
        if (activeCategorySlug && post.category !== activeCategorySlug) return false;
        if (activeTagSlugs.length > 0 && !activeTagSlugs.some((t) => post.tags.includes(t))) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
    const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function buildUrl(params: Record<string, string | undefined>) {
        const search = new URLSearchParams();
        const merged = {
            category: activeCategorySlug || undefined,
            tags: activeTagSlugs.length > 0 ? activeTagSlugs.join(',') : undefined,
            ...params,
        };
        for (const [key, value] of Object.entries(merged)) {
            if (value) search.set(key, value);
        }
        const query = search.toString();
        return query ? `/blog?${query}` : '/blog';
    }

    function toggleTag(tag: string) {
        const next = activeTagSet.has(tag)
            ? activeTagSlugs.filter((t) => t !== tag)
            : [...activeTagSlugs, tag];
        const tags = next.length > 0 ? next.join(',') : undefined;
        router.push(buildUrl({ tags, page: undefined }));
    }

    return (
        <main className={styles.page}>
            <div className={styles.pageContent}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.headerTitle}>文章</h1>
                    </div>
                </header>

                <div className={styles.layout}>
                    <section className={styles.main}>
                        <div className={styles.list}>
                            {pagedPosts.length > 0 ? pagedPosts.map((post) => (
                                <Link className={styles.listItem} href={`/blog/${post.slug}`} key={post.id}>
                                    <div className={styles.itemBody}>
                                        <h2 className={styles.itemTitle}>{post.title}</h2>
                                        <p className={styles.itemSummary}>{post.summary}</p>
                                        <div className={styles.itemMeta}>
                                            {post.categoryName ? (
                                                <span className={styles.itemCategory}>{post.categoryName}</span>
                                            ) : null}
                                            {post.tagNames && post.tagNames.length > 0 ? (
                                                <div className={styles.itemTags}>
                                                    {post.tagNames.map((tag) => (
                                                        <Tag key={tag.id} size='mini' variant='outlined'>{tag.name}</Tag>
                                                    ))}
                                                </div>
                                            ) : null}
                                            <span className={styles.itemDate}>{formatPostDate(post.publishedAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p style={{ color: 'var(--muted-foreground)', padding: '2rem 0', fontSize: '0.9375rem' }}>
                                    没有匹配的文章。
                                </p>
                            )}
                        </div>

                        {totalPages > 1 ? (
                            <Pagination
                                current={currentPage}
                                getHref={(page) => buildUrl({ page: page > 1 ? String(page) : undefined })}
                                total={totalPages}
                            />
                        ) : null}
                    </section>

                    <aside className={styles.sidebar}>
                        {categoryOptions.length > 1 ? (
                            <div className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>分类</h3>
                                <div className={styles.categories}>
                                    {categoryOptions.map((category) => (
                                        <Link
                                            className={`${styles.catBtn} ${activeCategorySlug === category.slug ? styles.catActive : ''}`}
                                            href={category.href}
                                            key={category.slug || 'all'}
                                        >
                                            {category.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {tagOptions.length > 0 ? (
                            <div className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>标签</h3>
                                <div className={styles.tagFilter}>
                                    {tagOptions.map((tag) => (
                                        <button
                                            className={`${styles.tagBtn} ${activeTagSet.has(tag.slug) ? styles.tagActive : ''}`}
                                            key={tag.slug}
                                            onClick={() => toggleTag(tag.slug)}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </div>
        </main>
    );
}
