import type { ArticleIndexItem } from '@/types/article'
import type { ExplorerNode } from '@/types/explorer'

function getOrCreateDirectory(nodes: ExplorerNode[], name: string, path: string): ExplorerNode {
    const existing = nodes.find(node => node.type === 'directory' && node.name === name)
    if (existing) {
        existing.children ??= []
        return existing
    }

    const directory: ExplorerNode = {
        name,
        path,
        type: 'directory',
        children: [],
    }
    nodes.push(directory)
    return directory
}

export function buildExplorerTree(items: ArticleIndexItem[]): ExplorerNode[] {
    const root: ExplorerNode[] = []

    for (const item of items) {
        const parts = item.slug.split('/').filter(Boolean)
        let currentLevel = root
        let currentPath = ''

        for (let index = 0; index < parts.length; index++) {
            const part = parts[index]
            const isFile = index === parts.length - 1
            currentPath = currentPath ? `${currentPath}/${part}` : part

            if (isFile) {
                currentLevel.push({
                    name: part,
                    path: currentPath,
                    type: 'file',
                    articleId: item.id,
                })
                continue
            }

            const directory = getOrCreateDirectory(currentLevel, part, currentPath)
            currentLevel = directory.children!
        }
    }

    return root
}

export function sortExplorerNodes(nodes: ExplorerNode[]): ExplorerNode[] {
    return [...nodes]
        .sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') return -1
            if (a.type === 'file' && b.type === 'directory') return 1
            return a.name.localeCompare(b.name, 'zh-CN')
        })
        .map(node => {
            if (node.type === 'directory') {
                return {
                    ...node,
                    children: sortExplorerNodes(node.children || []),
                }
            }
            return node
        })
}

export function createInitialExpandedPaths(nodes: ExplorerNode[]): Set<string> {
    const expanded = new Set<string>()
    for (const node of nodes) {
        // 只展开"耶温"文件夹，其他第一级文件夹保持折叠
        if (node.type === 'directory' && node.name === '耶温') {
            expanded.add(node.path)
        }
    }
    return expanded
}

export function expandParentPaths(currentPaths: Set<string>, slug: string): Set<string> {
    const parts = slug.split('/').filter(Boolean)
    const next = new Set(currentPaths)
    let currentPath = ''

    for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i]
        next.add(currentPath)
    }

    return next
}
