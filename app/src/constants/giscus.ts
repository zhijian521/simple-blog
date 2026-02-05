import { GISCUS_CONFIG } from '@config/giscus.config'

export { GISCUS_CONFIG }

/**
 * 检查 Giscus 是否已配置
 */
export function isGiscusConfigured(): boolean {
    return !!(GISCUS_CONFIG.repo && GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId)
}
