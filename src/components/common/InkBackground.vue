<template>
    <canvas ref="canvasRef" class="ink-background"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Ripple {
    x: number
    y: number
    radius: number
    maxRadius: number
    opacity: number
    life: number
    maxLife: number
    speed: number
    intensity: number
    waveCount: number
    phase: number
}

const RIPPLE_CONFIG = {
    GENERATION_INTERVAL: { min: 600, max: 1500 },
    BASE_MAX_RADIUS_RATIO: 0.18,
    INITIAL_RADIUS: { min: 2, max: 8 },
    LIFETIME: { min: 280, max: 420 },
    BASE_SPEED: { min: 0.4, max: 0.7 },
    OPACITY: { min: 0.08, max: 0.18 },
    INTENSITY_THRESHOLDS: { small: 0.3, medium: 0.6 },
    WAVE_COUNT: { small: 2, medium: 3, large: 4 },
    MOUSE_MOVE: { enabled: true, minDistance: 80, intensity: 0.2, maxCount: 8 },
    HIGHLIGHT: { enabled: true, opacity: 0.12, offset: 0.15 },
}

const RIPPLE_SIZE_MULTIPLIERS = {
    small: { min: 0.2, max: 0.5 },
    medium: { min: 0.5, max: 0.7 },
    large: { min: 0.7, max: 1.0 },
}

const getSizeMultiplier = (intensity: number): number => {
    const { small, medium, large } = RIPPLE_SIZE_MULTIPLIERS
    const { INTENSITY_THRESHOLDS } = RIPPLE_CONFIG

    if (intensity < INTENSITY_THRESHOLDS.small) {
        return small.min + intensity * (small.max - small.min)
    }
    if (intensity < INTENSITY_THRESHOLDS.medium) {
        return medium.min + (intensity - INTENSITY_THRESHOLDS.small) * (medium.max - medium.min)
    }
    return large.min + (intensity - INTENSITY_THRESHOLDS.medium) * (large.max - large.min)
}

