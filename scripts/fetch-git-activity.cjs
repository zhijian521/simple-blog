#!/usr/bin/env node

/**
 * Git 提交活动数据获取脚本
 *
 * 功能：
 * - 获取最近 30 天的 Git 提交记录
 * - 统计每日提交数量并计算级别
 * - 将数据保存为 JSON 文件到 public 目录
 *
 * 使用：
 * - npm run fetch-git
 * - 在 dev/build 命令前自动执行
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const DAYS_TO_FETCH = 30

/**
 * 执行命令并返回结果
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim()
  } catch (error) {
    console.error(`执行命令失败: ${command}`)
    console.error(error.message)
    return ''
  }
}

/**
 * 获取最近指定天数的提交日期列表
 */
function fetchCommitDates() {
  const stdout = exec(
    `git log --since="${DAYS_TO_FETCH} days ago" --pretty=format:"%ad" --date=short`
  )
  return stdout ? stdout.split('\n').filter(Boolean) : []
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 主函数
 */
function main() {
  console.log('📊 开始获取 Git 提交活动数据...')

  try {
    const commitDates = fetchCommitDates()
    console.log(`✓ 找到 ${commitDates.length} 次提交`)

    const commitMap = new Map()
    commitDates.forEach(date => {
      commitMap.set(date, (commitMap.get(date) || 0) + 1)
    })

    const commits = Array.from(commitMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))

    const data = {
      updated: new Date().toISOString(),
      total: commitDates.length,
      commits,
    }

    const publicDir = path.resolve(process.cwd(), 'public')
    const outputPath = path.join(publicDir, 'git-activity.json')

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`✓ 数据已保存到: ${outputPath}`)
    console.log(`✓ 共 ${commits.length} 个有提交的日期`)
    console.log('✓ 完成！')
  } catch (error) {
    console.error('❌ 获取数据失败:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
