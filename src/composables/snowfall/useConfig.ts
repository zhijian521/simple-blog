import type { Snowflake } from '@/types/snowflake'

/**
 * 雪花动画配置
 */
export const SNOWFALL_CONFIG = {
    // 尺寸配置
    SMALL_RADIUS: 4,
    LARGE_RADIUS: 18,

    // 速度配置
    SMALL_SPEED: 0.2,
    LARGE_SPEED: 0.4,

    // 物理效果
    WIND_STRENGTH: 0.3,
    ROTATION_SPEED: 0.02,

    // 边界检测容差（超出此距离视为离开屏幕）
    BOUNDARY_TOLERANCE: 10,

    // 响应式雪花数量配置
    COUNT_BREAKPOINTS: {
        mobile: 30, // < 768px
        tablet: 45, // 768px - 1024px
        desktop: 55, // 1024px - 1280px
        large: 65, // >= 1280px
    },

    // 响应式断点（与 CSS variables 保持一致）
    BREAKPOINTS: {
        SM: 640,
        MD: 768,
        LG: 1024,
        XL: 1280,
    },
} as const

/**
 * 根据屏幕宽度计算合适的雪花数量
 * 使用与 CSS 响应式断点一致的阈值
 */
export function getSnowflakeCount(screenWidth: number): number {
    const { COUNT_BREAKPOINTS, BREAKPOINTS } = SNOWFALL_CONFIG

    if (screenWidth < BREAKPOINTS.MD) {
        return COUNT_BREAKPOINTS.mobile
    } else if (screenWidth < BREAKPOINTS.LG) {
        return COUNT_BREAKPOINTS.tablet
    } else if (screenWidth < BREAKPOINTS.XL) {
        return COUNT_BREAKPOINTS.desktop
    } else {
        return COUNT_BREAKPOINTS.large
    }
}

/**
 * 创建单个雪花对象
 * @param canvasWidth - 画布宽度
 * @param canvasHeight - 画布高度
 * @param options - 配置选项
 * @returns 雪花对象
 */
export function createSnowflake(
    canvasWidth: number,
    canvasHeight: number,
    options?: { fromTop?: boolean }
): Snowflake {
    const { SMALL_RADIUS, LARGE_RADIUS, SMALL_SPEED, LARGE_SPEED, WIND_STRENGTH, ROTATION_SPEED } =
        SNOWFALL_CONFIG

    // 基于半径计算速度，大雪花下落更快
    const radius = SMALL_RADIUS + Math.random() * (LARGE_RADIUS - SMALL_RADIUS)
    const speed =
        SMALL_SPEED +
        ((radius - SMALL_RADIUS) / (LARGE_RADIUS - SMALL_RADIUS)) * (LARGE_SPEED - SMALL_SPEED)

    // 初始 Y 坐标：fromTop 为 true 时从顶部上方开始，否则随机分布在整个屏幕
    const startY = options?.fromTop
        ? Math.random() * canvasHeight - canvasHeight
        : Math.random() * canvasHeight

    return {
        x: Math.random() * canvasWidth,
        y: startY,
        radius,
        speed,
        wind: (Math.random() - 0.5) * WIND_STRENGTH,
        opacity: 0.5 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * ROTATION_SPEED,
    }
}