const getWaveCount = (intensity: number): number => {
    const { INTENSITY_THRESHOLDS, WAVE_COUNT } = RIPPLE_CONFIG
    return intensity > INTENSITY_THRESHOLDS.medium ? WAVE_COUNT.large : WAVE_COUNT.medium
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
let ripples: Ripple[] = []
let lastRippleTime = 0
let mousePos = { x: 0, y: 0 }
let lastMouseRippleTime = 0

const createRipple = (
    x: number,
    y: number,
    intensity: number,
    canvas: HTMLCanvasElement
): Ripple => {
    const sizeMultiplier = getSizeMultiplier(intensity)
    const { BASE_MAX_RADIUS_RATIO, INITIAL_RADIUS, LIFETIME, BASE_SPEED, OPACITY } = RIPPLE_CONFIG

    const baseMaxRadius = Math.max(canvas.width, canvas.height) * BASE_MAX_RADIUS_RATIO
    const maxRadius = baseMaxRadius * sizeMultiplier + Math.random() * 50 * sizeMultiplier
    const maxLife = (LIFETIME.min + Math.random() * (LIFETIME.max - LIFETIME.min)) * sizeMultiplier
    const baseSpeed = BASE_SPEED.min + Math.random() * (BASE_SPEED.max - BASE_SPEED.min)
    const speed = baseSpeed * (1 + sizeMultiplier * 0.15)

    return {
        x,
        y,
        radius: INITIAL_RADIUS.min + Math.random() * (INITIAL_RADIUS.max - INITIAL_RADIUS.min),
        maxRadius,
        opacity: (OPACITY.min + Math.random() * (OPACITY.max - OPACITY.min)) * (0.85 + intensity * 0.15),
        life: maxLife,
        maxLife,
        speed,
        intensity,
        waveCount: getWaveCount(intensity),
        phase: Math.random() * Math.PI * 2,
    }
}

const createRipples = (x: number, y: number, intensity: number = Math.random(), canvas: HTMLCanvasElement) => {
    const rippleCount = getWaveCount(intensity)
    for (let i = 0; i < rippleCount; i++) {
        const ripple = createRipple(x, y, intensity, canvas)
        ripple.radius = i * (6 + intensity * 10)
        ripple.speed = (0.4 + i * 0.1) * (1 + intensity * 0.15)
        ripple.phase = i * Math.PI * 0.5
        ripples.push(ripple)
    }
}

const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentTime = Date.now()
    const { GENERATION_INTERVAL, HIGHLIGHT } = RIPPLE_CONFIG

    // 自动生成涟漪
    if (
        currentTime - lastRippleTime >
        GENERATION_INTERVAL.min + Math.random() * (GENERATION_INTERVAL.max - GENERATION_INTERVAL.min)
    ) {
        const centerX = Math.random() * canvas.width
        const centerY = Math.random() * canvas.height
        createRipples(centerX, centerY, Math.random(), canvas)
        lastRippleTime = currentTime
    }

    // 更新和绘制涟漪
    ripples = ripples.filter(ripple => {
        ripple.radius += ripple.speed
        ripple.life--
        ripple.phase += 0.08

        const lifeRatio = ripple.life / ripple.maxLife
        const radiusRatio = ripple.radius / ripple.maxRadius

        const lifeDecay = Math.pow(lifeRatio, 0.7)
        const radiusDecay = 1 - Math.pow(radiusRatio, 0.8)
        const waveModulation = Math.sin(ripple.phase) * 0.1 + 0.9

        const currentOpacity = ripple.opacity * lifeDecay * radiusDecay * waveModulation

        if (currentOpacity <= 0.005 || ripple.radius > ripple.maxRadius) {
            return false
        }

        const baseLineWidth = (0.8 + ripple.intensity * 1.2) * (1 - radiusRatio * 0.7)

        // 绘制多重波纹
        for (let wave = 0; wave < ripple.waveCount; wave++) {
            const waveOffset = wave * (12 + ripple.intensity * 8)
            const waveRadius = ripple.radius - waveOffset * radiusRatio
            if (waveRadius <= 0) continue

            const waveOpacity = currentOpacity * (1 - wave * 0.2) * (1 - radiusRatio * 0.5)
            if (waveOpacity <= 0.005) continue

            // 创建径向渐变
            const gradient = ctx.createRadialGradient(
                ripple.x,
                ripple.y,
                waveRadius * 0.8,
                ripple.x,
                ripple.y,
                waveRadius * 1.15
            )

            const edgeOpacity = waveOpacity * 0.08
            const midOpacity = waveOpacity * 0.6
            const peakOpacity = waveOpacity * 0.85

            gradient.addColorStop(0, `rgba(0, 0, 0, ${edgeOpacity})`)
            gradient.addColorStop(0.25, `rgba(0, 0, 0, ${midOpacity})`)
            gradient.addColorStop(0.45, `rgba(0, 0, 0, ${peakOpacity})`)
            gradient.addColorStop(0.55, `rgba(0, 0, 0, ${peakOpacity * 0.95})`)
            gradient.addColorStop(0.75, `rgba(0, 0, 0, ${midOpacity})`)
            gradient.addColorStop(1, `rgba(0, 0, 0, ${edgeOpacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(0.3, baseLineWidth * (1 - wave * 0.2))
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2)
            ctx.stroke()

            // 高光效果
            if (HIGHLIGHT.enabled && radiusRatio < 0.4 && wave === 0) {
                const highlightRadius = waveRadius * (1 + HIGHLIGHT.offset)
                const highlightGradient = ctx.createRadialGradient(
                    ripple.x - highlightRadius * 0.3,
                    ripple.y - highlightRadius * 0.3,
                    0,
                    ripple.x,
                    ripple.y,
                    highlightRadius
                )

                const highlightOpacity = waveOpacity * HIGHLIGHT.opacity * (1 - radiusRatio * 2)
                highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity})`)
                highlightGradient.addColorStop(0.3, `rgba(255, 255, 255, ${highlightOpacity * 0.5})`)
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

                ctx.strokeStyle = highlightGradient
                ctx.lineWidth = baseLineWidth * 0.6
                ctx.beginPath()
                ctx.arc(ripple.x, ripple.y, highlightRadius, 0, Math.PI * 2)
                ctx.stroke()
            }
        }

        // 中心点效果
        if (radiusRatio < 0.25) {
            const centerSize = (3 + ripple.intensity * 3) * (1 - radiusRatio * 4)
            const centerGradient = ctx.createRadialGradient(
                ripple.x,
                ripple.y,
                0,
                ripple.x,
                ripple.y,
                centerSize
            )

            const centerOpacity = currentOpacity * 0.8 * (1 - radiusRatio * 3)
            centerGradient.addColorStop(0, `rgba(0, 0, 0, ${centerOpacity * 0.9})`)
            centerGradient.addColorStop(0.4, `rgba(0, 0, 0, ${centerOpacity * 0.5})`)
            centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

            ctx.fillStyle = centerGradient
            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, centerSize, 0, Math.PI * 2)
            ctx.fill()

            if (HIGHLIGHT.enabled) {
                const highlightGradient = ctx.createRadialGradient(
                    ripple.x - centerSize * 0.3,
                    ripple.y - centerSize * 0.3,
                    0,
                    ripple.x,
                    ripple.y,
                    centerSize * 0.8
                )

                const hlOpacity = centerOpacity * HIGHLIGHT.opacity * 1.5
                highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${hlOpacity})`)
                highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${hlOpacity * 0.4})`)
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

                ctx.fillStyle = highlightGradient
                ctx.beginPath()
                ctx.arc(ripple.x, ripple.y, centerSize * 0.6, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        return true
    })

    animationFrameId = requestAnimationFrame(() => animate(canvas, ctx))
}

