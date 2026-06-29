import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.join(process.cwd(), 'docs');

export interface Post {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    category: string | null;
    categoryName: string | null;
    tags: string[];
    tagNames: { id: number; name: string; slug: string }[];
    coverImage: string | null;
    altText: string | null;
    sticky: number;
    publishedAt: string;
    updatedAt: string;
    summary: string;
}

let _posts: Post[] | null = null;

function walkDir(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...walkDir(full));
        else results.push(full);
    }
    return results;
}

/*== 把 front-matter 里的值规范成字符串（gray-matter 会把 YAML 日期解析成 Date） ==*/
function toStr(v: unknown): string {
    if (v instanceof Date) return v.toISOString();
    return typeof v === 'string' ? v : '';
}

/*== 把相对图片路径（images/xxx、./images/xxx）转成站点绝对路径 /images/xxx ==*/
function toAbsolutePath(img: string): string {
    const trimmed = img.replace(/^\.\//, '');
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/*== 正文里的相对图片引用转绝对，保证文章页 /blog/xxx 下也能正确加载 ==*/
function absolutizeImages(content: string): string {
    // markdown 图片 ![alt](images/x.webp) 和 html <img src="images/x.webp">
    return content
        .replace(/!\[([^\]]*)\]\((images\/[^)]+)\)/g, (_, alt, src) => `![${alt}](${toAbsolutePath(src)})`)
        .replace(/src="(images\/[^"]+)"/g, (_, src) => `src="${toAbsolutePath(src)}"`);
}

function loadPosts(): Post[] {
    if (_posts) return _posts;

    const posts: Post[] = [];
    const files = walkDir(DOCS_DIR);

    for (const filePath of files) {
        if (!filePath.endsWith('.md')) continue;
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = matter(raw);
        const data = parsed.data as Record<string, unknown>;

        // 只发布 status=published 的文章（缺省视为已发布）
        const status = (data.status as string) || 'published';
        if (status !== 'published') continue;

        const fileBase = path.basename(filePath, '.md');
        const slug = toStr(data.slug) || fileBase;
        const publishedAt = toStr(data.publishedAt) || toStr(data.date);
        const summary = toStr(data.summary) || toStr(data.excerpt) || toStr(data.description);
        const categoryName = toStr(data.category);
        const coverImage = toStr(data.coverImage) || null;

        posts.push({
            id: toStr(data.id) || slug,
            slug,
            title: toStr(data.title) || slug,
            date: publishedAt,
            excerpt: summary,
            content: absolutizeImages(parsed.content),
            category: categoryName || null,
            categoryName: categoryName || null,
            tags: (data.tags as string[]) || [],
            tagNames: ((data.tags as string[]) || []).map((t: string, i: number) => ({ id: i, name: t, slug: t })),
            coverImage: coverImage ? toAbsolutePath(coverImage) : null,
            altText: toStr(data.altText) || null,
            sticky: (data.sticky as number) || 0,
            publishedAt,
            updatedAt: toStr(data.updatedAt) || publishedAt,
            summary,
        });
    }

    posts.sort((a, b) => {
        if (a.sticky !== b.sticky) return b.sticky - a.sticky;
        return (b.publishedAt || '').localeCompare(a.publishedAt || '');
    });

    _posts = posts;
    return posts;
}

export function getPublishedPosts(options?: { limit?: number; categorySlug?: string; tagSlugs?: string[] }): Post[] {
    let posts = loadPosts();
    if (options?.categorySlug) {
        posts = posts.filter((p) => p.category === options.categorySlug);
    }
    if (options?.tagSlugs && options.tagSlugs.length > 0) {
        posts = posts.filter((p) => options.tagSlugs!.some((t) => p.tags.includes(t)));
    }
    if (options?.limit) {
        posts = posts.slice(0, options.limit);
    }
    return posts;
}

export function getPostBySlug(slug: string): Post | null {
    return loadPosts().find((p) => p.slug === slug) || null;
}

export function listCategories(): { slug: string; name: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const post of loadPosts()) {
        if (!post.category) continue;
        counts.set(post.category, (counts.get(post.category) || 0) + 1);
    }
    return Array.from(counts.entries())
        .map(([name, count]) => ({ slug: name, name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function listTags(): { slug: string; name: string }[] {
    const tags = new Set<string>();
    for (const post of loadPosts()) {
        for (const tag of post.tags) tags.add(tag);
    }
    return Array.from(tags).map((name) => ({ slug: name, name }));
}

export function getAllSlugs(): string[] {
    return loadPosts().map((p) => p.slug);
}
