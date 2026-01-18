/**
 * Vite 插件：实时监听 blogs 目录变化
 *
 * 功能：
 * - 监听 blogs 目录下所有 .md 文件的增删改
 * - 自动为新文件或修改后的文件添加 ID（如果缺少）
 * - 触发客户端热更新文章数据
 */

import { Plugin, type ViteDevServer } from 'vite'
import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import matter from 'front-matter'
import type { ArticleFrontMatter } from '../types/article'
import { generateId as sharedGenerateId } from '../utils/article-id'

// 常量配置
const MARKDOWN_EXTENSION = '.md'
const RELOAD_DELAY_WITH_UPDATE = 200
const RELOAD_DELAY_NORMAL = 100
const WRITE_STABILITY_THRESHOLD = 300
const WRITE_POLL_INTERVAL = 100
const DEBUG = process.env.NODE_ENV === 'development'

/**
 * 生成随机 8 位 ID（小写字母和数字）
 * 使用共享的 ID 生成函数
 */
function generateId(): string {
    return sharedGenerateId()
}

/**
 * 判断文件是否为 Markdown 文件
 */
function isMarkdownFile(filePath: string): boolean {
    return filePath.endsWith(MARKDOWN_EXTENSION)
}

/**
 * 确保文件有 ID，如果没有则添加
 * @returns 是否成功添加了 ID
 */
function ensureFileId(filePath: string): boolean {
    try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { attributes, body } = matter<ArticleFrontMatter>(content)

        // 检查是否已有 id
        if (attributes.id) {
            if (DEBUG) {
                console.log(`[BlogWatcher] 文件已有 ID: ${attributes.id}`)
            }
            return false
        }

        // 生成新 ID
        const newId = generateId()

        // 构建新的 front-matter（ArticleFrontMatter 已支持索引签名）
        const newAttributes: ArticleFrontMatter = { ...attributes, id: newId }
        const newFrontMatter = Object.entries(newAttributes)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
                }
                // 字符串直接输出，其他类型用 JSON.stringify
                if (typeof value === 'string') {
                    return `${key}: ${value}`
                }
                return `${key}: ${JSON.stringify(value)}`
            })
            .join('\n')

        // 写入新内容
        const newContent = `---\n${newFrontMatter}\n---\n\n${body}`
        fs.writeFileSync(filePath, newContent, 'utf-8')

        console.log(`[BlogWatcher] ✓ 为 ${path.basename(filePath)} 添加 ID: ${newId}`)
        return true
    } catch (error) {
        console.error(`[BlogWatcher] 处理文件 ${filePath} 时出错:`, error)
        return false
    }
}

/**
 * 触发页面刷新
 */
function triggerReload(server: ViteDevServer, delay: number): void {
    if (DEBUG) {
        console.log(`[BlogWatcher] 触发页面刷新`)
    }
    setTimeout(() => {
        server.moduleGraph.invalidateAll()
        server.ws.send({
            type: 'full-reload',
            path: '*',
        })
    }, delay)
}

export function blogWatcher(): Plugin {
    let watcher: ReturnType<typeof chokidar.watch> | null = null
    let blogsDir: string

    return {
        name: 'blog-watcher',

        configResolved(config) {
            blogsDir = path.resolve(config.root, 'blogs')
        },

        configureServer(server) {
            if (DEBUG) {
                console.log(`[BlogWatcher] 监听目录: ${blogsDir}`)
            }

            // 监听 blogs 目录
            watcher = chokidar.watch(blogsDir, {
                ignored: /(^|[/\\])\../,
                ignoreInitial: true,
                persistent: true,
                ignorePermissionErrors: true,
                awaitWriteFinish: {
                    stabilityThreshold: WRITE_STABILITY_THRESHOLD,
                    pollInterval: WRITE_POLL_INTERVAL,
                },
            })

            // 监听所有事件（仅调试模式）
            if (DEBUG) {
                watcher.on('all', (event: string, filePath: string) => {
                    if (isMarkdownFile(filePath)) {
                        console.log(`[BlogWatcher] 事件: ${event}, 文件: ${filePath}`)
                    }
                })
            }

            // 文件添加
            watcher.on('add', (filePath: string) => {
                if (!isMarkdownFile(filePath)) return

                if (DEBUG) {
                    console.log(`[BlogWatcher] 📝 检测到新文件: ${filePath}`)
                }

                const updated = ensureFileId(filePath)
                triggerReload(server, updated ? RELOAD_DELAY_WITH_UPDATE : 0)
            })

            // 文件修改
            watcher.on('change', (filePath: string) => {
                if (!isMarkdownFile(filePath)) return

                if (DEBUG) {
                    console.log(`[BlogWatcher] 📝 文件已修改: ${filePath}`)
                }

                const updated = ensureFileId(filePath)
                triggerReload(server, updated ? RELOAD_DELAY_WITH_UPDATE : RELOAD_DELAY_NORMAL)
            })

            // 文件删除
            watcher.on('unlink', (filePath: string) => {
                if (!isMarkdownFile(filePath)) return

                if (DEBUG) {
                    console.log(`[BlogWatcher] 🗑️  文件已删除: ${filePath}`)
                }

                triggerReload(server, RELOAD_DELAY_NORMAL)
            })

            // 错误处理
            watcher.on('error', (error: unknown) => {
                console.error(`[BlogWatcher] 监听器错误:`, error)
            })

            if (DEBUG) {
                watcher.on('ready', () => {
                    console.log('[BlogWatcher] 🔍 blogs 目录监听已就绪')
                })

                console.log('[BlogWatcher] 🔍 已启动 blogs 目录监听')
            }
        },

        buildEnd() {
            if (watcher) {
                watcher.close()
                if (DEBUG) {
                    console.log('[BlogWatcher] 🔍 已关闭 blogs 目录监听')
                }
            }
        },
    }
}
