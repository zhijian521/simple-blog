/**
 * 路由工具函数模块
 *
 * 功能：
 * - 提取和验证路由参数中的 ID
 * - 提供类型安全的路由参数处理
 */

/**
 * 从路由参数中提取有效的 ID 字符串
 *
 * @param id - 路由参数（可能是字符串或字符串数组）
 * @returns 有效的 ID 字符串，如果无效则返回空字符串
 *
 * @example
 * ```ts
 * // 单个字符串参数
 * extractRouteId('abc123') // => 'abc123'
 *
 * // 数组参数（取第一个元素）
 * extractRouteId(['abc123', 'def456']) // => 'abc123'
 *
 * // 无效参数
 * extractRouteId('') // => ''
 * extractRouteId([]) // => ''
 * extractRouteId(null) // => ''
 * ```
 */
export function extractRouteId(id: string | string[] | undefined): string {
    // 处理 undefined
    if (id === undefined) {
        return ''
    }

    // 处理数组参数（取第一个元素）
    const validatedId = Array.isArray(id) ? id[0] : id

    // 验证 ID 非空且为字符串
    if (!validatedId || typeof validatedId !== 'string' || validatedId.length === 0) {
        return ''
    }

    return validatedId
}

/**
 * 验证 ID 格式是否有效
 *
 * @param id - 待验证的 ID
 * @returns 是否为有效 ID
 */
export function isValidRouteId(id: string | null | undefined): id is string {
    return Boolean(id && typeof id === 'string' && id.length > 0)
}
