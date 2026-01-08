/**
 * Canvas 尺寸调整 Composable
 *
 * 功能：
 * - 自动设置 Canvas 尺寸为父容器大小
 * - 响应窗口大小变化（带防抖）
 * - 监听移动端屏幕旋转
 * - 支持可选的尺寸变化回调
 *
 * @param canvas - 目标 Canvas 元素
 * @param onResize - 可选的尺寸变化回调函数
 * @returns 清理函数，调用后移除所有监听器
 */
export function setupCanvasResize(canvas: HTMLCanvasElement, onResize?: () => void): () => void {
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
        // 触发回调（如果提供）
        onResize?.()
    }

    // 初始设置
    resize()

    // 监听窗口大小变化（添加 100ms 防抖）
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
