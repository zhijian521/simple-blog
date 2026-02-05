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
