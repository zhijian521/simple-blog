<script setup lang="ts">
const route = useRoute();
const slug = String(route.params.slug);

const { data: post } = await useAsyncData(`note-${slug}`, () => {
    return queryCollection("notes").path(`/notes/${slug}`).first();
});

const article = post.value;

if (!article) {
    throw createError({ statusCode: 404, statusMessage: "文章不存在" });
}

const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
const postUrl = `${siteUrl}${article.path}`;
const description = article.description || `${article.title}，知简的个人笔记。`;

useSeoMeta({
    title: article.title,
    description,
    ogTitle: article.title,
    ogDescription: description,
    ogType: "article",
    ogUrl: postUrl,
    articlePublishedTime: article.date,
});

useHead({
    link: [{ rel: "canonical", href: postUrl }],
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: article.title,
                description,
                datePublished: article.date,
                mainEntityOfPage: postUrl,
                author: {
                    "@type": "Person",
                    name: "知简",
                },
            }),
        },
    ],
});
</script>

<template>
    <article class="article-page">
        <header class="article-header">
            <NuxtLink class="back-link" to="/">返回首页</NuxtLink>
            <p class="eyebrow">Note</p>
            <h1>{{ article.title }}</h1>
            <time :datetime="article.date">{{ article.date }}</time>
            <p v-if="article.description" class="article-header__description">{{ article.description }}</p>
        </header>
        <ContentRenderer :value="article" class="prose" />
    </article>
</template>
