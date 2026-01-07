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
  padding: 24px;
  background: var(--color-bg);
  background-image:
    linear-gradient(var(--color-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
  background-size: 40px 40px;
}

.home__content {
  text-align: center;
  max-width: 640px;
}

.home__title {
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.1;
  margin: 0 0 12px;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.home__subtitle {
  margin: 0 0 28px;
  color: var(--color-text-muted);
  font-size: 18px;
  line-height: 1.6;
}

.home__actions {
  display: flex;
  justify-content: center;
}
</style>

