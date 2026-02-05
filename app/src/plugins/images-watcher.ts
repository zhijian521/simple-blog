import type { Plugin } from 'vite'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'

const DEBUG = process.env.NODE_ENV === 'development'

function ensureDir(dir: string): void {
    fs.mkdirSync(dir, { recursive: true })
}

function copyDir(sourceDir: string, targetDir: string): void {
    if (!fs.existsSync(sourceDir)) return
    ensureDir(targetDir)

    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const sourcePath = path.join(sourceDir, entry.name)
        const targetPath = path.join(targetDir, entry.name)

        if (entry.isDirectory()) {
            copyDir(sourcePath, targetPath)
        } else if (entry.isFile()) {
            ensureDir(path.dirname(targetPath))
            fs.copyFileSync(sourcePath, targetPath)
        }
    }
}

function removeFile(targetPath: string): void {
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { force: true })
    }
}

export function imagesWatcher(): Plugin {
    let watcher: ReturnType<typeof chokidar.watch> | null = null
    let imagesDir = ''
    let outputDir = ''

    const syncAll = () => {
        if (!fs.existsSync(imagesDir)) return
        fs.rmSync(outputDir, { recursive: true, force: true })
        copyDir(imagesDir, outputDir)
        if (DEBUG) {
            console.log(`[ImagesWatcher] Synced images to ${outputDir}`)
        }
    }

    const copySingle = (filePath: string) => {
        const relativePath = path.relative(imagesDir, filePath)
        const targetPath = path.join(outputDir, relativePath)
        ensureDir(path.dirname(targetPath))
        fs.copyFileSync(filePath, targetPath)
    }

    const removeSingle = (filePath: string) => {
        const relativePath = path.relative(imagesDir, filePath)
        const targetPath = path.join(outputDir, relativePath)
        removeFile(targetPath)
    }

    return {
        name: 'images-watcher',
        apply: 'serve',

        configResolved(config) {
            imagesDir = path.resolve(config.root, '../images')
            outputDir = path.resolve(config.root, 'public/images')
        },

        configureServer() {
            syncAll()

            watcher = chokidar.watch(imagesDir, {
                ignored: /(^|[/\\])\../,
                ignoreInitial: true,
                persistent: true,
                ignorePermissionErrors: true,
            })

            watcher.on('add', copySingle)
            watcher.on('change', copySingle)
            watcher.on('unlink', removeSingle)
        },

        buildEnd() {
            if (watcher) {
                watcher.close()
                watcher = null
            }
        },
    }
}
