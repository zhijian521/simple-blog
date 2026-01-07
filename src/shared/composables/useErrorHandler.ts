/**
 * useErrorHandler
 * 全局错误处理 composable
 * 提供统一的错误处理和用户通知机制
 */

import { ref, computed, type Ref } from 'vue';
import type { AppError } from '@/shared/types';

export interface UseErrorHandlerReturn {
    error: Ref<AppError | null>;
    hasError: Ref<boolean>;
    setError: (error: AppError) => void;
    clearError: () => void;
    handleError: (err: unknown, context?: string) => void;
}

/**
 * 错误处理 composable
 */
export function useErrorHandler(): UseErrorHandlerReturn {
    const error = ref<AppError | null>(null);

    const hasError = computed(() => error.value !== null);

    /**
     * 设置错误
     */
    function setError(err: AppError): void {
        error.value = err;
    }

    /**
     * 清除错误
     */
    function clearError(): void {
        error.value = null;
    }

    /**
     * 处理任意错误并转换为 AppError 格式
     * @param err 原始错误
     * @param context 错误上下文信息
     */
    function handleError(err: unknown, context?: string): void {
        let appError: AppError;

        if (err instanceof Error) {
            appError = {
                code: 'RUNTIME_ERROR',
                message: err.message,
                details: {
                    context,
                    stack: err.stack,
                },
            };
        } else if (typeof err === 'string') {
            appError = {
                code: 'ERROR',
                message: err,
                details: { context },
            };
        } else if (isAppError(err)) {
            appError = err;
        } else {
            appError = {
                code: 'UNKNOWN_ERROR',
                message: 'An unknown error occurred',
                details: { context, originalError: err },
            };
        }

        error.value = appError;

        // 在控制台输出错误信息（生产环境可以接入日志服务）
        console.error(`[${context || 'App'}]`, appError);
    }

    /**
     * 类型守卫：检查是否为 AppError
     */
    function isAppError(obj: unknown): obj is AppError {
        return typeof obj === 'object' && obj !== null && 'code' in obj && 'message' in obj;
    }

    return {
        error,
        hasError,
        setError,
        clearError,
        handleError,
    };
}
