<template>
    <BaseModal :visible="visible" title="文章目录" @close="handleClose">
        <template #default>
            <div v-if="headings.length === 0" class="empty-state">
                <p>暂未找到标题</p>
            </div>
            <div v-else class="toc-list">
                <div
                    v-for="heading in headings"
                    :key="heading.id"
                    :class="['toc-item', `toc-level-${heading.level}`]"
                    @click="scrollToHeading(heading.id)"
                >
                    {{ heading.text }}
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import BaseModal from './BaseModal.vue'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'

interface Props {
    visible: boolean
    content?: string
}

interface Heading {
    id: string
    text: string
    level: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const headings = ref<Heading[]>([])

// 从 HTML 内容中提取标题
const extractHeadings = () => {
    if (!props.content) {
        headings.value = []
        return
    }

    // 创建临时 DOM 解析 HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = props.content

    const foundHeadings: Heading[] = []
    const headingElements = tempDiv.querySelectorAll('h2, h3, h4')

    headingElements.forEach((el, index) => {
        const level = parseInt(el.tagName.charAt(1))
        const text = el.textContent?.trim() || ''

        // 生成唯一 ID
        const id = `heading-${index}`
        el.id = id

        foundHeadings.push({
            id,
            text,
            level,
        })
    })

    headings.value = foundHeadings

    // 更新实际的 DOM 中的标题 ID
    nextTick(() => {
        const articleBody = document.querySelector('.article-body')
        if (articleBody) {
            const actualHeadings = articleBody.querySelectorAll('h2, h3, h4')
            actualHeadings.forEach((el, idx) => {
                if (foundHeadings[idx]) {
                    el.id = foundHeadings[idx].id
                }
            })
        }
    })
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        handleClose()
    }
}

// 关闭弹窗
const handleClose = () => {
    emit('close')
}

// ESC 键关闭弹窗（只在弹窗可见时生效）
useKeyboardShortcut('Escape', handleClose, {
    condition: () => props.visible,
})

// 监听弹窗可见性和内容变化
watch(
    () => [props.visible, props.content],
    ([visible]) => {
        // 只在客户端环境执行
        if (import.meta.env.SSR) return

        if (visible) {
            extractHeadings()
        }
    },
    { immediate: true }
)
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

.toc-list {
    display: flex;
    flex-direction: column;
}

.toc-item {
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-text);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}

.toc-item:hover {
    background: rgba(0, 0, 0, 0.04);
}

.toc-level-2 {
    padding-left: 0.75rem;
}

.toc-level-3 {
    padding-left: 2rem;
    font-size: var(--font-size-sm);
}

.toc-level-4 {
    padding-left: 3rem;
    font-size: var(--font-size-sm);
    color: var(--color-text-light);
}

@media (max-width: 768px) {
    .toc-item {
        padding: 0.625rem;
        font-size: 0.9rem;
    }

    .toc-level-2 {
        padding-left: 0.625rem;
    }

    .toc-level-3 {
        padding-left: 1.75rem;
        font-size: 0.8rem;
    }

    .toc-level-4 {
        padding-left: 2.75rem;
        font-size: 0.75rem;
        color: var(--color-text-light);
    }
}

@media (max-width: 480px) {
    .toc-item {
        padding: 0.5rem;
        font-size: 0.85rem;
    }

    .toc-level-2 {
        padding-left: 0.5rem;
    }

    .toc-level-3 {
        padding-left: 1.5rem;
        font-size: 0.75rem;
    }

    .toc-level-4 {
        padding-left: 2.5rem;
        font-size: 0.7rem;
        color: var(--color-text-light);
    }
}
</style>
