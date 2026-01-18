/**
 * 确保 Markdown 文章都有 ID 字段
 *
 * 功能：
 * - 扫描所有 Markdown 文件
 * - 检查 front-matter 是否有 id 字段
 * - 如果没有，生成 8 位随机小写字母或数字的 id
 * - 将 id 写回文件
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'front-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 字符集：小写字母和数字
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const ID_LENGTH = 8

/**
 * 生成随机 8 位 ID（小写字母和数字）
 */
function generateId() {
  let id = ''
  for (let i = 0; i < ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length)
    id += CHARACTERS[randomIndex]
  }
  return id
}

/**
 * 递归扫描目录，获取所有 .md 文件
 */
function getMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getMarkdownFiles(filePath, fileList)
    } else if (path.extname(file) === '.md') {
      fileList.push(filePath)
    }
  })

  return fileList
}

/**
 * 确保文章有 ID
 */
function ensureArticleIds() {
  const blogsDir = path.join(__dirname, '../blogs')
  const markdownFiles = getMarkdownFiles(blogsDir)

  console.log(`扫描到 ${markdownFiles.length} 个 Markdown 文件`)

  let updatedCount = 0

  markdownFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { attributes, body } = matter(content)

    // 检查是否已有 id
    if (attributes.id) {
      console.log(`✓ ${path.relative(blogsDir, filePath)}: 已有 ID ${attributes.id}`)
      return
    }

    // 生成新 ID
    const newId = generateId()

    // 构建新的 front-matter
    const newAttributes = { ...attributes, id: newId }
    const newFrontMatter = Object.keys(newAttributes)
      .map(key => {
        const value = newAttributes[key]
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

    console.log(`✓ ${path.relative(blogsDir, filePath)}: 添加 ID ${newId}`)
    updatedCount++
  })

  console.log(`\n完成！共更新 ${updatedCount} 个文件`)
}

// 运行脚本
ensureArticleIds()
