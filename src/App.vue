<template>
    <div class="app">
        <main class="main">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import Footer from '@/components/common/Footer.vue'
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
</style>
