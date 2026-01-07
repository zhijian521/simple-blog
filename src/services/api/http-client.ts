/**
 * HTTP 客户端
 * 封装 fetch API，提供统一的请求处理
 */

import type { ApiResponse } from '@/shared/types';
import { API_CONFIG } from '../config/api.config';

export interface HttpClientConfig extends RequestInit {
    timeout?: number;
    params?: Record<string, string | number>;
}

/**
 * HTTP 客户端类
 * 提供统一的 API 请求方法
 */
export class HttpClient {
    private baseURL: string;
    private defaultTimeout: number;

    constructor(config: typeof API_CONFIG) {
        this.baseURL = config.baseURL;
        this.defaultTimeout = config.timeout;
    }

    /**
     * 构建完整 URL
     */
    private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
        const url = new URL(endpoint, this.baseURL);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        return url.toString();
    }

    /**
     * 处理响应
     */
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText || 'Network error',
            }));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    /**
     * 通用请求方法
     */
    private async request<T>(
        endpoint: string,
        config: HttpClientConfig = {},
    ): Promise<ApiResponse<T>> {
        const { timeout = this.defaultTimeout, params, ...restConfig } = config;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const url = this.buildUrl(endpoint, params);
            const response = await fetch(url, {
                ...restConfig,
                signal: controller.signal,
            });

            return await this.handleResponse<T>(response);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * GET 请求
     */
    async get<T>(endpoint: string, config?: HttpClientConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    /**
     * POST 请求
     */
    async post<T>(
        endpoint: string,
        data?: unknown,
        config?: HttpClientConfig,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT 请求
     */
    async put<T>(
        endpoint: string,
        data?: unknown,
        config?: HttpClientConfig,
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE 请求
     */
    async delete<T>(endpoint: string, config?: HttpClientConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

/**
 * 导出单例实例
 */
export const httpClient = new HttpClient(API_CONFIG);
