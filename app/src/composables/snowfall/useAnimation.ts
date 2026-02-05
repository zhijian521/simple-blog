import type { Snowflake } from '@/types/snowflake'
import { createSnowflake, SNOWFALL_CONFIG } from './useConfig'

/**
 * 更新所有雪花的位置和状态
 * 当雪花超出边界时，重置到顶部重新进入
 */
export function updateSnowflakes(
    snowflakes: Snowflake[],
    canvasWidth: number,
    canvasHeight: number
): void {
    const { BOUNDARY_TOLERANCE } = SNOWFALL_CONFIG

    snowflakes.forEach(snowflake => {
        // 更新位置
        snowflake.y += snowflake.speed
        snowflake.x += snowflake.wind
        snowflake.rotation += snowflake.rotationSpeed

        // 边界检测：超出底部或左右边界时重置到顶部
        if (
            snowflake.y > canvasHeight + BOUNDARY_TOLERANCE ||
            snowflake.x < -BOUNDARY_TOLERANCE ||
            snowflake.x > canvasWidth + BOUNDARY_TOLERANCE
        ) {
            const resetSnowflake = createSnowflake(canvasWidth, canvasHeight, { fromTop: true })
            snowflake.x = resetSnowflake.x
            snowflake.y = resetSnowflake.y
            snowflake.wind = resetSnowflake.wind
        }
    })
}

/**
 * 渲染所有雪花到画布
 */
export function renderSnowflakes(
    ctx: CanvasRenderingContext2D,
    snowflakes: Snowflake[],
    image: HTMLImageElement
): void {
    snowflakes.forEach(snowflake => {
        ctx.save()
        ctx.globalAlpha = snowflake.opacity
        ctx.translate(snowflake.x, snowflake.y)
        ctx.rotate(snowflake.rotation)

        // 绘制雪花（居中绘制）
        const size = snowflake.radius * 2
        ctx.drawImage(image, -size / 2, -size / 2, size, size)

        ctx.restore()
    })
}

/**
 * 初始化指定数量的雪花
 */
export function initializeSnowflakes(
    count: number,
    canvasWidth: number,
    canvasHeight: number
): Snowflake[] {
    return Array.from({ length: count }, () => createSnowflake(canvasWidth, canvasHeight))
}

/**
 * 启动雪花动画循环
 * @returns 动画帧 ID，用于取消动画
 */
export function startAnimationLoop(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    snowflakes: Snowflake[],
    image: HTMLImageElement
): number {
    function animate(): number {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        updateSnowflakes(snowflakes, canvas.width, canvas.height)
        renderSnowflakes(ctx, snowflakes, image)
        return requestAnimationFrame(animate)
    }

    return animate()
}
