<template>
  <canvas ref="canvasRef" class="ink-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ripple } from '@/types/ripple'
import { startAnimationLoop } from '@/composables/ripple/useAnimation'
import { setupRippleEvents, setupCanvasResize } from '@/composables/ripple/useEvents'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 本地状态管理
const ripples: Ripple[] = []
const lastRippleTime = { value: 0 }
const mousePos = { x: 0, y: 0 }
const lastMouseRippleTime = { value: 0 }

let animationFrameId: number | null = null
let cleanupEvents: (() => void) | null = null
let cleanupResize: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return

  // 设置 Canvas 尺寸
  cleanupResize = setupCanvasResize(canvas)

  // 设置事件监听
  cleanupEvents = setupRippleEvents(canvas, ripples, mousePos, lastMouseRippleTime)

  // 启动动画循环
  animationFrameId = startAnimationLoop(canvas, ctx, ripples, lastRippleTime)
})

onUnmounted(() => {
  // 清理动画帧
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  // 清理事件监听器
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
