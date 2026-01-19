<template>
    <div class="tree-node">
        <div
            class="tree-node-content"
            :class="{ 'is-directory': node.type === 'directory', 'is-file': node.type === 'file' }"
            :style="{ paddingLeft: `${level * 1.5 + 0.75}rem` }"
            @click="handleClick"
        >
            <component
                :is="
                    node.type === 'directory'
                        ? isExpanded
                            ? FolderOpenIcon
                            : FolderClosedIcon
                        : DocumentIcon
                "
                class="tree-node-icon"
            />
            <span class="tree-node-label">{{ node.name }}</span>
            <span v-if="node.type === 'file' && articleDate" class="tree-node-date">{{
                articleDate
            }}</span>
        </div>

        <transition
            name="expand"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
        >
            <div v-show="node.type === 'directory' && isExpanded" class="tree-node-children">
                <div class="tree-node-children-inner">
                    <TreeNode
                        v-for="child in sortedChildren"
                        :key="child.path"
                        :node="child"
                        :level="level + 1"
                        :articles="articles"
                        @article-click="$emit('article-click', $event)"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TreeNode } from '@/utils/build-article-tree'
import type { Article } from '@/types/article'
import { sortTreeNodes } from '@/utils/tree-sort'
import FolderClosedIcon from '@/components/icons/FolderClosedIcon.vue'
import FolderOpenIcon from '@/components/icons/FolderOpenIcon.vue'
import DocumentIcon from '@/components/icons/DocumentIcon.vue'

interface Props {
    node: TreeNode
    level: number
    articles: Article[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'article-click', articleId: string): void
}>()

const isExpanded = ref(props.level === 0)

// 平滑展开/折叠动画
const beforeEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0'
    element.style.opacity = '0'
}

const enter = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    const height = element.scrollHeight
    requestAnimationFrame(() => {
        element.style.height = height + 'px'
        element.style.opacity = '1'
        setTimeout(() => {
            element.style.height = 'auto'
            done()
        }, 300)
    })
}

const afterEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = 'auto'
}

const beforeLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = element.scrollHeight + 'px'
}

const leave = (el: Element, done: () => void) => {
    const element = el as HTMLElement
    requestAnimationFrame(() => {
        element.style.height = '0'
        element.style.opacity = '0'
        setTimeout(done, 300)
    })
}

const sortedChildren = computed(() => {
    if (!props.node.children) return []
    return sortTreeNodes(props.node.children)
})

const articleDate = computed(() => {
    if (props.node.type !== 'file' || !props.node.id) return null

    const article = props.articles.find(a => a.id === props.node.id)
    if (!article) return null

    // 格式化日期为简短格式
    const date = new Date(article.date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})

const handleClick = () => {
    if (props.node.type === 'directory') {
        isExpanded.value = !isExpanded.value
    } else if (props.node.type === 'file' && props.node.id) {
        emit('article-click', props.node.id)
    }
}
</script>

<style scoped>
.tree-node {
    user-select: none;
}

.tree-node-content {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    gap: 0.5rem;
}

.tree-node-content:hover {
    background: rgba(0, 0, 0, 0.04);
}

.tree-node-content.isDirectory {
    font-weight: 500;
}

.tree-node-content.isFile {
    font-weight: 400;
    color: var(--color-text-light);
}

.tree-node-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    stroke: var(--color-text-light);
    stroke-width: 1.5;
    transition: transform 0.2s ease;
}

.tree-node-content.isDirectory:hover .tree-node-icon {
    stroke: var(--color-text);
}

.tree-node-label {
    flex: 1;
    font-size: var(--font-size-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tree-node-date {
    font-size: 11px;
    color: var(--color-text-lighter);
    margin-left: 0.5rem;
    opacity: 0.75;
}

.tree-node-children {
    overflow: hidden;
    transition:
        height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tree-node-children-inner {
    overflow: hidden;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .tree-node-content {
        padding: 0.625rem 0.625rem;
    }

    .tree-node-label {
        font-size: 0.85rem;
    }

    .tree-node-date {
        font-size: 10px;
    }

    .tree-node-icon {
        width: 0.875rem;
        height: 0.875rem;
    }
}

@media (max-width: 480px) {
    .tree-node-content {
        padding: 0.5rem 0.5rem;
    }

    .tree-node-label {
        font-size: 0.8rem;
    }

    .tree-node-date {
        font-size: 9px;
    }

    .tree-node-icon {
        width: 0.8125rem;
        height: 0.8125rem;
    }
}
</style>
