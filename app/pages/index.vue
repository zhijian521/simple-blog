<script setup lang="ts">
interface Project {
    title: string;
    description: string;
    detail: string;
    href?: string;
}

const POSTS_PER_PAGE = 6;

const projects: Project[] = [
    {
        title: "simple-blog",
        description: "一个用来记录笔记、项目和日常思考的个人站点。",
        detail: "Nuxt · Vue · TypeScript",
    },
    {
        title: "在建项目",
        description: "在这里补充你的项目简介和项目地址。",
        detail: "持续更新",
    },
];

const { data: posts } = await useAsyncData("home-notes", () => {
    return queryCollection("notes").order("date", "DESC").all();
});

const allPosts = computed(() => posts.value || []);
const visiblePosts = ref(allPosts.value.slice(0, POSTS_PER_PAGE));
const isLoading = ref(false);
const loadMoreTrigger = ref<HTMLElement>();
const totalPages = computed(() => Math.max(1, Math.ceil(allPosts.value.length / POSTS_PER_PAGE)));
const hasMore = computed(() => visiblePosts.value.length < allPosts.value.length);

const loadMore = (): void => {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    const nextEnd = visiblePosts.value.length + POSTS_PER_PAGE;
    visiblePosts.value = allPosts.value.slice(0, nextEnd);
    isLoading.value = false;
};

let observer: IntersectionObserver | undefined;

onMounted(() => {
    if (!loadMoreTrigger.value) return;

    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry?.isIntersecting) loadMore();
        },
        { rootMargin: "240px" },
    );
    observer.observe(loadMoreTrigger.value);
});

onBeforeUnmount(() => observer?.disconnect());

const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");

useSeoMeta({
    title: "知简 · 个人博客",
    description: "记录技术、项目与日常思考。",
    ogTitle: "知简 · 个人博客",
    ogDescription: "记录技术、项目与日常思考。",
    ogType: "website",
    ogUrl: siteUrl,
});

useHead({
    link: [{ rel: "canonical", href: siteUrl }],
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "知简",
                url: siteUrl,
                description: "记录技术、项目与日常思考。",
            }),
        },
    ],
});
</script>

<template>
    <div class="home-page">
        <section class="intro-section" aria-labelledby="intro-title">
            <p class="eyebrow">个人博客</p>
            <h1 id="intro-title">你好，我是知简。</h1>
            <p class="intro-section__summary">这里记录技术实践、正在做的项目，以及值得留下来的想法。</p>
        </section>

        <section class="content-section" aria-labelledby="projects-title">
            <div class="section-heading">
                <p class="eyebrow">Projects</p>
                <h2 id="projects-title">项目</h2>
            </div>
            <div class="project-list">
                <article v-for="project in projects" :key="project.title" class="project-list__item">
                    <h3>
                        <a v-if="project.href" :href="project.href" target="_blank" rel="noopener noreferrer">
                            {{ project.title }}
                        </a>
                        <span v-else>{{ project.title }}</span>
                    </h3>
                    <p>{{ project.description }}</p>
                    <small>{{ project.detail }}</small>
                </article>
            </div>
        </section>

        <section id="notes" class="content-section" aria-labelledby="notes-title">
            <div class="section-heading">
                <p class="eyebrow">Notes</p>
                <h2 id="notes-title">文章</h2>
            </div>
            <PostList :posts="visiblePosts" />
            <div v-if="hasMore" ref="loadMoreTrigger" class="load-more-area">
                <button class="load-more-button" type="button" :disabled="isLoading" @click="loadMore">
                    {{ isLoading ? "加载中" : "加载更多" }}
                </button>
            </div>
            <p v-else-if="allPosts.length === 0" class="empty-state">还没有文章。</p>
            <NuxtLink v-if="totalPages > 1" class="archive-link" to="/page/2/">查看后续文章</NuxtLink>
        </section>
    </div>
</template>
