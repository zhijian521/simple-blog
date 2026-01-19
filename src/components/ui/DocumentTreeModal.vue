<template>
    <div v-show="visible" class="document-tree-modal" @click.self="handleClose">
        <div class="modal-wrapper">
            <div class="modal-background-layer"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">文章目录</h2>
                    <button aria-label="关闭" class="modal-close" @click="handleClose">
                        <CloseIcon class="close-icon" />
                    </button>
                </div>

                <div class="modal-content">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TreeNode from './TreeNode.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
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
                const article = articles.find(a => a.slug === relativePath)
                currentLevel.push({
                    name: part,
                    path: relativePath,
                    type: 'file',
                    id: article?.id,
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

// ESC 键关闭
const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        handleClose()
    }
}

// 监听弹窗可见性
watch(
    () => props.visible,
    isVisible => {
        if (isVisible) {
            document.addEventListener('keydown', handleEsc)
        } else {
            document.removeEventListener('keydown', handleEsc)
        }
    }
)

// 组件卸载时清理
onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.document-tree-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 1rem;
    background: transparent;
}

.modal-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 600px;
    pointer-events: auto;
}

.modal-background-layer {
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -1px 0 rgba(0, 0, 0, 0.02);
    pointer-events: none;
}

.modal-background-layer::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.5) 100%
    );
    pointer-events: none;
}

.modal-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 1;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
}

.modal-title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    letter-spacing: 0.05em;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.625rem;
    height: 1.625rem;
    padding: 0;
    border: none;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0.625rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
}

.modal-close:active {
    transform: scale(0.95);
}

.close-icon {
    width: 0.875rem;
    height: 0.875rem;
    stroke: var(--color-text-light);
    stroke-width: 2;
}

.modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.5rem;
    overflow-x: hidden;
}

.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.15);
}

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

@media (max-width: 768px) {
    .document-tree-modal {
        padding: 1rem;
    }

    .modal-wrapper {
        max-width: 500px;
        width: calc(100% - 2rem);
        height: 500px;
    }

    .modal-background-layer {
        border-radius: 1.25rem;
    }

    .modal-background-layer::before {
        border-radius: 1.25rem;
    }

    .modal-container {
        border-radius: 1.25rem;
    }

    .modal-header {
        padding: 0.875rem 0.875rem;
    }

    .modal-title {
        font-size: 0.95rem;
    }

    .modal-close {
        width: 1.5rem;
        height: 1.5rem;
    }

    .modal-content {
        padding: 0.75rem 1rem;
    }
}

@media (max-width: 480px) {
    .document-tree-modal {
        padding: 0.75rem;
    }

    .modal-wrapper {
        max-width: 400px;
        width: calc(100% - 1.5rem);
        height: 450px;
    }

    .modal-background-layer {
        border-radius: 1rem;
    }

    .modal-background-layer::before {
        border-radius: 1rem;
    }

    .modal-container {
        border-radius: 1rem;
    }

    .modal-header {
        padding: 0.75rem 0.75rem;
    }

    .modal-title {
        font-size: 0.85rem;
    }

    .modal-close {
        width: 1.375rem;
        height: 1.375rem;
    }

    .modal-content {
        padding: 0.625rem 0.875rem;
    }
}
</style>
