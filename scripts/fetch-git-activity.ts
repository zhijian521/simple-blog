#!/usr/bin/env node

/**
 * 获取 Git 提交活动数据并生成 JSON 文件
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Commit, GitActivityData } from './shared/types.js'
import { ensureDir } from './shared/fs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CONFIG = {
    daysToFetch: 30,
    outputFile: 'git-activity.json',
    publicDir: path.resolve(__dirname, '../public'),
} as const

/**
 * 执行 git 命令并返回结果
 */
function exec(command: string): string {
    try {
        return execSync(command, { encoding: 'utf-8' }).trim()
    } catch (error) {
        console.error(`执行命令失败: ${command}`)
        throw error
    }
}

/**
 * 获取最近 N 天的提交日期列表
 */
function fetchCommitDates(): string[] {
    const stdout = exec(
        `git log --since="${CONFIG.daysToFetch} days ago" --pretty=format:"%ad" --date=short`
    )
    return stdout ? stdout.split('\n').filter(Boolean) : []
}

/**
 * 统计每日提交数量
 */
function countCommitsByDate(dates: string[]): Commit[] {
    const commitMap = new Map<string, number>()

    for (const date of dates) {
        commitMap.set(date, (commitMap.get(date) || 0) + 1)
    }

    return Array.from(commitMap.entries()).map(([date, count]) => ({ date, count }))
}

/**
 * 保存数据到 JSON 文件
 */
function saveJson(data: GitActivityData): string {
    ensureDir(CONFIG.publicDir)
    const outputPath = path.join(CONFIG.publicDir, CONFIG.outputFile)
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')
    return outputPath
}

function main() {
    console.log('📊 获取 Git 提交活动...')

    // 在 CI 环境中（如 Vercel），先拉取完整的 Git 历史
    // 因为 CI 通常使用浅克隆（shallow clone），导致 git log 只能看到最近的提交
    if (process.env.CI || process.env.VERCEL) {
        console.log('📥 检测到 CI 环境，拉取完整 Git 历史...')
        try {
            exec('git fetch --unshallow')
            console.log('✓ Git 历史拉取完成')
        } catch (error) {
            // 如果已经是完整克隆，会报错，可以忽略
            console.log('ℹ 已经是完整克隆，跳过')
        }
    }

    const commitDates = fetchCommitDates()
    console.log(`✓ ${commitDates.length} 次提交`)

    const commits = countCommitsByDate(commitDates)

    const data: GitActivityData = {
        updated: new Date().toISOString(),
        total: commitDates.length,
        commits,
    }

    const outputPath = saveJson(data)

    console.log(`✓ ${outputPath}`)
    console.log(`✓ ${commits.length} 个有提交的日期`)
}

main()
