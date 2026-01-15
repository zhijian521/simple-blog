/**
 * 滚动锁定工具
 * 使用 position: fixed 方式保持滚动条显示，避免页面闪烁
 */

let isLocked = false
let scrollY = 0
let originalBodyStyles: {
    position: string
    top: string
    width: string
    overflow: string
} = {
    position: '',
    top: '',
    width: '',
    overflow: '',
}

/**
 * 保存当前滚动位置
 */
const saveScrollPosition = (): void => {
    scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
}

/**
 * 恢复滚动位置
 */
const restoreScrollPosition = (): void => {
    if (scrollY > 0) {
        window.scrollTo(0, scrollY)
    }
}

/**
 * 禁止背景滚动（保持滚动条显示）
 */
export const lockScroll = (): void => {
    if (typeof document === 'undefined' || isLocked) return

    const body = document.body

    // 保存当前滚动位置和 body 样式
    saveScrollPosition()
    originalBodyStyles = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
    }

    // 使用 position: fixed 锁定滚动，同时保持滚动条显示
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'

    isLocked = true
}

/**
 * 恢复背景滚动
 */
export const unlockScroll = (): void => {
    if (typeof document === 'undefined' || !isLocked) return

    const body = document.body

    // 恢复 body 样式
    body.style.position = originalBodyStyles.position
    body.style.top = originalBodyStyles.top
    body.style.width = originalBodyStyles.width
    body.style.overflow = originalBodyStyles.overflow

    // 恢复滚动位置
    restoreScrollPosition()

    isLocked = false
}
