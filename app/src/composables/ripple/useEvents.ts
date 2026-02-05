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
                const mouseRipples = ripples.filter(r => r.intensity < 0.3)

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
