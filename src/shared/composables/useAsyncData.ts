/**
 * useAsyncData
 * 通用的异步数据管理 composable
 * 提供加载状态、错误处理和数据管理的统一模式
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { AppError } from '@/shared/types';

export interface UseAsyncDataOptions<T> {
    initialData?: T | null;
    onSuccess?: (data: T) => void;
    onError?: (error: AppError) => void;
}

export interface UseAsyncDataReturn<T> {
    data: Ref<T | null>;
    error: Ref<AppError | null>;
    isLoading: Ref<boolean>;
    isSuccess: ComputedRef<boolean>;
    execute: (asyncFn: () => Promise<T>) => Promise<void>;
    reset: () => void;
}

/**
 * 异步数据管理 composable
 * @param options 配置选项
 */
export function useAsyncData<T = unknown>(
    options: UseAsyncDataOptions<T> = {},
): UseAsyncDataReturn<T> {
    const { initialData = null, onSuccess, onError } = options;

    const data = ref<T | null>(initialData) as Ref<T | null>;
    const error = ref<AppError | null>(null) as Ref<AppError | null>;
    const isLoading = ref(false) as Ref<boolean>;

    const isSuccess = computed(() => !isLoading.value && !error.value && data.value !== null);

    /**
     * 执行异步操作
     * @param asyncFn 异步函数
     */
    async function execute(asyncFn: () => Promise<T>): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            const result = await asyncFn();
            data.value = result;
            onSuccess?.(result);
        } catch (err) {
            const appError: AppError = {
                code: 'ASYNC_ERROR',
                message: err instanceof Error ? err.message : 'Unknown error occurred',
                details: err,
            };
            error.value = appError;
            onError?.(appError);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * 重置状态
     */
    function reset(): void {
        data.value = initialData;
        error.value = null;
        isLoading.value = false;
    }

    return {
        data,
        error,
        isLoading,
        isSuccess,
        execute,
        reset,
    };
}
