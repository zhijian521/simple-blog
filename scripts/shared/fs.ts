/**
 * 文件系统工具函数
 */

import fs from 'fs'
import path from 'path'

/**
 * 递归扫描目录，生成文件路径
 * @param dir - 要扫描的目录路径
 * @param ext - 文件扩展名过滤（如 '.md'）
 */
export function* walkDir(dir: string, ext?: string): Generator<string> {
    const files = fs.readdirSync(dir, { withFileTypes: true })

    for (const file of files) {
        const fullPath = path.join(dir, file.name)
        if (file.isDirectory()) {
            yield* walkDir(fullPath, ext)
        } else if (!ext || file.name.endsWith(ext)) {
            yield fullPath
        }
    }
}

/**
 * 确保目录存在，不存在则创建
 */
export function ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}
