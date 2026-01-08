import { RIPPLE_CONFIG } from './useConfig'
import { createRipples } from './useAnimation'
import type { Ripple } from '@/types/ripple'

/**
 * 设置涟漪交互事件监听器
 * @returns 清理函数
 */
export function setupRippleEvents(
  canvas: HTMLCanvasElement,
  ripples: Ripple[],
  mousePos: { x: number; y: number },
  lastMouseRippleTime: { value: number }
): () => void {
  const handleClick = (e: MouseEvent) => {
    if (e.target !== canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const clickIntensity = 0.5 + Math.random() * 0.5

    if (ripples.length < RIPPLE_CONFIG.MAX_RIPPLES) {
      createRipples(x, y, clickIntensity, canvas, ripples)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    const { MOUSE_MOVE, MAX_RIPPLES } = RIPPLE_CONFIG
    if (!MOUSE_MOVE.enabled) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 计算鼠标移动距离
    const dx = x - mousePos.x
    const dy = y - mousePos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    mousePos.x = x
    mousePos.y = y

    // 移动距离超过阈值且满足节流条件时生成涟漪
    if (distance > MOUSE_MOVE.minDistance) {
      const currentTime = Date.now()
      if (currentTime - lastMouseRippleTime.value > MOUSE_MOVE.throttleTime) {
        // 只统计低强度涟漪，避免鼠标触发过多
        const mouseRipples = ripples.filter((r) => r.intensity < 0.3)

        if (mouseRipples.length < MOUSE_MOVE.maxCount && ripples.length < MAX_RIPPLES) {
          createRipples(x, y, MOUSE_MOVE.intensity + Math.random() * 0.1, canvas, ripples)
        }

        lastMouseRippleTime.value = currentTime
      }
    }
  }

  // 使用捕获阶段确保事件优先处理
  canvas.addEventListener('click', handleClick, true)
  canvas.addEventListener('mousemove', handleMouseMove, true)

  // 返回清理函数
  return () => {
    canvas.removeEventListener('click', handleClick, true)
    canvas.removeEventListener('mousemove', handleMouseMove, true)
  }
}

/**
 * 设置 Canvas 尺寸自动调整
 * @returns 清理函数
 */
export function setupCanvasResize(canvas: HTMLCanvasElement): () => void {
  const resize = () => {
    // 获取父容器的实际尺寸
    const parent = canvas.parentElement
    if (parent) {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    } else {
      // 回退到窗口尺寸
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }

  // 初始设置
  resize()

  // 监听窗口大小变化（添加防抖）
  let resizeTimer: number | null = null
  const handleResize = () => {
    if (resizeTimer !== null) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = window.setTimeout(() => {
      resize()
      resizeTimer = null
    }, 100)
  }

  window.addEventListener('resize', handleResize)

  // 移动端优化：监听方向变化
  window.addEventListener('orientationchange', () => {
    setTimeout(resize, 100)
  })

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer !== null) {
      clearTimeout(resizeTimer)
    }
  }
}
