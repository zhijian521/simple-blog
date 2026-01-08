import type { Ripple } from '../types/ripple'
import { RIPPLE_CONFIG, getSizeMultiplier, getWaveCount } from './useRippleConfig'

/**
 * 创建涟漪对象
 */
export function createRipple(
    x: number,
    y: number,
    intensity: number,
    canvas: HTMLCanvasElement
): Ripple {
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

/**
 * 创建多个涟漪（用于点击和交互）
 */
export function createRipples(
    x: number,
    y: number,
    intensity: number,
    canvas: HTMLCanvasElement,
    ripples: Ripple[]
) {
    const rippleCount = getWaveCount(intensity)
    for (let i = 0; i < rippleCount; i++) {
        const ripple = createRipple(x, y, intensity, canvas)
        ripple.radius = i * (6 + intensity * 10)
        ripple.speed = (0.4 + i * 0.1) * (1 + intensity * 0.15)
        ripple.phase = i * Math.PI * 0.5
        ripples.push(ripple)
    }
}

/**
 * 动画渲染循环
 */
export function animateRipples(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    ripples: Ripple[],
    lastRippleTime: { value: number }
): number {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentTime = Date.now()
    const { GENERATION_INTERVAL } = RIPPLE_CONFIG

    // 自动生成涟漪
    if (
        currentTime - lastRippleTime.value >
        GENERATION_INTERVAL.min + Math.random() * (GENERATION_INTERVAL.max - GENERATION_INTERVAL.min)
    ) {
        // 检查波纹数量，防止性能问题
        if (ripples.length < RIPPLE_CONFIG.MAX_RIPPLES) {
            const centerX = Math.random() * canvas.width
            const centerY = Math.random() * canvas.height
            createRipples(centerX, centerY, Math.random(), canvas, ripples)
            lastRippleTime.value = currentTime
        }
    }

    // 更新和绘制涟漪
    renderRipples(ctx, ripples)

    return requestAnimationFrame(() => animateRipples(canvas, ctx, ripples, lastRippleTime))
}

/**
 * 渲染所有涟漪
 */
function renderRipples(ctx: CanvasRenderingContext2D, ripples: Ripple[]) {
    // 使用倒序遍历，方便删除元素
    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]

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
            ripples.splice(i, 1)
            continue
        }

        drawRipple(ctx, ripple, radiusRatio, currentOpacity)
    }
}

/**
 * 绘制单个涟漪
 */
function drawRipple(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    radiusRatio: number,
    currentOpacity: number
) {
    const { HIGHLIGHT } = RIPPLE_CONFIG
    const baseLineWidth = (0.8 + ripple.intensity * 1.2) * (1 - radiusRatio * 0.7)

    // 绘制多重波纹
    for (let wave = 0; wave < ripple.waveCount; wave++) {
        const waveOffset = wave * (12 + ripple.intensity * 8)
        const waveRadius = ripple.radius - waveOffset * radiusRatio
        if (waveRadius <= 0) continue

        const waveOpacity = currentOpacity * (1 - wave * 0.2) * (1 - radiusRatio * 0.5)
        if (waveOpacity <= 0.005) continue

        drawWaveCircle(ctx, ripple, waveRadius, waveOpacity, baseLineWidth, HIGHLIGHT, radiusRatio)
    }

    // 绘制中心点
    if (radiusRatio < 0.25) {
        drawCenterPoint(ctx, ripple, radiusRatio, currentOpacity, HIGHLIGHT)
    }
}

/**
 * 绘制波纹圆圈
 */
function drawWaveCircle(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    waveRadius: number,
    waveOpacity: number,
    baseLineWidth: number,
    HIGHLIGHT: typeof RIPPLE_CONFIG.HIGHLIGHT,
    radiusRatio: number
) {
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
    ctx.lineWidth = Math.max(0.3, baseLineWidth * (1 - 0 * 0.2))
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2)
    ctx.stroke()

    // 高光效果
    if (HIGHLIGHT.enabled && radiusRatio < 0.4) {
        drawHighlight(ctx, ripple, waveRadius, waveOpacity, baseLineWidth, HIGHLIGHT, radiusRatio)
    }
}

/**
 * 绘制高光
 */
function drawHighlight(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    waveRadius: number,
    waveOpacity: number,
    baseLineWidth: number,
    HIGHLIGHT: typeof RIPPLE_CONFIG.HIGHLIGHT,
    radiusRatio: number
) {
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

/**
 * 绘制中心点
 */
function drawCenterPoint(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    radiusRatio: number,
    currentOpacity: number,
    HIGHLIGHT: typeof RIPPLE_CONFIG.HIGHLIGHT
) {
    const centerSize = (3 + ripple.intensity * 3) * (1 - radiusRatio * 4)
    const centerGradient = ctx.createRadialGradient(ripple.x, ripple.y, 0, ripple.x, ripple.y, centerSize)

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
