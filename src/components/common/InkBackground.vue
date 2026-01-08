<template>
    <canvas ref="canvasRef" class="ink-background"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRippleState } from '@/composables/useRippleState'
import { animateRipples } from '@/composables/useRippleAnimation'
import { setupRippleEvents, setupCanvasResize } from '@/composables/useRippleEvents'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
let cleanupEvents: (() => void) | null = null
let cleanupResize: (() => void) | null = null

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // 初始化状态
    const state = useRippleState()

    // 设置 Canvas 尺寸
    const resizeSetup = setupCanvasResize(canvas)
    cleanupResize = resizeSetup.cleanup

    // 设置事件监听
    cleanupEvents = setupRippleEvents(canvas, state.ripples.value, state.mousePos, state.lastMouseRippleTime)

    // 启动动画循环
    animationFrameId = animateRipples(canvas, ctx, state.ripples.value, state.lastRippleTime)
})

onUnmounted(() => {
    // 清理事件监听器
    if (cleanupEvents) cleanupEvents()
    if (cleanupResize) cleanupResize()

    // 取消动画帧
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
})
</script>

<style scoped>
.ink-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    z-index: 0;
    mix-blend-mode: normal;
    cursor: default;
}
</style>
