<template>
    <div class="not-found-page">
        <div class="not-found-content">
            <h1 class="error-code">404</h1>
            <h2 class="error-title">页面未找到</h2>
            <p class="error-message">抱歉，您访问的页面不存在</p>
            <div class="error-actions">
                <router-link to="/" class="btn-primary">返回首页</router-link>
                <router-link to="/articles" class="btn-secondary">浏览文章</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found-page {
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
}

.not-found-content {
    text-align: center;
    max-width: 500px;
}

.error-code {
    font-size: 120px;
    font-weight: var(--font-weight-bold);
    color: var(--color-accent);
    line-height: 1;
    margin-bottom: var(--spacing-lg);
    opacity: 0.3;
}

.error-title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
}

.error-message {
    font-size: var(--font-size-lg);
    color: var(--color-text-light);
    margin-bottom: var(--spacing-2xl);
}

.error-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
    display: inline-block;
    padding: var(--spacing-btn-vertical) var(--spacing-xl);
    text-decoration: none;
    border-radius: var(--radius-sm);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-base);
}

.btn-primary {
    background: var(--color-accent);
    color: var(--color-bg);
}

.btn-primary:hover {
    background: var(--color-text);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    background: var(--color-border);
    border-color: var(--color-accent);
}

@media (max-width: 768px) {
    .error-code {
        font-size: 80px;
    }

    .error-title {
        font-size: var(--font-size-2xl);
    }

    .error-message {
        font-size: var(--font-size-base);
    }

    .error-actions {
        flex-direction: column;
    }
}
</style>
