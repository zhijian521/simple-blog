<template>
    <div v-show="visible" class="toc-modal" @click.self="handleClose">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

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

// ESC 键关闭
const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        handleClose()
    }
}

// 监听弹窗可见性和内容变化
watch(
    () => [props.visible, props.content],
    ([visible]) => {
        // 只在客户端环境执行
        if (import.meta.env.SSR) return

        if (visible) {
            document.addEventListener('keydown', handleEsc)
            extractHeadings()
        } else {
            document.removeEventListener('keydown', handleEsc)
        }
    },
    { immediate: true }
)

// 组件卸载时清理
onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.toc-modal {
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
    .toc-modal {
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
    .toc-modal {
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

    .close-icon {
        width: 0.75rem;
        height: 0.75rem;
    }

    .modal-content {
        padding: 0.625rem 0.875rem;
    }

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
