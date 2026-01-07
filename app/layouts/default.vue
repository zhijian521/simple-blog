<script setup lang="ts">
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <div class="layout" :class="{ 'layout--home': isHomePage }">
    <header v-if="!isHomePage" class="layout__header">
      <nav class="layout__nav">
        <NuxtLink class="layout__brand" to="/">耶温博客</NuxtLink>
        <div class="layout__links">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/articles">文章</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="layout__main" :class="{ 'layout__main--home': isHomePage }">
      <slot />
    </main>

    <footer v-if="!isHomePage" class="layout__footer">
      <span>© {{ new Date().getFullYear() }} 耶温博客</span>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  color: #1f2937;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.layout__header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.layout__nav {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 12px;
}

.layout__brand {
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.layout__links {
  display: flex;
  gap: 12px;
}

.layout__links a {
  color: #374151;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
}

.layout__links a:hover {
  background: #f3f4f6;
}

.layout__main {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.layout__main--home {
  padding: 0;
  max-width: 100%;
}

.layout__footer {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
}
</style>

