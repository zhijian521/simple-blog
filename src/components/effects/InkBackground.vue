<template>
    <canvas
        ref="canvasRef"
        class="ink-background"
        aria-label="水滴涟漪背景动画效果"
        role="img"
    ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ripple } from '@/types/ripple'
import type { MousePosition, TimeRef } from '@/types/common'
import { startAnimationLoop } from '@/composables/ripple/useAnimation'
import { setupRippleEvents } from '@/composables/ripple/useEvents'
import { setupCanvasResize } from '@/composables/common/useCanvasResize'
import { useVisibilityChange } from '@/composables/common/useVisibility'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const ripples: Ripple[] = []
const lastRippleTime: TimeRef = { value: 0 }
const mousePosition: MousePosition = { x: 0, y: 0 }
const lastMouseRippleTime: TimeRef = { value: 0 }

let animationFrameId: number | null = null
let cleanupEvents: (() => void) | null = null
let cleanupResize: (() => void) | null = null
let cleanupVisibility: (() => void) | null = null

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    cleanupResize = setupCanvasResize(canvas)
    cleanupEvents = setupRippleEvents(canvas, ripples, mousePosition, lastMouseRippleTime)

    const startAnimation = () => {
        animationFrameId = startAnimationLoop(canvas, ctx, ripples, lastRippleTime)
    }

    const stopAnimation = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        }
    }

    cleanupVisibility = useVisibilityChange(startAnimation, stopAnimation)

    startAnimation()
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    if (cleanupEvents) {
        cleanupEvents()
        cleanupEvents = null
    }

    if (cleanupResize) {
        cleanupResize()
        cleanupResize = null
    }

    if (cleanupVisibility) {
        cleanupVisibility()
        cleanupVisibility = null
    }
})
</script>

<style scoped>
.ink-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    z-index: 0;
    mix-blend-mode: normal;
    cursor: default;
    /* 移动端优化：确保 Canvas 尺寸正确 */
    display: block;
}
</style>
