<template>
    <div class="home-page">
        <InkBackground v-if="animationsReady" />
        <!-- 雪花飘落特效 -->
        <!-- <SnowfallEffect v-if="animationsReady" /> -->
        <SearchButton @open="showSearch = true" />
        <div class="home-content">
            <section class="hero">
                <h1 class="hero-title">{{ SITE_CONFIG.title }}</h1>
                <p class="hero-subtitle">{{ SITE_CONFIG.description }}</p>
                <div class="hero-actions">
                    <ViewArticleButton to="/articles" text="查看文章" />
                </div>
            </section>
        </div>
        <LatestArticles />
        <GitActivityChart />
        <SearchModal :visible="showSearch" @close="showSearch = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ViewArticleButton from '@/components/ui/ViewArticleButton.vue'
import LatestArticles from '@/components/ui/LatestArticles.vue'
import GitActivityChart from '@/components/ui/GitActivityChart.vue'
import SearchButton from '@/components/ui/SearchButton.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import InkBackground from '@/components/effects/InkBackground.vue'
// import SnowfallEffect from '@/components/effects/SnowfallEffect.vue'
import { SITE_CONFIG } from '@/constants'
import { HOME_ANIMATION_DELAY_MS } from '@/constants/animation'

const showSearch = ref(false)
const animationsReady = ref(false)

// 延迟加载动画，优化首屏加载时间
onMounted(async () => {
    // 等待页面内容渲染完成
    await nextTick()

    // 使用 setTimeout 在下一个事件循环中加载动画
    setTimeout(() => {
        animationsReady.value = true
    }, HOME_ANIMATION_DELAY_MS)
})
</script>

<style scoped>
.home-page {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home-content {
    max-width: var(--container-max-width);
    padding: 0 var(--spacing-lg);
    margin-top: var(--hero-vertical-offset);
}

.hero {
    position: relative;
    z-index: 1;
    text-align: center;
}

.hero-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
}

.hero-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-light);
    font-weight: var(--font-weight-medium);
}

.hero-actions {
    margin-top: var(--spacing-2xl);
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .home-content {
        padding: 0 var(--spacing-md);
    }

    .hero-title {
        font-size: var(--font-size-2xl);
    }

    .hero-subtitle {
        font-size: var(--font-size-sm);
    }
}

@media (max-width: 640px) {
    .hero-title {
        font-size: var(--font-size-xl);
    }
}
</style>
