/**
 * 设置画布大小调整监听器
 * @param canvas - 目标画布元素
 * @param onResize - 尺寸变化回调函数
 * @returns 清理函数，调用后移除监听器
 */
export function setupCanvasResize(canvas: HTMLCanvasElement, onResize: () => void): () => void {
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    onResize()
  }

  // 初始设置
  resize()

  // 监听窗口大小变化
  window.addEventListener('resize', resize)

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', resize)
  }
}

/**
 * 加载雪花图片
 * @param src - 图片 URL
 * @returns 加载完成的图片元素
 * @throws 图片加载失败时抛出错误
 */
export function loadSnowflakeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load snowflake image: ${src}`))
    img.src = src
  })
}
