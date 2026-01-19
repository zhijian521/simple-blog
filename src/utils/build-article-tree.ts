import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

export interface TreeNode {
    name: string
    path: string
    type: 'file' | 'directory'
    children?: TreeNode[]
    id?: string
}

export function buildArticleTree(dir: string): TreeNode[] {
    const buildTree = (currentPath: string, relativePath: string): TreeNode[] => {
        const nodes: TreeNode[] = []

        try {
            const files = readdirSync(currentPath, { withFileTypes: true })

            // 先处理目录，再处理文件
            const directories = files.filter(f => f.isDirectory())
            const markdownFiles = files.filter(f => f.isFile() && f.name.endsWith('.md'))

            // 添加目录节点
            for (const dirEnt of directories) {
                const fullPath = resolve(currentPath, dirEnt.name)
                const newRelativePath = relativePath
                    ? `${relativePath}/${dirEnt.name}`
                    : dirEnt.name

                nodes.push({
                    name: dirEnt.name,
                    path: newRelativePath,
                    type: 'directory',
                    children: buildTree(fullPath, newRelativePath),
                })
            }

            // 添加文件节点
            for (const fileEnt of markdownFiles) {
                const fullPath = resolve(currentPath, fileEnt.name)
                const content = readFileSync(fullPath, 'utf-8')
                const idMatch = content.match(/^id:\s*(.+)$/m)
                const id = idMatch ? idMatch[1].trim() : undefined

                const newRelativePath = relativePath
                    ? `${relativePath}/${fileEnt.name}`
                    : fileEnt.name

                nodes.push({
                    name: fileEnt.name.replace('.md', ''),
                    path: newRelativePath,
                    type: 'file',
                    id,
                })
            }
        } catch (error) {
            console.error(`Failed to build tree for ${currentPath}:`, error)
        }

        return nodes
    }

    return buildTree(dir, '')
}
