<!--
  InkBackground - 水滴涟漪背景特效组件

  用途：
  - 用于首页背景装饰
  - 创建交互式水滴涟漪动画效果

  功能：
  - 点击画布生成涟漪效果
  - 鼠标移动自动生成小涟漪
  - 支持多种涟漪颜色和透明度
  - 自动画布尺寸调整
  - 完整的资源清理机制

  技术实现：
  - 使用 Canvas 2D API 绘制
  - requestAnimationFrame 实现平滑动画
  - 模块化 Composables 架构（useAnimation、useEvents、useConfig）
  - 防抖优化 resize 性能
  - 移动端方向变化监听

  性能优化：
  - 最大涟漪数量限制
  - 鼠标事件节流
  - 自动清理过期涟漪
-->
<template>
    <canvas ref="canvasRef" class="ink-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ripple } from '@/types/ripple'
import { startAnimationLoop } from '@/composables/ripple/useAnimation'
import { setupRippleEvents } from '@/composables/ripple/useEvents'
import { setupCanvasResize } from '@/composables/common/useCanvasResize'

/**
 * 水滴涟漪背景特效组件
 * 使用 Canvas 绘制交互式涟漪效果
 */

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 涟漪状态
const ripples: Ripple[] = []
const lastRippleTime = { value: 0 }
const mousePosition = { x: 0, y: 0 }
const lastMouseRippleTime = { value: 0 }

// 清理函数
let animationFrameId: number | null = null
let cleanupEvents: (() => void) | null = null
let cleanupResize: (() => void) | null = null

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // 初始化 Canvas 尺寸和事件监听
    cleanupResize = setupCanvasResize(canvas)
    cleanupEvents = setupRippleEvents(canvas, ripples, mousePosition, lastMouseRippleTime)
    animationFrameId = startAnimationLoop(canvas, ctx, ripples, lastRippleTime)
})

onUnmounted(() => {
    // 清理所有资源
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
