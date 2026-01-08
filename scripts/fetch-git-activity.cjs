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

// 配置常量
const DAYS_TO_FETCH = 30
const LEVEL_THRESHOLDS = [0, 2, 4, 6]

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
 * 生成最近指定天数的日期范围
 */
function generateDateRange() {
  const dates = []
  const today = new Date()

  for (let i = DAYS_TO_FETCH - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date)
  }

  return dates
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
 * 计算提交级别（0-4）
 * Level 0: 无提交
 * Level 1: 1-2 次提交
 * Level 2: 3-4 次提交
 * Level 3: 5-6 次提交
 * Level 4: 7+ 次提交
 */
function calculateLevel(count) {
  if (count === 0) return 0
  if (count <= LEVEL_THRESHOLDS[1]) return 1
  if (count <= LEVEL_THRESHOLDS[2]) return 2
  if (count <= LEVEL_THRESHOLDS[3]) return 3
  return 4
}

/**
 * 主函数
 */
function main() {
  console.log('📊 开始获取 Git 提交活动数据...')

  try {
    // 获取提交日期
    const commitDates = fetchCommitDates()
    console.log(`✓ 找到 ${commitDates.length} 次提交`)

    // 生成日期范围
    const dateRange = generateDateRange()

    // 统计每日提交数量
    const commitMap = new Map()
    commitDates.forEach(date => {
      commitMap.set(date, (commitMap.get(date) || 0) + 1)
    })

    // 生成每日提交数据
    const daysData = dateRange.map(date => {
      const dateStr = formatDate(date)
      const count = commitMap.get(dateStr) || 0
      return {
        date: dateStr,
        count,
        level: calculateLevel(count),
      }
    })

    // 计算总提交数
    const totalCommits = commitDates.length

    // 生成最终数据
    const data = {
      updated: new Date().toISOString(),
      total: totalCommits,
      days: daysData,
    }

    // 保存到 public 目录
    const publicDir = path.resolve(process.cwd(), 'public')
    const outputPath = path.join(publicDir, 'git-activity.json')

    // 确保 public 目录存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // 写入文件
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`✓ 数据已保存到: ${outputPath}`)
    console.log(`✓ 最近 30 天共 ${totalCommits} 次提交`)
    console.log('✓ 完成！')
  } catch (error) {
    console.error('❌ 获取数据失败:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
