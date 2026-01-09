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
