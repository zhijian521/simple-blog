<template>
  <div class="home-page">
    <InkBackground />
    <SnowfallEffect />
    <div class="home-content">
      <section class="hero">
        <h1 class="hero-title">耶温博客</h1>
        <p class="hero-subtitle">记录思考，分享知识</p>
        <div class="hero-actions">
          <ViewArticleButton to="/articles" text="查看文章" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import ViewArticleButton from '@/components/ui/ViewArticleButton.vue'
import InkBackground from '@/components/effects/InkBackground.vue'
import SnowfallEffect from '@/components/effects/SnowfallEffect.vue'

/**
 * 首页
 * 展示博客标题和导航，包含水滴涟漪和雪花飘落背景特效
 */
</script>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-content {
  max-width: var(--container-max-width);
  padding: 0 var(--spacing-lg);
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
@media (max-width: var(--breakpoint-md)) {
  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-sm);
  }

  .home-content {
    padding: 0 var(--spacing-md);
  }
}

@media (max-width: var(--breakpoint-sm)) {
  .hero-title {
    font-size: var(--font-size-xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-xs);
  }
}
</style>
