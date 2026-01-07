<script setup lang="ts"></script>

<template>
  <main class="home">
    <section class="home__content" aria-label="首页">
      <h1 class="home__title">Simple Blog</h1>
      <p class="home__subtitle">记录思考，分享知识</p>

      <div class="home__actions">
        <RouterLink class="button" to="/articles">查看文章</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-page);
}

.home__content {
  text-align: center;
  max-width: 640px;
}

.home__title {
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.1;
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.home__subtitle {
  margin: 0 0 var(--spacing-lg);
  color: var(--color-text-light);
  font-size: var(--font-size-lg);
  line-height: 1.6;
}

.home__actions {
  display: flex;
  justify-content: center;
}
</style>
