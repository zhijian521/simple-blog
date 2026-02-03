<template>
    <BaseModal :visible="visible" title="文章目录" @close="handleClose">
        <template #default>
            <div v-if="treeNodes.length === 0" class="empty-state">
                <p>暂无文章</p>
            </div>
            <div v-else class="tree-container">
                <TreeNode
                    v-for="node in sortedTreeNodes"
                    :key="node.path"
                    :node="node"
                    :level="0"
                    :articles="articles"
                    @article-click="handleArticleClick"
                />
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TreeNode from './TreeNode.vue'
import BaseModal from './BaseModal.vue'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'
import { getArticles } from '@/utils/markdown'
import { sortTreeNodes } from '@/utils/tree-sort'
import type { TreeNode as TreeNodeType } from '@/utils/build-article-tree'
import type { Article } from '@/types/article'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const router = useRouter()
const articles = getArticles() as Article[]
const articleIdBySlug = new Map(articles.map(article => [article.slug, article.id]))

// 常量配置
const BLOG_PATH_PREFIX = '/blogs/'
const BLOG_FILE_SUFFIX = '.md'

// 构建树形结构
const treeNodes = computed(() => {
    // SSR 环境下返回空数组
    if (typeof window === 'undefined') return []

    const blogModules = import.meta.glob('/blogs/**/*.md', { query: '?raw' })
    const treeData: TreeNodeType[] = []

    for (const path in blogModules) {
        const relativePath = path
            .replace(new RegExp(`^${BLOG_PATH_PREFIX}`), '')
            .replace(BLOG_FILE_SUFFIX, '')
        const parts = relativePath.split('/')

        let currentLevel = treeData
        let currentPath = ''

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            currentPath = currentPath ? `${currentPath}/${part}` : part
            const isFile = i === parts.length - 1

            if (isFile) {
                currentLevel.push({
                    name: part,
                    path: relativePath,
                    type: 'file',
                    id: articleIdBySlug.get(relativePath),
                })
            } else {
                let existingNode = currentLevel.find(n => n.name === part && n.type === 'directory')

                if (!existingNode) {
                    const newNode: TreeNodeType = {
                        name: part,
                        path: currentPath,
                        type: 'directory',
                        children: [],
                    }
                    currentLevel.push(newNode)
                    existingNode = newNode
                }

                currentLevel = existingNode.children!
            }
        }
    }

    return treeData
})

// 排序树节点
const sortedTreeNodes = computed(() => sortTreeNodes(treeNodes.value))

// 跳转到文章详情
const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`)
    handleClose()
}

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// ESC 键关闭弹窗（只在弹窗可见时生效）
useKeyboardShortcut('Escape', handleClose, {
    condition: () => props.visible,
})
</script>

<style scoped>
.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: var(--color-text-light);
    font-size: var(--font-size-sm);
}

.tree-container {
    display: flex;
    flex-direction: column;
}
</style>
