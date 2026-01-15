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
import { RouterLink } from 'vue-router'
import type { DockItem } from '@/constants/dock'

interface Props {
    items: DockItem[]
    position?: 'bottom' | 'top'
}

withDefaults(defineProps<Props>(), {
    position: 'bottom',
})
</script>

<style scoped>
.dock {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 1.5rem;
    z-index: 1000;
    pointer-events: none;
}

.dock--bottom {
    bottom: 1rem;
}

.dock--top {
    top: 0;
}

.dock-container {
    display: flex;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 1.5rem;
    pointer-events: auto;
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
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
        rgba(255, 255, 255, 0.15) 100%
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
    transform: translateY(-3px) scale(1.06);
}

.dock-item-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    border-radius: 1rem;
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
    width: 1.25rem;
    height: 1.25rem;
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
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, transparent 70%);
    opacity: 0.6;
    filter: blur(2px);
    transition: all 0.3s ease;
}

.dock-item:hover .dock-reflection {
    bottom: -6px;
    width: 75%;
    opacity: 0.5;
}

@media (max-width: 768px) {
    .dock {
        padding: 1rem;
    }

    .dock-container {
        gap: 0.75rem;
        padding: 0.625rem 1rem;
        border-radius: 1.25rem;
    }

    .dock-item-inner {
        padding: 0.625rem;
        border-radius: 0.75rem;
    }

    .dock-icon {
        width: 1.125rem;
        height: 1.125rem;
    }

    .dock-item:hover {
        transform: translateY(-2px) scale(1.05);
    }
}

@media (max-width: 480px) {
    .dock {
        padding: 0.75rem;
    }

    .dock-container {
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: 1rem;
    }

    .dock-item-inner {
        padding: 0.5rem;
        border-radius: 0.625rem;
    }

    .dock-icon {
        width: 1rem;
        height: 1rem;
    }

    .dock-item:hover {
        transform: translateY(-2px) scale(1.04);
    }
}
</style>
