import { RIPPLE_CONFIG } from './useRippleConfig'
import { createRipples } from './useRippleAnimation'
import type { Ripple } from '../types/ripple'

/**
 * 设置事件监听器
 */
export function setupRippleEvents(
    canvas: HTMLCanvasElement,
    ripples: Ripple[],
    mousePos: { value: { x: number; y: number } },
    lastMouseRippleTime: { value: number }
) {
    const handleClick = (e: MouseEvent) => {
        if (e.target === canvas) {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const clickIntensity = 0.5 + Math.random() * 0.5

            // 检查波纹数量，防止性能问题
            if (ripples.length < RIPPLE_CONFIG.MAX_RIPPLES) {
                createRipples(x, y, clickIntensity, canvas, ripples)
            }
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        const { MOUSE_MOVE } = RIPPLE_CONFIG
        if (!MOUSE_MOVE.enabled) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const dx = x - mousePos.value.x
        const dy = y - mousePos.value.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        mousePos.value = { x, y }

        if (distance > MOUSE_MOVE.minDistance) {
            const currentTime = Date.now()
            if (currentTime - lastMouseRippleTime.value > 150) {
                const mouseRipples = ripples.filter(r => r.intensity < 0.3)
                if (
                    mouseRipples.length < MOUSE_MOVE.maxCount &&
                    ripples.length < RIPPLE_CONFIG.MAX_RIPPLES
                ) {
                    createRipples(x, y, MOUSE_MOVE.intensity + Math.random() * 0.1, canvas, ripples)
                }
                lastMouseRippleTime.value = currentTime
            }
        }
    }

    canvas.addEventListener('click', handleClick, true)
    canvas.addEventListener('mousemove', handleMouseMove, true)

    // 返回清理函数
    return () => {
        canvas.removeEventListener('click', handleClick, true)
        canvas.removeEventListener('mousemove', handleMouseMove, true)
    }
}

/**
 * 设置 Canvas 尺寸调整
 */
export function setupCanvasResize(
    canvas: HTMLCanvasElement
): { resize: () => void; cleanup: () => void } {
    const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    resizeCanvas()

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)

    return {
        resize: resizeCanvas,
        cleanup: () => window.removeEventListener('resize', handleResize),
    }
}
