<!--
  GitActivityChart - Git 提交活动热力图组件

  展示最近 30 天的项目提交活动，以单行热力图形式可视化每日提交频率。
  读取预生成的 Git 提交数据 JSON 文件，根据提交数量显示不同黑灰色深浅。

  数据来源：
  - 由 scripts/fetch-git-activity.cjs 脚本生成
  - 在 dev/build 时自动执行
  - 存储在 public/git-activity.json

  颜色等级定义在组件 style 部分（level-0 到 level-4）
-->
<template>
    <div
        ref="containerRef"
        class="git-activity-chart"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
        <div v-if="loading" class="activity-loading"></div>
        <div v-else-if="days.length" class="activity-grid">
            <div
                v-for="day in days"
                :key="day.date"
                class="activity-day"
                :class="`level-${day.level}`"
                :data-date="day.date"
                @mouseenter="handleMouseEnter($event, day)"
            ></div>
        </div>
        <div
            v-if="tooltip.visible"
            class="activity-tooltip"
            :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        >
            <div class="activity-tooltip-content">
                <div class="activity-tooltip-count">
                    <template v-if="tooltip.count === 0">
                        <span>没有提交</span>
                    </template>
                    <template v-else>
                        <strong>{{ tooltip.count }}</strong> 个提交
                    </template>
                </div>
                <div class="activity-tooltip-date">{{ formattedDate }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { DayCommit } from '@/types/git-activity'

const TOOLTIP_OFFSET = 60 // Tooltip 偏移量（px）

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
]

const containerRef = ref<HTMLElement | null>(null)
const days = ref<DayCommit[]>([])
const loading = ref(true)

const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    count: 0,
    date: '',
})

/**
 * 格式化日期显示
 */
const formattedDate = computed(() => {
    if (!tooltip.value.date) return ''

    const date = new Date(tooltip.value.date)
    const weekday = weekdays[date.getDay()]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${weekday}, ${year}年${month}${day}日`
})

/**
 * 从 JSON 文件加载提交数据
 */
const loadGitActivityData = async () => {
    loading.value = true

    try {
        const response = await fetch('/git-activity.json')
        if (!response.ok) {
            throw new Error('Failed to load git activity data')
        }

        const data = await response.json()
        days.value = data.days || []
    } catch (error) {
        console.error('Failed to load git activity data:', error)
        days.value = []
    } finally {
        loading.value = false
    }
}

/**
 * 处理鼠标进入格子
 */
const handleMouseEnter = (event: MouseEvent, day: DayCommit) => {
    if (!day.date || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top - TOOLTIP_OFFSET

    tooltip.value = {
        visible: true,
        x,
        y,
        count: day.count,
        date: day.date,
    }
}

/**
 * 处理鼠标离开容器
 */
const handleMouseLeave = () => {
    tooltip.value.visible = false
}

/**
 * 处理鼠标移动（更新 tooltip 位置）
 */
const handleMouseMove = (event: MouseEvent) => {
    if (!tooltip.value.visible || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top - TOOLTIP_OFFSET

    tooltip.value.x = x
    tooltip.value.y = y
}

onMounted(() => {
    loadGitActivityData()
})
</script>

<style scoped>
.git-activity-chart {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    background: transparent;
}

.activity-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 12px;
}

.activity-grid {
    display: flex;
    gap: 3px;
    justify-content: center;
    flex-wrap: wrap;
}

.activity-day {
    width: 11px;
    height: 11px;
    border-radius: 2px;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.activity-day:hover {
    opacity: 0.8;
    transform: scale(1.2);
}

/* 黑白灰颜色等级 */
.level-0 {
    background: rgba(0, 0, 0, 0.03);
}

.level-1 {
    background: rgba(0, 0, 0, 0.12);
}

.level-2 {
    background: rgba(0, 0, 0, 0.25);
}

.level-3 {
    background: rgba(0, 0, 0, 0.4);
}

.level-4 {
    background: rgba(0, 0, 0, 0.6);
}

/* Tooltip */
.activity-tooltip {
    position: absolute;
    pointer-events: none;
    z-index: 1000;
    transform: translateX(-50%);
    animation: tooltipFadeIn 0.15s ease-out;
}

@keyframes tooltipFadeIn {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.activity-tooltip-content {
    background: var(--color-text);
    color: var(--color-bg);
    padding: 6px 10px;
    border-radius: 4px;
    font-size: var(--font-size-xs);
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    position: relative;
    line-height: 1.4;
}

.activity-tooltip-content::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid var(--color-text);
}

.activity-tooltip-count {
    font-weight: 400;
    margin-bottom: 3px;
    display: block;
}

.activity-tooltip-count strong {
    font-weight: 500;
    font-size: 0.875rem;
}

.activity-tooltip-date {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.7rem;
    display: block;
}

/* 中小屏响应式（768px 以下） */
@media (max-width: 768px) {
    .git-activity-chart {
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .activity-day {
        width: 9px;
        height: 9px;
    }

    .activity-grid {
        gap: 2px;
    }
}

/* 小屏响应式（640px 以下） */
@media (max-width: 640px) {
    .activity-grid {
        gap: 1.5px;
    }
}
</style>
