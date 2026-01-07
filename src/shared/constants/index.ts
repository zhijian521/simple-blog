/**
 * 应用常量定义
 * Application-wide constants
 */

/**
 * API 相关常量
 */
export const API_CONFIG = {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

/**
 * 分页默认值
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
} as const;
