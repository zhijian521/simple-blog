import type { Ripple } from '@/types/ripple'
import { RIPPLE_CONFIG, getSizeMultiplier, getWaveCount } from './useConfig'

/**
 * 创建单个涟漪对象
 * @returns 初始化的涟漪
 */
export function createRipple(
    x: number,
    y: number,
    intensity: number,
    canvas: HTMLCanvasElement
): Ripple {
    const sizeMultiplier = getSizeMultiplier(intensity)
    const { BASE_MAX_RADIUS_RATIO, INITIAL_RADIUS, LIFETIME, BASE_SPEED, OPACITY } = RIPPLE_CONFIG

    // 计算最大半径（基于画布尺寸和强度）
    const baseMaxRadius = Math.max(canvas.width, canvas.height) * BASE_MAX_RADIUS_RATIO
    const maxRadius = baseMaxRadius * sizeMultiplier + Math.random() * 50 * sizeMultiplier

    // 计算生命周期（强度越大，持续时间越长）
    const maxLife = (LIFETIME.min + Math.random() * (LIFETIME.max - LIFETIME.min)) * sizeMultiplier

    // 计算扩散速度
    const baseSpeed = BASE_SPEED.min + Math.random() * (BASE_SPEED.max - BASE_SPEED.min)
    const speed = baseSpeed * (1 + sizeMultiplier * 0.15)

    return {
        x,
        y,
        radius: INITIAL_RADIUS.min + Math.random() * (INITIAL_RADIUS.max - INITIAL_RADIUS.min),
        maxRadius,
        opacity:
            (OPACITY.min + Math.random() * (OPACITY.max - OPACITY.min)) * (0.85 + intensity * 0.15),
        life: maxLife,
        maxLife,
        speed,
        intensity,
        waveCount: getWaveCount(intensity),
        phase: Math.random() * Math.PI * 2,
    }
}

/**
 * 创建多个涟漪（用于点击和交互事件）
 * 多个涟漪形成同心圆效果
 */
export function createRipples(
    x: number,
    y: number,
    intensity: number,
    canvas: HTMLCanvasElement,
    ripples: Ripple[]
): void {
    const rippleCount = getWaveCount(intensity)

    for (let i = 0; i < rippleCount; i++) {
        const ripple = createRipple(x, y, intensity, canvas)

        // 每个波纹圈的初始半径和速度略有不同，形成扩散效果
        ripple.radius =
            i *
            (RIPPLE_CONFIG.WAVE_SPACING_BASE +
                intensity * RIPPLE_CONFIG.WAVE_SPACING_INTENSITY_FACTOR)
        ripple.speed = (0.4 + i * 0.1) * (1 + intensity * 0.15)
        ripple.phase = i * Math.PI * 0.5

        ripples.push(ripple)
    }
}

/**
 * 启动涟漪动画循环
 * @returns 动画帧 ID，用于取消动画
 */
export function startAnimationLoop(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    ripples: Ripple[],
    lastRippleTime: { value: number }
): number {
    function animate(): number {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const currentTime = Date.now()
        const { GENERATION_INTERVAL, MAX_RIPPLES } = RIPPLE_CONFIG

        // 自动生成涟漪（在随机位置）
        const shouldGenerate =
            currentTime - lastRippleTime.value >
            GENERATION_INTERVAL.min +
                Math.random() * (GENERATION_INTERVAL.max - GENERATION_INTERVAL.min)

        if (shouldGenerate && ripples.length < MAX_RIPPLES) {
            const centerX = Math.random() * canvas.width
            const centerY = Math.random() * canvas.height
            createRipples(centerX, centerY, Math.random(), canvas, ripples)
            lastRippleTime.value = currentTime
        }

        // 更新和绘制所有涟漪
        renderRipples(ctx, ripples)

        return requestAnimationFrame(animate)
    }

    return animate()
}

/**
 * 渲染所有涟漪
 * 使用批量删除优化性能
 */
