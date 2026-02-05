<template>
    <div class="dock" :class="`dock--${position}`">
        <div class="dock-container">
            <component
                :is="item.to ? RouterLink : 'div'"
                v-for="item in items"
                :key="item.id"
                :to="item.to"
                class="dock-item"
                @click="item.action?.()"
            >
                <div class="dock-item-inner">
                    <component :is="item.icon" class="dock-icon" />
                </div>
                <div class="dock-reflection"></div>
            </component>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'
import type { DockItem } from '@/constants/dock'

interface Props {
    items: DockItem[]
    position?: 'bottom' | 'top'
    searchVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    position: 'bottom',
    searchVisible: false,
})

// 查找搜索项（使用 computed 响应式）
const searchItem = computed(() => props.items.find(item => item.id === 'search'))

// Cmd/Ctrl + K: 打开搜索（只在搜索弹窗关闭时生效）
useKeyboardShortcut(
    'k',
    () => {
        searchItem.value?.action?.()
    },
    {
        ctrlKey: true,
        preventDefault: true,
        condition: () => !props.searchVisible,
    }
)

// Q: 打开搜索（焦点不在输入框中，且搜索弹窗关闭时生效）
useKeyboardShortcut(
    'q',
    () => {
        searchItem.value?.action?.()
    },
    {
        preventDefault: true,
        ignoreInputs: true,
        condition: () => !props.searchVisible,
    }
)
</script>

<style scoped>
.dock {
    position: fixed;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 1.5rem;
    z-index: 1000;
    pointer-events: none;
}

.dock--bottom {
    bottom: 1.25rem;
}

.dock--top {
    top: 0;
}

.dock-container {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 0.5rem 0.5rem;
    border-radius: 1rem;
    pointer-events: auto;
    position: relative;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -1px 0 rgba(0, 0, 0, 0.02);
}

.dock-container::before {
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

.dock-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
}

.dock-item:hover {
    transform: translateY(-2px) scale(1.06);
}

.dock-item-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.625rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transition: all 0.3s ease;
}

.dock-item:hover .dock-item-inner {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow:
        0 6px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.dock-icon {
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    stroke: rgba(60, 60, 67, 0.5);
    stroke-width: 2;
    transition: stroke 0.3s ease;
}

.dock-item:hover .dock-icon {
    stroke: rgba(60, 60, 67, 0.8);
}

.dock-reflection {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, transparent 70%);
    opacity: 0.6;
    filter: blur(2px);
    transition: all 0.3s ease;
}

.dock-item:hover .dock-reflection {
    bottom: -4px;
    width: 65%;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .dock {
        right: 0.5rem;
        padding: 0.5rem;
        bottom: 0.5rem;
    }
}
</style>
