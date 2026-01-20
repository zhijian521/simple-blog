<template>
    <div class="giscus-comments">
        <div ref="containerRef"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'

interface Props {
    /** GitHub 仓库，格式：owner/repo */
    repo: string

    /** GitHub Discussions 的 repository ID（从 giscus.app 获取） */
    repoId: string

    /** GitHub Discussions 的 category ID（从 giscus.app 获取） */
    categoryId: string

    /** 映射关系：pathname | url | title | og:title | specific | number | term */
    mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number' | 'term'

    /**
     * Giscus 主题
     * @see https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#theme
     */
    theme?:
        | 'light'
        | 'light_high_contrast'
        | 'light_tritanopia'
        | 'dark'
        | 'dark_high_contrast'
        | 'dark_dimmed'
        | 'dark_tritanopia'
        | 'transparent_high_contrast'
        | 'preferred_color_scheme'
        | 'noborder_light'
        | 'noborder_dark'
        | 'noborder_dimmed'
        | 'cobalt'
        | 'fro'

    /** 评论框位置：top | bottom */
    inputPosition?: 'top' | 'bottom'

    /** 是否懒加载 */
    lazyLoad?: boolean

    /** 自定义 term（当 mapping 为 'term' 或 'specific' 时使用） */
    term?: string
}

const props = withDefaults(defineProps<Props>(), {
    term: '',
    mapping: 'pathname',
    theme: 'light',
    inputPosition: 'bottom',
    lazyLoad: false,
})

const containerRef = ref<HTMLElement | null>(null)
let giscusScript: HTMLScriptElement | null = null

/**
 * 加载 Giscus 脚本
 */
function loadGiscus() {
    if (!containerRef.value) return

    // 清理旧脚本
    if (giscusScript && giscusScript.parentNode) {
        giscusScript.parentNode.removeChild(giscusScript)
        giscusScript = null
    }

    // 清空容器
    containerRef.value.innerHTML = ''

    // 创建 script 标签
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    // 设置配置
    const attributes: Record<string, string> = {
        'data-repo': props.repo,
        'data-repo-id': props.repoId,
        'data-category-id': props.categoryId,
        'data-mapping': props.mapping,
        'data-theme': props.theme,
        'data-input-position': props.inputPosition,
        'data-lang': 'zh-CN',
    }

    // 根据 mapping 设置不同的标识
    if ((props.mapping === 'specific' || props.mapping === 'term') && props.term) {
        attributes['data-term'] = props.term
    }

    if (props.lazyLoad) {
        attributes['data-loading'] = 'lazy'
    }

    // 设置属性
    Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value)
    })

    containerRef.value.appendChild(script)
    giscusScript = script
}

/**
 * 更新 Giscus 主题
 */
function updateTheme(newTheme: string) {
    if (!containerRef.value) return

    const iframe = containerRef.value.querySelector('iframe')
    if (iframe) {
        const message = {
            giscus: {
                setConfig: {
                    theme: newTheme,
                },
            },
        }
        iframe.contentWindow?.postMessage(message, 'https://giscus.app')
    }
}

onMounted(() => {
    loadGiscus()
})

onUnmounted(() => {
    if (giscusScript && giscusScript.parentNode) {
        giscusScript.parentNode.removeChild(giscusScript)
        giscusScript = null
    }
})

// 监听主题变化
watch(
    () => props.theme,
    newTheme => {
        updateTheme(newTheme)
    }
)

// 监听 repo/repoId/categoryId/mapping 变化，重新加载脚本
watch([() => props.repo, () => props.repoId, () => props.categoryId, () => props.mapping], () => {
    loadGiscus()
})

// 暴露方法供外部调用
defineExpose({
    reload: loadGiscus,
    updateTheme,
})
</script>

<style scoped>
/* Giscus 容器基础样式 */
.giscus-comments {
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
}

/* Giscus iframe 样式 */
.giscus-comments :deep(iframe) {
    border: none;
    width: 100%;
}
</style>
