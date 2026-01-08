<template>
    <div class="app">
        <main class="main" :class="{ 'no-footer': isHomePage }">
            <router-view />
        </main>
        <Footer v-if="!isHomePage" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/ui/Footer.vue'

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

.main.no-footer {
    height: 100vh;
}
</style>
