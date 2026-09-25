<script setup lang="ts">
const POSTS_PER_PAGE = 6;
const route = useRoute();
const pageNumber = Number(route.params.page);

const { data: posts } = await useAsyncData(`notes-page-${pageNumber}`, () => {
    return queryCollection("notes").order("date", "DESC").all();
});

const allPosts = posts.value || [];
const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));

if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    throw createError({ statusCode: 404, statusMessage: "文章页面不存在" });
}

const pagePosts = allPosts.slice((pageNumber - 1) * POSTS_PER_PAGE, pageNumber * POSTS_PER_PAGE);
const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
const pageUrl = `${siteUrl}/page/${pageNumber}/`;

useSeoMeta({
    title: `文章归档 · 第 ${pageNumber} 页`,
    description: "知简的文章归档。",
    ogTitle: `文章归档 · 第 ${pageNumber} 页`,
    ogDescription: "知简的文章归档。",
    ogType: "website",
    ogUrl: pageUrl,
});

useHead({
    link: [{ rel: "canonical", href: pageUrl }],
});
</script>

<template>
    <div class="archive-page">
        <header class="page-heading">
            <p class="eyebrow">Notes</p>
            <h1>文章归档</h1>
            <p>第 {{ pageNumber }} 页，共 {{ totalPages }} 页。</p>
        </header>

        <PostList :posts="pagePosts" />

        <nav class="page-navigation" aria-label="文章分页">
            <NuxtLink v-if="pageNumber > 2" :to="`/page/${pageNumber - 1}/`">上一页</NuxtLink>
            <NuxtLink to="/">返回首页</NuxtLink>
            <NuxtLink v-if="pageNumber < totalPages" :to="`/page/${pageNumber + 1}/`">下一页</NuxtLink>
        </nav>
    </div>
</template>