function renderRipples(ctx: CanvasRenderingContext2D, ripples: Ripple[]): void {
    const {
        PHASE_INCREMENT,
        MIN_OPACITY_THRESHOLD,
        LIFE_DECAY_POWER,
        RADIUS_DECAY_POWER,
        WAVE_MODULATION_AMPLITUDE,
    } = RIPPLE_CONFIG

    const toRemove: number[] = []

    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i]

        ripple.radius += ripple.speed
        ripple.life--
        ripple.phase += PHASE_INCREMENT

        const lifeRatio = ripple.life / ripple.maxLife
        const radiusRatio = ripple.radius / ripple.maxRadius

        const lifeDecay = Math.pow(lifeRatio, LIFE_DECAY_POWER)
        const radiusDecay = 1 - Math.pow(radiusRatio, RADIUS_DECAY_POWER)
        const waveModulation = Math.sin(ripple.phase) * WAVE_MODULATION_AMPLITUDE + 0.9

        const currentOpacity = ripple.opacity * lifeDecay * radiusDecay * waveModulation

        if (currentOpacity <= MIN_OPACITY_THRESHOLD || ripple.radius > ripple.maxRadius) {
            toRemove.push(i)
            continue
        }

        drawRipple(ctx, ripple, radiusRatio, currentOpacity)
    }

    // 批量删除过期的涟漪
    toRemove.forEach(i => ripples.splice(i, 1))
}

/**
 * 绘制单个涟漪（包含多个波纹圈和中心点）
 */
function drawRipple(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    radiusRatio: number,
    currentOpacity: number
): void {
    const { WAVE_SPACING_BASE, WAVE_SPACING_INTENSITY_FACTOR, CENTER_MAX_RADIUS_RATIO } =
        RIPPLE_CONFIG

    const baseLineWidth = (0.8 + ripple.intensity * 1.2) * (1 - radiusRatio * 0.7)

    // 绘制多个同心波纹圈
    for (let wave = 0; wave < ripple.waveCount; wave++) {
        const waveOffset =
            wave * (WAVE_SPACING_BASE + ripple.intensity * WAVE_SPACING_INTENSITY_FACTOR)
        const waveRadius = ripple.radius - waveOffset * radiusRatio

        if (waveRadius <= 0) continue

        // 外层波纹透明度递减
        const waveOpacity = currentOpacity * (1 - wave * 0.2) * (1 - radiusRatio * 0.5)
        if (waveOpacity <= RIPPLE_CONFIG.MIN_OPACITY_THRESHOLD) continue

        drawWaveCircle(ctx, ripple, waveRadius, waveOpacity, baseLineWidth, radiusRatio)
    }

    // 绘制中心点（仅在涟漪较小时显示）
    if (radiusRatio < CENTER_MAX_RADIUS_RATIO) {
        drawCenterPoint(ctx, ripple, radiusRatio, currentOpacity)
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
    radiusRatio: number
): void {
    const { GRADIENT_WIDTH_RATIO, HIGHLIGHT } = RIPPLE_CONFIG

    // 创建径向渐变（使波纹边缘柔和）
    const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        waveRadius * 0.8,
        ripple.x,
        ripple.y,
        waveRadius * (1 + GRADIENT_WIDTH_RATIO)
    )

    // 渐变透明度分布（中间深，两边浅）
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
    ctx.lineWidth = Math.max(0.3, baseLineWidth)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2)
    ctx.stroke()

    // 绘制高光（仅在涟漪较新时显示）
    if (HIGHLIGHT.enabled && radiusRatio < 0.4) {
        drawHighlight(ctx, ripple, waveRadius, waveOpacity, baseLineWidth, radiusRatio)
    }
}

/**
 * 绘制高光效果
 */
function drawHighlight(
    ctx: CanvasRenderingContext2D,
    ripple: Ripple,
    waveRadius: number,
    waveOpacity: number,
    baseLineWidth: number,
    radiusRatio: number
): void {
    const { HIGHLIGHT } = RIPPLE_CONFIG

    const highlightRadius = waveRadius * (1 + HIGHLIGHT.offset)
    const highlightGradient = ctx.createRadialGradient(
        ripple.x - highlightRadius * 0.3,
        ripple.y - highlightRadius * 0.3,
        0,
        ripple.x,
        ripple.y,
        highlightRadius
    )

    // 高光从左上角照射
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
    currentOpacity: number
): void {
    const { HIGHLIGHT } = RIPPLE_CONFIG

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

    // 中心点高光
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
