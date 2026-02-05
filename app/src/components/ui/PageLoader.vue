@ -1,188 +0,0 @@
<template>
    <div v-if="visible" class="page-loader">
        <div class="page-loader-background"></div>
        <div class="page-loader-content">
            <p class="page-loader-text">耶温博客</p>
            <div class="page-loader-lines">
                <span class="page-loader-line"></span>
                <span class="page-loader-line"></span>
                <span class="page-loader-line"></span>
                <span class="page-loader-line"></span>
                <span class="page-loader-line"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
let timer: number | null = null
let startTime: number = 0

const show = () => {
    startTime = Date.now()
    visible.value = true
}

const hide = () => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, 100 - elapsed)

    timer = window.setTimeout(() => {
        visible.value = false
        timer = null
    }, remaining)
}

const fadeOut = () => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
    visible.value = false
}

const forceHide = () => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
    visible.value = false
}

defineExpose({
    show,
    hide,
    fadeOut,
    forceHide,
})
</script>

<style scoped>
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 1;
    pointer-events: none;
    /* 固定宽度，防止滚动条导致内容跳动 */
    overflow: hidden;
}

.page-loader-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg-page);
    background-image: var(--bg-grid);
    background-size: var(--bg-grid-size);
}

.page-loader-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    /* 绝对居中，不受滚动条影响 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 8vh));
}

.page-loader-text {
    margin: 0;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-light);
    letter-spacing: 0;
}

.page-loader-lines {
    display: flex;
    align-items: center;
    gap: 6px;
}

.page-loader-line {
    width: 8px;
    height: 1.5px;
    background: var(--color-accent);
    border-radius: 0.75px;
    opacity: 0.25;
    animation: lineSweep 1.6s ease-in-out infinite;
}

.page-loader-line:nth-child(1) {
    animation-delay: 0s;
}

.page-loader-line:nth-child(2) {
    animation-delay: 0.1s;
}

.page-loader-line:nth-child(3) {
    animation-delay: 0.2s;
}

.page-loader-line:nth-child(4) {
    animation-delay: 0.3s;
}

.page-loader-line:nth-child(5) {
    animation-delay: 0.4s;
}

@keyframes lineSweep {
    0%,
    100% {
        opacity: 0.25;
        transform: scaleX(0.5);
    }
    20% {
        opacity: 0.8;
        transform: scaleX(1);
    }
    40% {
        opacity: 0.25;
        transform: scaleX(0.5);
    }
    60% {
        opacity: 0.25;
        transform: scaleX(0.5);
    }
    80% {
        opacity: 0.8;
        transform: scaleX(1);
    }
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .page-loader-content {
        gap: 1.25rem;
    }

    .page-loader-text {
        font-size: var(--font-size-xs);
    }

    .page-loader-line {
        width: 6px;
        height: 1.25px;
    }
}
</style>
