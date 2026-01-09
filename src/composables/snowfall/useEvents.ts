import { setupCanvasResize as commonSetupCanvasResize } from '@/composables/common/useCanvasResize'

/**
 * 设置画布大小调整监听器
 * 重新导出公共函数以保持向后兼容
 * @param canvas - 目标画布元素
 * @param onResize - 尺寸变化回调函数
 * @returns 清理函数，调用后移除监听器
 */
export function setupCanvasResize(canvas: HTMLCanvasElement, onResize: () => void): () => void {
    return commonSetupCanvasResize(canvas, onResize)
}

/**
 * 加载雪花图片
 * @param src - 图片 URL
 * @param timeout - 超时时间（毫秒），默认 5000ms
 * @returns 加载完成的图片元素
 * @throws 图片加载失败或超时时抛出错误
 */
export function loadSnowflakeImage(src: string, timeout = 5000): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            controller.abort()
            reject(new Error(`Snowflake image load timeout: ${src}`))
        }, timeout)

        img.onload = () => {
            clearTimeout(timeoutId)
            resolve(img)
        }
        img.onerror = () => {
            clearTimeout(timeoutId)
            reject(new Error(`Failed to load snowflake image: ${src}`))
        }
        img.src = src
    })
}
