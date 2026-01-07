/**
 * useLocalStorage
 * 本地存储管理的 composable
 * 提供类型安全的 localStorage 操作
 */

import { ref, watch, type Ref } from 'vue';
import { STORAGE_KEYS } from '@/shared/constants';

export interface UseLocalStorageReturn<T> {
    value: Ref<T>;
    setValue: (val: T) => void;
    removeValue: () => void;
}

/**
 * 本地存储管理 composable
 * @param key 存储键名
 * @param initialValue 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
    // 从 localStorage 读取初始值
    const storedValue = localStorage.getItem(key);
    const value = ref<T>(
        storedValue !== null ? (JSON.parse(storedValue) as T) : initialValue,
    ) as Ref<T>;

    /**
     * 设置值
     */
    function setValue(val: T): void {
        value.value = val;
    }

    /**
     * 移除值
     */
    function removeValue(): void {
        value.value = initialValue;
        localStorage.removeItem(key);
    }

    // 监听值的变化并同步到 localStorage
    watch(
        value,
        (newValue) => {
            if (newValue === undefined || newValue === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(newValue));
            }
        },
        { deep: true },
    );

    return {
        value,
        setValue,
        removeValue,
    };
}

/**
 * 预设的 localStorage hooks
 */
export function useAuthToken() {
    return useLocalStorage<string>(STORAGE_KEYS.TOKEN, '');
}

export function useAppTheme() {
    return useLocalStorage<string>(STORAGE_KEYS.THEME, 'light');
}

export function useAppLanguage() {
    return useLocalStorage<string>(STORAGE_KEYS.LANGUAGE, 'zh-CN');
}
