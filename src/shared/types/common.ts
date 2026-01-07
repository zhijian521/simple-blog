/**
 * 通用类型定义
 * Shared types used across the application
 */

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    success: boolean;
}

/**
 * 分页参数
 */
export interface PaginationParams {
    page: number;
    pageSize: number;
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * 实体基础接口
 */
export interface Entity {
    id: string | number;
}

/**
 * 错误类型
 */
export interface AppError {
    code: string;
    message: string;
    details?: unknown;
}
