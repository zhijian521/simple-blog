<template>
    <div class="layout">
        <header class="layout__header">
            <nav class="layout__nav">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </header>

        <main class="layout__main">
            <RouterView />
        </main>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.layout__header {
    border-bottom: 1px solid #e5e7eb;
}

.layout__nav {
    max-width: 960px;
    margin: 0 auto;
    padding: 12px 16px;
    display: flex;
    gap: 12px;
}

.layout__main {
    max-width: 960px;
    width: 100%;
    margin: 0 auto;
    padding: 24px 16px;
}
</style>
