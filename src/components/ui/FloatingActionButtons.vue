<template>
    <div class="fab-container">
        <RouterLink to="/" class="glass-fab" aria-label="返回首页">
            <HomeIcon class="fab-icon" />
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import HomeIcon from '../icons/HomeIcon.vue'
</script>

<style scoped>
.fab-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 100;
}

.glass-fab {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.95);
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.05),
        0 1px 3px rgba(0, 0, 0, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    -webkit-user-select: none;
    text-decoration: none;
}

.glass-fab::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.25s ease;
}

.glass-fab:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.06),
        0 2px 6px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 1),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.glass-fab:hover::before {
    opacity: 1;
}

.glass-fab:active {
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.fab-icon {
    width: 1rem;
    height: 1rem;
    stroke: rgba(60, 60, 67, 0.35);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
    transition: stroke 0.25s ease;
}

.glass-fab:hover .fab-icon {
    stroke: rgba(60, 60, 67, 0.55);
}

@media (max-width: 768px) {
    .fab-container {
        bottom: 1.5rem;
        right: 1.5rem;
        gap: 0.5rem;
    }

    .glass-fab {
        width: 2.5rem;
        height: 2.5rem;
    }

    .fab-icon {
        width: 1.1rem;
        height: 1.1rem;
    }
}

@media (max-width: 480px) {
    .fab-container {
        bottom: 1.25rem;
        right: 1.25rem;
    }

    .glass-fab {
        width: 2.25rem;
        height: 2.25rem;
    }

    .fab-icon {
        width: 0.9rem;
        height: 0.9rem;
    }
}
</style>
