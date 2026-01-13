<template>
    <canvas
        ref="canvasRef"
        class="snowfall-effect"
        aria-label="雪花飘落动画效果"
        role="img"
    ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Snowflake } from '@/types/snowflake'
import { getSnowflakeCount } from '@/composables/snowfall/useConfig'
import { initializeSnowflakes, startAnimationLoop } from '@/composables/snowfall/useAnimation'
import { loadSnowflakeImage } from '@/composables/snowfall/useEvents'
import { setupCanvasResize } from '@/composables/common/useCanvasResize'
import { useVisibilityChange } from '@/composables/common/useVisibility'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const snowflakes = ref<Snowflake[]>([])
const snowflakeImage = ref<HTMLImageElement | null>(null)

let animationFrameId: number | null = null
let cleanupResize: (() => void) | null = null
let cleanupVisibility: (() => void) | null = null

const resetSnowflakes = (canvasWidth: number, canvasHeight: number) => {
    const count = getSnowflakeCount(window.innerWidth)
    snowflakes.value = initializeSnowflakes(count, canvasWidth, canvasHeight)
}

const restartAnimation = () => {
    const canvas = canvasRef.value
    const image = snowflakeImage.value
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
    }

    resetSnowflakes(canvas.width, canvas.height)
    animationFrameId = startAnimationLoop(canvas, ctx, snowflakes.value, image)
}

onMounted(async () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
        const image = await loadSnowflakeImage(
            new URL('@/assets/snowflake.svg', import.meta.url).href
        )
        snowflakeImage.value = image

        resetSnowflakes(canvas.width, canvas.height)
        cleanupResize = setupCanvasResize(canvas, restartAnimation)

        const startAnimation = () => {
            animationFrameId = startAnimationLoop(canvas, ctx, snowflakes.value, image)
        }

        const stopAnimation = () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId)
                animationFrameId = null
            }
        }

        cleanupVisibility = useVisibilityChange(startAnimation, stopAnimation)

        startAnimation()
    } catch (error) {
        console.error('Failed to initialize snowfall effect:', error)
    }
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
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
.snowfall-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}
</style>
