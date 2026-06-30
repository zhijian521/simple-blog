'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import Dialog from '@/components/ui/dialog';
import { XIcon } from '@/components/ui/icons';
import { Pagination } from '@/components/ui/pagination';
import { Tag } from '@/components/ui/tag';
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
    const [filterOpen, setFilterOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const activeCategorySlug = searchParams.get('category') || '';
    const activeTagSlugs = (searchParams.get('tags') || '').split(',').filter(Boolean);
    const activeTagSet = new Set(activeTagSlugs);
    const currentPage = Number(searchParams.get('page')) || 1;

    const hasFilters = categoryOptions.length > 1 || tagOptions.length > 0;
    const hasActiveFilters = activeCategorySlug !== '' || activeTagSlugs.length > 0;

    const filteredPosts = allPosts.filter((post) => {
        if (activeCategorySlug && post.category !== activeCategorySlug) return false;
        if (activeTagSlugs.length > 0 && !activeTagSlugs.some((t) => post.tags.includes(t))) return false;
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
    const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    /*== 构建筛选 URL，params 覆盖当前激活项 ==*/
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

    /*== 导航到新筛选 URL，带 transition 追踪（顶部加载条） ==*/
    function navigateTo(url: string) {
        startTransition(() => {
            router.push(url);
        });
    }

    function toggleTag(tag: string) {
        const next = activeTagSet.has(tag)
            ? activeTagSlugs.filter((t) => t !== tag)
            : [...activeTagSlugs, tag];
        const tags = next.length > 0 ? next.join(',') : undefined;
        navigateTo(buildUrl({ tags, page: undefined }));
    }

    /* 分类是否激活：未选分类时空字符串 slug（全部）激活 */
    function isCategoryActive(slug: string) {
        if (!activeCategorySlug) return !slug;
        return activeCategorySlug === slug;
    }

    /*== 已选筛选 chips：当前分类 + 各激活标签，点击移除 ==*/
    const activeFilterChips: { label: string; removeHref: string }[] = [];
    if (activeCategorySlug) {
        activeFilterChips.push({
            label: activeCategorySlug,
            removeHref: buildUrl({ category: undefined, page: undefined }),
        });
    }
    for (const tag of activeTagSlugs) {
        activeFilterChips.push({
            label: tag,
            removeHref: buildUrl({
                tags: activeTagSlugs.filter((t) => t !== tag).join(',') || undefined,
                page: undefined,
            }),
        });
    }

    return (
        <main className={styles.page}>
            {/* 导航加载遮罩 */}
            {isPending ? (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingBar} />
                </div>
            ) : null}

            <div className={styles.pageContent}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerRow}>
                        <div className={styles.headerLeft}>
                            <h1 className={styles.headerTitle}>文章</h1>
                            {hasActiveFilters ? (
                                <div className={styles.activeFilters}>
                                    {activeFilterChips.map((chip, i) => (
                                        <button className={styles.activeFilterChip} onClick={() => navigateTo(chip.removeHref)} key={`${i}-${chip.label}`} type="button">
                                            {chip.label}
                                            <XIcon className={styles.activeFilterClose} />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        {hasFilters ? (
                            <button
                                className={styles.filterBtn}
                                onClick={() => setFilterOpen(true)}
                                type="button"
                            >
                                筛选
                            </button>
                        ) : null}
                    </div>
                    <Dialog
                        maxWidth="20rem"
                        onClose={() => setFilterOpen(false)}
                        open={filterOpen}
                        title="筛选"
                    >
                        <div className={styles.filterDialogBody}>
                            {categoryOptions.length > 1 ? (
                                <div className={styles.filterBlock}>
                                    <h3 className={styles.filterBlockTitle}>分类</h3>
                                    <div className={styles.categories}>
                                        {categoryOptions.map((category) => (
                                            <button
                                                className={`${styles.catBtn} ${isCategoryActive(category.slug) ? styles.catActive : ''}`}
                                                key={category.slug || 'all'}
                                                onClick={() => { setFilterOpen(false); navigateTo(category.href); }}
                                                type="button"
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {tagOptions.length > 0 ? (
                                <div className={styles.filterBlock}>
                                    <h3 className={styles.filterBlockTitle}>标签</h3>
                                    <div className={styles.tagFilter}>
                                        {tagOptions.map((tag) => (
                                            <button
                                                className={`${styles.tagBtn} ${activeTagSet.has(tag.slug) ? styles.tagActive : ''}`}
                                                key={tag.slug}
                                                onClick={() => toggleTag(tag.slug)}
                                                type="button"
                                            >
                                                {tag.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </Dialog>
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
