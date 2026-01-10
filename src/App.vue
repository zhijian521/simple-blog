<template>
    <div class="app" :class="{ 'is-home': isHomePage }">
        <main class="main">
            <router-view />
        </main>
        <Footer v-if="!isHomePage" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import Footer from '@/components/ui/Footer.vue'
import { SITE_CONFIG } from '@/constants'

/**
 * 根组件
 * 负责页面布局和 Footer 显示控制
 * 首页固定高度且禁用滚动（解决移动端 100vh 问题）
 */
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const pageTitle = computed(() => {
    const title = route.meta.title as string | undefined
    return title ? `${title} - ${SITE_CONFIG.title}` : SITE_CONFIG.title
})

const pageUrl = computed(() => `${SITE_CONFIG.url}${route.path}`)

useHead({
    title: pageTitle,
    htmlAttrs: { lang: 'zh-CN' },
    link: [{ rel: 'canonical', href: pageUrl }],
    meta: [
        { name: 'description', content: SITE_CONFIG.description },
        { name: 'author', content: SITE_CONFIG.author },
        { name: 'keywords', content: SITE_CONFIG.keywords },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: SITE_CONFIG.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:image', content: `${SITE_CONFIG.url}/logo.png` },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:site_name', content: SITE_CONFIG.title },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        { name: 'twitter:description', content: SITE_CONFIG.description },
        { name: 'twitter:image', content: `${SITE_CONFIG.url}/logo.png` },
    ],
})
</script>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main {
    flex: 1;
    width: 100%;
}

/* 首页特殊处理：使用 position: fixed 完全脱离文档流 */
.app.is-home {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    z-index: 1;
}

.app.is-home .main {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
