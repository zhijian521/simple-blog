<template>
    <div class="app">
        <main class="main">
            <router-view />
        </main>
        <footer class="footer">
            <p>&copy; 2026 耶温博客</p>
        </footer>
    </div>
</template>

<script setup lang="ts"></script>

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

.footer {
    border-top: 1px solid var(--color-border);
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    margin-top: auto;
    color: var(--color-text-lighter);
    font-size: var(--font-size-sm);
}
</style>
