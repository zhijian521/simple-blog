import { Suspense } from 'react';
import { getPublishedPosts, listCategories, listTags } from '@/lib/posts';
import { SITE_METADATA } from '@/lib/site';
import BlogListClient from './_components/blog-list-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: SITE_METADATA.blogTitle,
    description: SITE_METADATA.blogDescription,
};

interface FilterOption {
    href: string;
    label: string;
    slug: string;
}

export default function BlogListPage() {
    const posts = getPublishedPosts();
    const categories = listCategories();
    const tags = listTags();

    const categoryOptions: FilterOption[] = [
        { href: '/blog', label: '全部', slug: '' },
        ...categories.map((cat) => ({
            href: `/blog?category=${encodeURIComponent(cat.slug)}`,
            label: cat.name,
            slug: cat.slug,
        })),
    ];

    const tagOptions: FilterOption[] = tags.map((tag) => ({
        href: `/blog?tags=${encodeURIComponent(tag.slug)}`,
        label: tag.name,
        slug: tag.slug,
    }));

    return (
        <Suspense>
            <BlogListClient
                categoryOptions={categoryOptions}
                tagOptions={tagOptions}
                posts={posts}
            />
        </Suspense>
    );
}
