/**
 * App Store
 * 应用全局状态管理
 * 管理应用级别的状态，如加载状态、错误状态、主题等
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
    // State
    const isLoading = ref(false);
    const globalError = ref<string | null>(null);
    const theme = ref<'light' | 'dark'>('light');
    const isSidebarOpen = ref(false);

    // Getters
    const hasGlobalError = computed(() => globalError.value !== null);

    // Actions
    /**
     * 设置全局加载状态
     */
    function setLoading(loading: boolean) {
        isLoading.value = loading;
    }

    /**
     * 设置全局错误
     */
    function setError(error: string | null) {
        globalError.value = error;
    }

    /**
     * 清除全局错误
     */
    function clearError() {
        globalError.value = null;
    }

    /**
     * 切换主题
     */
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
    }

    /**
     * 设置主题
     */
    function setTheme(newTheme: 'light' | 'dark') {
        theme.value = newTheme;
    }

    /**
     * 切换侧边栏
     */
    function toggleSidebar() {
        isSidebarOpen.value = !isSidebarOpen.value;
    }

    /**
     * 关闭侧边栏
     */
    function closeSidebar() {
        isSidebarOpen.value = false;
    }

    /**
     * 打开侧边栏
     */
    function openSidebar() {
        isSidebarOpen.value = true;
    }

    return {
        // State
        isLoading,
        globalError,
        theme,
        isSidebarOpen,
        // Getters
        hasGlobalError,
        // Actions
        setLoading,
        setError,
        clearError,
        toggleTheme,
        setTheme,
        toggleSidebar,
        closeSidebar,
        openSidebar,
    };
});
