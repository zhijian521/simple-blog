<template>
    <div class="home-page">
        <InkBackground v-if="animationsReady" />
        <!-- 雪花飘落特效 -->
        <!-- <SnowfallEffect v-if="animationsReady" /> -->
        <div class="home-content">
            <section class="hero">
                <h1 class="hero-title">{{ SITE_CONFIG.title }}</h1>
                <p class="hero-subtitle">{{ SITE_CONFIG.description }}</p>
                <div class="hero-actions">
                    <ViewArticleButton to="/articles" text="查看文章" />
                </div>
                <div class="hero-shortcuts">
                    <SearchButton @open="showSearch = true" />
                    <IconButton
                        aria-label="文章目录"
                        title="文章目录"
                        @click="showDocumentTree = true"
                    >
                        <DocumentTreeIcon />
                    </IconButton>
                    <IconButton aria-label="报纸排版" title="报纸排版" to="/newspaper">
                        <NewspaperIcon />
                    </IconButton>
                    <IconButton
                        aria-label="GitHub"
                        title="GitHub"
                        href="https://github.com/zhijian521/simple-blog"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHubIcon />
                    </IconButton>
                </div>
            </section>
        </div>
        <LatestArticles />
        <GitActivityChart />
        <SearchModal :visible="showSearch" @close="showSearch = false" />
        <DocumentTreeModal :visible="showDocumentTree" @close="showDocumentTree = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ViewArticleButton from '@/components/ui/ViewArticleButton.vue'
import LatestArticles from '@/components/ui/LatestArticles.vue'
import GitActivityChart from '@/components/ui/GitActivityChart.vue'
import SearchButton from '@/components/ui/SearchButton.vue'
import SearchModal from '@/components/ui/SearchModal.vue'
import IconButton from '@/components/ui/IconButton.vue'
import DocumentTreeIcon from '@/components/icons/DocumentTreeIcon.vue'
import NewspaperIcon from '@/components/icons/NewspaperIcon.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import DocumentTreeModal from '@/components/ui/DocumentTreeModal.vue'
import InkBackground from '@/components/effects/InkBackground.vue'
// import SnowfallEffect from '@/components/effects/SnowfallEffect.vue'
import { SITE_CONFIG } from '@/constants'
import { HOME_ANIMATION_DELAY_MS } from '@/constants/animation'

const showSearch = ref(false)
const showDocumentTree = ref(false)
const animationsReady = ref(false)

onMounted(async () => {
    await nextTick()

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

.hero-shortcuts {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 5rem;
}

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

    .hero-shortcuts {
        gap: 0.875rem;
    }
}

@media (max-width: 640px) {
    .hero-title {
        font-size: var(--font-size-xl);
    }

    .hero-shortcuts {
        gap: 0.75rem;
    }
}
</style>
