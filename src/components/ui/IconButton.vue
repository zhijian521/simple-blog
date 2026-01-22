<template>
    <component
        :is="tag"
        v-bind="bindProps"
        class="icon-button"
        :title="computedTitle"
        :aria-label="ariaLabel"
        @click="handleClick"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    to?: string
    href?: string
    target?: string
    rel?: string
    title?: string
    shortcutHint?: string
    ariaLabel: string
}

const props = withDefaults(defineProps<Props>(), {
    to: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
    title: '',
    shortcutHint: '',
})

interface Emits {
    (e: 'click'): void
}

const emit = defineEmits<Emits>()

const tag = computed(() => {
    if (props.to) return 'router-link'
    if (props.href) return 'a'
    return 'button'
})

const bindProps = computed(() => {
    if (props.to) return { to: props.to }
    if (props.href) return { href: props.href, target: props.target, rel: props.rel }
    return {}
})

const computedTitle = computed(() => {
    return props.shortcutHint ? `${props.title} (${props.shortcutHint})` : props.title
})

function handleClick() {
    emit('click')
}
</script>

<style scoped>
.icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: background 0.2s ease;
    text-decoration: none;
}

.icon-button:hover {
    background: rgba(0, 0, 0, 0.06);
}

.icon-button:active {
    background: rgba(0, 0, 0, 0.1);
}

.icon-button :deep(svg) {
    width: 20px;
    height: 20px;
    color: var(--color-text-light);
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .icon-button {
        width: 36px;
        height: 36px;
    }

    .icon-button :deep(svg) {
        width: 18px;
        height: 18px;
    }
}
</style>
