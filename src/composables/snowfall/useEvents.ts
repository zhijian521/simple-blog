/**
 * 设置画布大小调整监听器
 * @param canvas - 目标画布元素
 * @param onResize - 尺寸变化回调函数
 * @returns 清理函数，调用后移除监听器
 */
export function setupCanvasResize(canvas: HTMLCanvasElement, onResize: () => void): () => void {
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
    onResize()
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
