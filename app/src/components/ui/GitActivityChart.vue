<template>
    <div
        ref="containerRef"
        class="git-activity-chart"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
        <div v-if="loading" class="activity-loading"></div>
        <div v-else-if="displayDays.length" class="activity-grid">
            <div
                v-for="day in displayDays"
                :key="day.date"
                class="activity-day"
                :class="`level-${calculateLevel(day.count)}`"
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
import { GIT_ACTIVITY } from '@/constants'
import type { DayCommit, GitActivityData } from '@/types/git-activity'

const { weekdays, months, tooltipOffset, daysToShow, levelThresholds } = GIT_ACTIVITY

const containerRef = ref<HTMLElement | null>(null)
const days = ref<DayCommit[]>([])
const displayDays = ref<DayCommit[]>([])
const loading = ref(true)

const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    count: 0,
    date: '',
})

const formattedDate = computed(() => {
    if (!tooltip.value.date) return ''

    const date = new Date(tooltip.value.date)
    return formatChineseDate(date)
})

function formatChineseDate(date: Date): string {
    const weekday = weekdays[date.getDay()]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${weekday}, ${year}年${month}${day}日`
}

function calculateLevel(count: number): number {
    if (count === 0) return 0
    if (count <= levelThresholds[1]) return 1
    if (count <= levelThresholds[2]) return 2
    if (count <= levelThresholds[3]) return 3
    return 4
}

function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function generateDisplayDays(): void {
    const commitMap = new Map<string, number>()

    days.value.forEach(commit => {
        commitMap.set(commit.date, commit.count)
    })

    const dates: DayCommit[] = []
    const today = new Date()

    for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateStr = formatDate(date)
        const count = commitMap.get(dateStr) || 0

        dates.push({ date: dateStr, count })
    }

    displayDays.value = dates
}

const loadGitActivityData = async () => {
    loading.value = true

    try {
        const response = await fetch('/git-activity.json')
        if (!response.ok) throw new Error('Failed to load git activity data')

        const data = (await response.json()) as GitActivityData
        days.value = data.commits || []
        generateDisplayDays()
    } catch (error) {
        console.error('Failed to load git activity data:', error)
        days.value = []
        displayDays.value = []
    } finally {
        loading.value = false
    }
}

const handleMouseEnter = (event: MouseEvent, day: DayCommit) => {
    if (!day.date || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top - tooltipOffset

    tooltip.value = {
        visible: true,
        x,
        y,
        count: day.count,
        date: day.date,
    }
}

const handleMouseLeave = () => {
    tooltip.value.visible = false
}

const handleMouseMove = (event: MouseEvent) => {
    if (!tooltip.value.visible || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    tooltip.value.x = event.clientX - rect.left
    tooltip.value.y = event.clientY - rect.top - tooltipOffset
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
