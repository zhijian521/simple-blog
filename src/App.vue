<template>
    <div class="app" :class="{ 'is-home': isHomePage, 'is-loading': isLoading }">
        <PageLoader ref="pageLoader" />
        <main v-show="!isLoading" class="main">
            <router-view v-slot="{ Component }">
                <component :is="Component" :key="route.path" />
            </router-view>
        </main>
        <Footer v-if="!isHomePage && !isLoading" />
        <SpeedInsights />
        <Analytics />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import Footer from '@/components/ui/Footer.vue'
import PageLoader from '@/components/ui/PageLoader.vue'
import { SITE_CONFIG } from '@/constants'
import { PAGE_LOADER_DELAY_MS } from '@/constants/animation'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { Analytics } from '@vercel/analytics/vue'

const route = useRoute()
const router = useRouter()
const pageLoader = ref<InstanceType<typeof PageLoader> | null>(null)
const isLoading = ref(false)
const isHomePage = computed(() => route.path === '/')

const showLoader = () => {
    isLoading.value = true
    pageLoader.value?.show()
    // 强制显示滚动条，防止页面加载时内容闪动
    document.documentElement.style.overflowY = 'scroll'
}

// 设置路由守卫
router.beforeEach((to, from, next) => {
    // 如果是首次加载，不显示加载动画（onMounted 会处理）
    if (from.name === undefined && to.path === '/') {
        next()
        return
    }

    // 显示加载动画
    showLoader()
    next()
})

router.afterEach(() => {
    // 等待 DOM 更新，然后等待一小段时间再隐藏加载器
    nextTick(() => {
        setTimeout(() => {
            isLoading.value = false
            pageLoader.value?.hide()
            document.documentElement.style.overflowY = ''
        }, PAGE_LOADER_DELAY_MS)
    })
})

// 组件挂载时显示加载动画（处理页面刷新）
onMounted(() => {
    showLoader()
    // 页面刷新时等待更长时间再隐藏加载器
    nextTick(() => {
        setTimeout(() => {
            isLoading.value = false
            pageLoader.value?.hide()
            document.documentElement.style.overflowY = ''
        }, PAGE_LOADER_DELAY_MS)
    })
})

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

/* 加载期间强制显示滚动条，防止内容闪动 */
.app.is-loading {
    overflow-y: scroll !important;
}
</style>
