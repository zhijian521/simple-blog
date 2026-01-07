/**
 * API 配置
 * 集中管理 API 相关的配置信息
 */

export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
} as const;

/**
 * API 端点定义
 * 集中管理所有 API 路径，便于维护和重构
 */
export const API_ENDPOINTS = {
    // 认证相关
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
    },
    // 用户相关
    USERS: {
        LIST: '/users',
        DETAIL: (id: string | number) => `/users/${id}`,
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
    },
    // 文章相关（示例）
    ARTICLES: {
        LIST: '/articles',
        DETAIL: (id: string | number) => `/articles/${id}`,
        CREATE: '/articles',
        UPDATE: (id: string | number) => `/articles/${id}`,
        DELETE: (id: string | number) => `/articles/${id}`,
    },
} as const;
