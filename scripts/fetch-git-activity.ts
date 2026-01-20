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
 * 获取 GitHub 仓库信息
 */
function getGitHubRepoInfo(): { owner: string; repo: string } | null {
    try {
        const remoteUrl = exec('git config --get remote.origin.url')
        // 支持 HTTPS 和 SSH 格式
        // HTTPS: https://github.com/owner/repo.git
        // SSH: git@github.com:owner/repo.git
        const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(\.git)?$/)
        if (match) {
            return { owner: match[1], repo: match[2] }
        }
    } catch (error) {
        // ignore
    }
    return null
}

/**
 * 使用 GitHub API 获取提交日期列表（用于 CI 环境）
 */
async function fetchCommitDatesFromGitHubAPI(): Promise<string[]> {
    const repoInfo = getGitHubRepoInfo()
    if (!repoInfo) {
        throw new Error('无法获取 GitHub 仓库信息')
    }

    const { owner, repo } = repoInfo
    const since = new Date(Date.now() - CONFIG.daysToFetch * 24 * 60 * 60 * 1000).toISOString()

    console.log(`📡 使用 GitHub API 获取 ${owner}/${repo} 的提交历史...`)

    const dates: string[] = []
    let page = 1
    const perPage = 100

    while (true) {
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&per_page=${perPage}&page=${page}`

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'fetch-git-activity',
            },
        })

        if (!response.ok) {
            throw new Error(`GitHub API 请求失败: ${response.status}`)
        }

        const commits = await response.json()

        if (!Array.isArray(commits) || commits.length === 0) {
            break
        }

        for (const commit of commits) {
            if (commit.commit?.committer?.date) {
                const date = new Date(commit.commit.committer.date)
                dates.push(date.toISOString().split('T')[0])
            }
        }

        console.log(`  已获取 ${dates.length} 条提交记录`)

        if (commits.length < perPage) {
            break
        }

        page++
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    return dates
}

/**
 * 获取最近 N 天的提交日期列表（使用本地 git log）
 */
function fetchCommitDatesFromLocal(): string[] {
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

async function main() {
    console.log('📊 获取 Git 提交活动...')

    let commitDates: string[]

    // 在 CI 环境中（如 Vercel），使用 GitHub API 获取提交历史
    // 因为 CI 通常使用浅克隆（shallow clone），导致 git log 只能看到最近的提交
    if (process.env.CI || process.env.VERCEL) {
        console.log('🔍 检测到 CI 环境，使用 GitHub API 获取提交历史...')
        try {
            commitDates = await fetchCommitDatesFromGitHubAPI()
        } catch (error) {
            console.error('❌ GitHub API 获取失败，尝试使用本地 git log...')
            console.error(error)
            commitDates = fetchCommitDatesFromLocal()
        }
    } else {
        commitDates = fetchCommitDatesFromLocal()
    }

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
