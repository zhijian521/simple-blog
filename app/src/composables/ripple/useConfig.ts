/**
 * 水滴涟漪动画配置
 */
export const RIPPLE_CONFIG = {
    // 自动生成时间间隔
    GENERATION_INTERVAL: { min: 600, max: 1500 },

    // 尺寸相关
    BASE_MAX_RADIUS_RATIO: 0.18,
    INITIAL_RADIUS: { min: 2, max: 8 },

    // 生命周期
    LIFETIME: { min: 280, max: 420 },

    // 扩散速度
    BASE_SPEED: { min: 0.4, max: 0.7 },

    // 透明度
    OPACITY: { min: 0.08, max: 0.18 },

    // 强度阈值
    INTENSITY_THRESHOLDS: { small: 0.3, medium: 0.6 },

    // 波纹数量
    WAVE_COUNT: { small: 2, medium: 3, large: 4 },

    // 鼠标移动触发配置
    MOUSE_MOVE: {
        enabled: true,
        minDistance: 80,
        intensity: 0.2,
        maxCount: 8,
        throttleTime: 150, // 节流时间
    },

    // 高光效果
    HIGHLIGHT: {
        enabled: true,
        opacity: 0.12,
        offset: 0.15,
    },

    // 最大波纹数量
    MAX_RIPPLES: 15,

    // 动画参数
    PHASE_INCREMENT: 0.08, // 相位增量（控制波纹波动速度）
    MIN_OPACITY_THRESHOLD: 0.005, // 最小透明度阈值
    LIFE_DECAY_POWER: 0.7, // 生命周期衰减指数
    RADIUS_DECAY_POWER: 0.8, // 半径衰减指数
    WAVE_MODULATION_AMPLITUDE: 0.1, // 波纹调制幅度
    WAVE_SPACING_BASE: 12, // 波纹基础间距
    WAVE_SPACING_INTENSITY_FACTOR: 8, // 波纹间距强度系数
    CENTER_MAX_RADIUS_RATIO: 0.25, // 中心点最大半径比例
    GRADIENT_WIDTH_RATIO: 0.15, // 渐变宽度比例
} as const

// 尺寸倍数配置
export const RIPPLE_SIZE_MULTIPLIERS = {
    small: { min: 0.2, max: 0.5 },
    medium: { min: 0.5, max: 0.7 },
    large: { min: 0.7, max: 1.0 },
} as const

/**
 * 根据强度计算尺寸倍数
 * 强度越大，波纹扩散范围越大
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
 * 高强度产生更多波纹圈
 */
export function getWaveCount(intensity: number): number {
    const { INTENSITY_THRESHOLDS, WAVE_COUNT } = RIPPLE_CONFIG
    return intensity > INTENSITY_THRESHOLDS.medium ? WAVE_COUNT.large : WAVE_COUNT.medium
}
