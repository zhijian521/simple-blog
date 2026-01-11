<!--
  雪花配置：
  - 大小：三种尺寸（小、中、大）
  - 速度：与大小成反比
  - 数量：响应式（移动端 30，平板 45，桌面 55，大屏 65）
  - 效果：风力、旋转、透明度变化
-->
<template>
    <canvas ref="canvasRef" class="snowfall-effect"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Snowflake } from '@/types/snowflake'
import { getSnowflakeCount } from '@/composables/snowfall/useConfig'
import { initializeSnowflakes, startAnimationLoop } from '@/composables/snowfall/useAnimation'
import { loadSnowflakeImage } from '@/composables/snowfall/useEvents'
import { setupCanvasResize } from '@/composables/common/useCanvasResize'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 本地状态管理
const snowflakes = ref<Snowflake[]>([])
const snowflakeImage = ref<HTMLImageElement | null>(null)
let animationFrameId: number | null = null
let cleanupResize: (() => void) | null = null

/**
 * 根据屏幕尺寸重新初始化雪花
 */
const resetSnowflakes = (canvasWidth: number, canvasHeight: number) => {
    const count = getSnowflakeCount(window.innerWidth)
    snowflakes.value = initializeSnowflakes(count, canvasWidth, canvasHeight)
}

/**
 * 重启动画循环（用于窗口大小变化后）
 */
const restartAnimation = () => {
    const canvas = canvasRef.value
    const image = snowflakeImage.value
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 取消当前动画循环
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
    }

    // 重新初始化雪花并启动动画
    resetSnowflakes(canvas.width, canvas.height)
    animationFrameId = startAnimationLoop(canvas, ctx, snowflakes.value, image)
}

onMounted(async () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
        // 加载雪花 SVG 图片
        const image = await loadSnowflakeImage(
            new URL('@/assets/snowflake.svg', import.meta.url).href
        )
        snowflakeImage.value = image

        // 设置画布大小并初始化雪花
        resetSnowflakes(canvas.width, canvas.height)

        // 设置画布大小调整监听
        cleanupResize = setupCanvasResize(canvas, restartAnimation)

        // 启动动画循环
        animationFrameId = startAnimationLoop(canvas, ctx, snowflakes.value, image)
    } catch (error) {
        console.error('Failed to initialize snowfall effect:', error)
    }
})

onUnmounted(() => {
    // 清理动画循环
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    // 清理事件监听
    if (cleanupResize) {
        cleanupResize()
        cleanupResize = null
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
