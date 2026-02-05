<!--
  ArticleBreadcrumb - 文章面包屑导航组件

  用途：
  - 显示文章的分类路径（如：开发 / AICoding）
  - 显示文章发布时间
  - 用于文章详情页顶部

  Props:
  - category?: string - 文章分类路径（如 "开发/AICoding"）
  - date: string - 文章发布日期
-->
<template>
    <div class="article-breadcrumb">
        <div v-if="categoryPath.length > 0" class="breadcrumb-path">
            <span v-for="(segment, index) in categoryPath" :key="index" class="breadcrumb-item">
                <span class="breadcrumb-segment">{{ segment }}</span>
                <span v-if="index < categoryPath.length - 1" class="breadcrumb-separator">/</span>
            </span>
        </div>
        <time v-if="displayDate" class="article-date">{{ displayDate }}</time>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/date'

interface Props {
    category?: string
    date: string
}

const props = defineProps<Props>()

// 将分类字符串拆分为路径数组
const categoryPath = computed(() => {
    if (!props.category) return []
    return props.category.split('/').filter(Boolean)
})

// 格式化日期显示
const displayDate = computed(() => {
    return formatDate(props.date, 'short')
})
</script>

<style scoped>
.article-breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    flex-wrap: nowrap;
}

.breadcrumb-path {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-shrink: 0;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
}

.breadcrumb-segment {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
}

.breadcrumb-separator {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    margin: 0 var(--spacing-xs);
}

.article-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-lighter);
    font-weight: var(--font-weight-normal);
    white-space: nowrap;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .breadcrumb-segment,
    .breadcrumb-separator,
    .article-date {
        font-size: var(--font-size-xxs);
    }
}

@media (max-width: 480px) {
    .article-breadcrumb {
        gap: var(--spacing-sm);
    }

    .breadcrumb-path {
        gap: 2px;
    }

    .breadcrumb-separator {
        margin: 0 2px;
    }
}
</style>
