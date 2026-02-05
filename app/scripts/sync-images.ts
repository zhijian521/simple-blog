#!/usr/bin/env node

/**
 * 同步顶层 images/ 到 app/public/images
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    sourceDir: path.resolve(__dirname, '../../images'),
    targetDir: path.resolve(__dirname, '../public/images'),
} as const

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

function main() {
    if (!fs.existsSync(CONFIG.sourceDir)) {
        console.warn(`Images directory not found: ${CONFIG.sourceDir}`)
        return
    }

    fs.rmSync(CONFIG.targetDir, { recursive: true, force: true })
    copyDir(CONFIG.sourceDir, CONFIG.targetDir)
    console.log(`Synced images -> ${CONFIG.targetDir}`)
}

main()
