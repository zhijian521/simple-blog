<template>
    <canvas
        ref="canvasRef"
        class="spring-effect"
        aria-label="春季花瓣飘落动画效果"
        role="img"
    ></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { setupCanvasResize } from '@/composables/common/useCanvasResize'
import { useVisibilityChange } from '@/composables/common/useVisibility'

interface Petal {
    x: number
    y: number
    size: number
    fallSpeed: number
    drift: number
    swayAmplitude: number
    swaySpeed: number
    swayPhase: number
    rotation: number
    rotationSpeed: number
    opacity: number
    color: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const petals = ref<Petal[]>([])

const PETAL_COLORS = [
    'rgba(255, 182, 193, 0.82)',
    'rgba(255, 198, 208, 0.8)',
    'rgba(252, 216, 224, 0.78)',
    'rgba(248, 205, 216, 0.8)',
] as const

let animationFrameId: number | null = null
let cleanupResize: (() => void) | null = null
let cleanupVisibility: (() => void) | null = null

function getPetalCount(screenWidth: number): number {
    if (screenWidth < 768) return 16
    if (screenWidth < 1024) return 24
    if (screenWidth < 1280) return 32
    return 40
}

function getResponsivePetalCount(screenWidth: number): number {
    const baseCount = getPetalCount(screenWidth)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reducedMotion ? Math.max(8, Math.floor(baseCount * 0.6)) : baseCount
}

function createPetal(
    canvasWidth: number,
    canvasHeight: number,
    options?: { fromTop?: boolean }
): Petal {
    const size = 5 + Math.random() * 6
    const startY = options?.fromTop
        ? -20 - Math.random() * canvasHeight * 0.25
        : Math.random() * canvasHeight

    return {
        x: Math.random() * canvasWidth,
        y: startY,
        size,
        fallSpeed: 0.35 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.45,
        swayAmplitude: 0.08 + Math.random() * 0.22,
        swaySpeed: 1.1 + Math.random() * 1.8,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.45 + Math.random() * 0.4,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal): void {
    ctx.save()
    ctx.translate(petal.x, petal.y)
    ctx.rotate(petal.rotation)
    ctx.globalAlpha = petal.opacity

    ctx.beginPath()
    ctx.moveTo(0, -petal.size)
    ctx.bezierCurveTo(
        petal.size * 0.72,
        -petal.size * 0.4,
        petal.size * 0.42,
        petal.size * 0.94,
        0,
        petal.size * 1.18
    )
    ctx.bezierCurveTo(
        -petal.size * 0.42,
        petal.size * 0.94,
        -petal.size * 0.72,
        -petal.size * 0.4,
        0,
        -petal.size
    )
    ctx.closePath()
    ctx.fillStyle = petal.color
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -petal.size * 0.68)
    ctx.lineTo(0, petal.size * 0.92)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    ctx.restore()
}

function updatePetals(canvas: HTMLCanvasElement, time: number): void {
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const t = time * 0.001

    petals.value.forEach((petal, index) => {
        petal.y += petal.fallSpeed
        petal.x +=
            petal.drift + Math.sin(t * petal.swaySpeed + petal.swayPhase) * petal.swayAmplitude
        petal.rotation += petal.rotationSpeed

        if (
            petal.y > canvasHeight + 24 ||
            petal.x < -32 ||
            petal.x > canvasWidth + 32
        ) {
            petals.value[index] = createPetal(canvasWidth, canvasHeight, { fromTop: true })
        }
    })
}

function startAnimationLoop(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): number {
    const animate = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        updatePetals(canvas, time)
        petals.value.forEach(petal => drawPetal(ctx, petal))
        animationFrameId = requestAnimationFrame(animate)
    }

    return requestAnimationFrame(animate)
}

function resetPetals(canvasWidth: number, canvasHeight: number): void {
    const count = getResponsivePetalCount(window.innerWidth)
    petals.value = Array.from({ length: count }, () => createPetal(canvasWidth, canvasHeight))
}

function restartAnimation(): void {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    resetPetals(canvas.width, canvas.height)
    animationFrameId = startAnimationLoop(canvas, ctx)
}

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    resetPetals(canvas.width, canvas.height)
    cleanupResize = setupCanvasResize(canvas, restartAnimation)

    const startAnimation = () => {
        if (animationFrameId !== null) {
            return
        }
        animationFrameId = startAnimationLoop(canvas, ctx)
    }

    const stopAnimation = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        }
    }

    cleanupVisibility = useVisibilityChange(startAnimation, stopAnimation)
    startAnimation()
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }

    if (cleanupResize) {
        cleanupResize()
        cleanupResize = null
    }

    if (cleanupVisibility) {
        cleanupVisibility()
        cleanupVisibility = null
    }
})
</script>

<style scoped>
.spring-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}
</style>
