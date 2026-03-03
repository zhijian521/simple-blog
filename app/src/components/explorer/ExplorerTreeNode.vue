<template>
    <div class="explorer-node">
        <button
            class="node-row"
            :class="{
                'is-directory': node.type === 'directory',
                'is-file': node.type === 'file',
                'is-active': isActive,
            }"
            :style="{ paddingLeft: `${levelIndent}px` }"
            :aria-label="nodeLabel"
            @click="handleClick"
        >
            <span class="disclosure-slot">
                <component
                    :is="isExpanded ? ChevronDownIcon : ChevronRightIcon"
                    v-if="node.type === 'directory'"
                    class="disclosure-icon"
                />
            </span>
            <component
                :is="
                    node.type === 'directory'
                        ? isExpanded
                            ? ExplorerFolderOpenIcon
                            : ExplorerFolderClosedIcon
                        : ExplorerDocumentIcon
                "
                class="node-type-icon"
            />
            <span class="node-name">{{ node.name }}</span>
        </button>

        <div v-if="node.type === 'directory' && isExpanded" class="node-children">
            <ExplorerTreeNode
                v-for="child in node.children || []"
                :key="child.path"
                :node="child"
                :level="level + 1"
                :expanded-paths="expandedPaths"
                :active-article-id="activeArticleId"
                @toggle-directory="$emit('toggle-directory', $event)"
                @select-article="$emit('select-article', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'
import ExplorerDocumentIcon from '@/components/icons/ExplorerDocumentIcon.vue'
import ExplorerFolderClosedIcon from '@/components/icons/ExplorerFolderClosedIcon.vue'
import ExplorerFolderOpenIcon from '@/components/icons/ExplorerFolderOpenIcon.vue'
import type { ExplorerNode } from '@/types/explorer'

defineOptions({
    name: 'ExplorerTreeNode',
})

interface Props {
    node: ExplorerNode
    level: number
    expandedPaths: Set<string>
    activeArticleId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'toggle-directory', path: string): void
    (e: 'select-article', id: string): void
}>()

const BASE_PADDING = 12
const INDENT_STEP = 18

const isExpanded = computed(() => {
    if (props.node.type !== 'directory') {
        return false
    }
    return props.expandedPaths.has(props.node.path)
})

const isActive = computed(() => {
    return props.node.type === 'file' && props.node.articleId === props.activeArticleId
})

const levelIndent = computed(() => {
    return BASE_PADDING + props.level * INDENT_STEP
})

const nodeLabel = computed(() => {
    if (props.node.type === 'directory') {
        return isExpanded.value ? `折叠文件夹 ${props.node.name}` : `展开文件夹 ${props.node.name}`
    }
    return `打开文章 ${props.node.name}`
})

const handleClick = () => {
    if (props.node.type === 'directory') {
        emit('toggle-directory', props.node.path)
        return
    }
    if (props.node.articleId) {
        emit('select-article', props.node.articleId)
    }
}
</script>

<style scoped>
.explorer-node {
    width: 100%;
}

.node-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    min-height: 32px;
    border-radius: 6px;
    color: var(--color-text-light);
    cursor: pointer;
    transition:
        background 0.18s ease,
        color 0.18s ease;
    text-align: left;
}

.node-row:hover {
    background: rgba(0, 0, 0, 0.04);
    color: var(--color-text);
}

.node-row.is-active {
    background: rgba(0, 0, 0, 0.08);
    color: var(--color-text);
}

.disclosure-slot {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.disclosure-icon {
    width: 14px;
    height: 14px;
    color: var(--color-text-lighter);
}

.node-type-icon {
    width: 16px;
    height: 16px;
    color: var(--color-text-light);
    flex-shrink: 0;
}

.node-row.is-directory .node-type-icon {
    color: var(--color-accent);
}

.node-row.is-file .node-type-icon {
    color: var(--color-text-light);
}

.node-name {
    flex: 1;
    font-size: 13px;
    line-height: 1.45;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.node-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
