<script setup lang="ts">
interface NoteSummary {
    path: string;
    title: string;
    description?: string;
    date: string;
    tags?: string[];
}

defineProps<{
    posts: NoteSummary[];
}>();

const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};
</script>

<template>
    <div class="post-list">
        <article v-for="post in posts" :key="post.path" class="post-list__item">
            <div class="post-list__meta">
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
                <span v-if="post.tags?.length">{{ post.tags.join(" · ") }}</span>
            </div>
            <h3 class="post-list__title">
                <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
            </h3>
            <p v-if="post.description" class="post-list__description">{{ post.description }}</p>
        </article>
    </div>
</template>