const handleClick = (e: MouseEvent) => {
    const canvas = canvasRef.value
    if (!canvas || e.target !== canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const clickIntensity = 0.5 + Math.random() * 0.5
    createRipples(x, y, clickIntensity, canvas)
}

const handleMouseMove = (e: MouseEvent) => {
    const { MOUSE_MOVE } = RIPPLE_CONFIG
    if (!MOUSE_MOVE.enabled) return

    const canvas = canvasRef.value
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - mousePos.x
    const dy = y - mousePos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    mousePos = { x, y }

    if (distance > MOUSE_MOVE.minDistance) {
        const currentTime = Date.now()
        if (currentTime - lastMouseRippleTime > 150) {
            const mouseRipples = ripples.filter(r => r.intensity < 0.3)
            if (mouseRipples.length < MOUSE_MOVE.maxCount) {
                createRipples(x, y, MOUSE_MOVE.intensity + Math.random() * 0.1, canvas)
            }
            lastMouseRippleTime = currentTime
        }
    }
}

const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

// 保存事件处理函数引用，以便正确清理
let resizeHandler: (() => void) | null = null

onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    resizeCanvas(canvas)

    // 保存函数引用
    resizeHandler = () => resizeCanvas(canvas)
    window.addEventListener('resize', resizeHandler)
    canvas.addEventListener('click', handleClick, true)
    canvas.addEventListener('mousemove', handleMouseMove, true)

    animate(canvas, ctx)
})

onUnmounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    // 使用保存的函数引用移除监听器
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler)
    }
    canvas.removeEventListener('click', handleClick, true)
    canvas.removeEventListener('mousemove', handleMouseMove, true)
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
})
</script>

<style scoped>
.ink-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    z-index: 0;
    mix-blend-mode: normal;
    cursor: default;
}
</style>
