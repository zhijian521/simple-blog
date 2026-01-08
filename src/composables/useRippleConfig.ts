/**
 * 水滴涟漪动画配置
 */

export const RIPPLE_CONFIG = {
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
} as const

export const RIPPLE_SIZE_MULTIPLIERS = {
    small: { min: 0.2, max: 0.5 },
    medium: { min: 0.5, max: 0.7 },
    large: { min: 0.7, max: 1.0 },
} as const

/**
 * 根据强度计算尺寸倍数
 */
export function getSizeMultiplier(intensity: number): number {
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

/**
 * 根据强度获取波纹数量
 */
export function getWaveCount(intensity: number): number {
    const { INTENSITY_THRESHOLDS, WAVE_COUNT } = RIPPLE_CONFIG
    return intensity > INTENSITY_THRESHOLDS.medium ? WAVE_COUNT.large : WAVE_COUNT.medium
}
