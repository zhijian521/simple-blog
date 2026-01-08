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
import Footer from '@/components/ui/Footer.vue'

/**
 * 根组件
 * 负责页面布局和 Footer 显示控制
 * 首页固定高度且禁用滚动（解决移动端 100vh 问题）
 */
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
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

/* 首页特殊处理：固定高度并禁用滚动（解决移动端 100vh 不稳定问题） */
.app.is-home {
  height: 100vh; /* 传统浏览器回退 */
  height: 100dvh; /* 现代浏览器动态视口 */
  overflow: hidden;
}
</style>
