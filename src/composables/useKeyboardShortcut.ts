/**
 * 全局快捷键 Composable
 *
 * 功能：
 * - 提供类型安全的快捷键监听
 * - 支持组合键（Ctrl/Cmd）
 * - 自动过滤输入框中的按键
 * - 自动清理事件监听器
 */

import { onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcutOptions {
    /** 是否需要 Ctrl 或 Cmd 键 */
    ctrlKey?: boolean
    /** 是否阻止默认行为 */
    preventDefault?: boolean
    /** 是否在输入框中触发 */
    ignoreInputs?: boolean
    /** 自定义条件判断 */
    condition?: () => boolean
}

/**
 * 注册全局快捷键
 *
 * @param key - 按键名称（区分大小写，不区分时用小写）
 * @param callback - 触发时的回调函数
 * @param options - 配置选项
 *
 * @example
 * ```ts
 * // 简单快捷键
 * useKeyboardShortcut('Escape', () => {
 *   closeModal()
 * })
 *
 * // 组合键
 * useKeyboardShortcut('k', () => {
 *   openSearch()
 * }, { ctrlKey: true, preventDefault: true, ignoreInputs: true })
 *
 * // 带条件
 * useKeyboardShortcut('q', () => {
 *   toggleSearch()
 * }, { ignoreInputs: true, condition: () => !isSearchOpen.value })
 * ```
 */
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: KeyboardShortcutOptions = {}
) {
    const { ctrlKey = false, preventDefault = false, ignoreInputs = false, condition } = options

    /**
     * 检查当前焦点是否在可编辑元素中
     */
    const isInputFocused = (target: HTMLElement): boolean => {
        return (
            target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
        )
    }

    /**
     * 处理按键事件
     */
    const handleKeydown = (e: KeyboardEvent) => {
        // 检查自定义条件
        if (condition && !condition()) {
            return
        }

        // 检查组合键
        if (ctrlKey && !e.ctrlKey && !e.metaKey) {
            return
        }

        // 检查是否忽略输入框
        if (ignoreInputs && isInputFocused(e.target as HTMLElement)) {
            return
        }

        // 检查按键（不区分大小写）
        if (e.key.toLowerCase() === key.toLowerCase()) {
            if (preventDefault) {
                e.preventDefault()
            }
            callback()
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown)
    })
}
