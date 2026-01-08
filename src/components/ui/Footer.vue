<!--
  Footer - 网站页脚组件

  用途：
  - 显示网站版权信息和 ICP 备案号
  - 提供网站底部统一布局

  功能：
  - 自动计算版权年份范围
  - 从配置读取 ICP 备案信息
  - 响应式布局适配移动端

  数据来源：
  - SITE_CONFIG (src/constants/index.ts)
-->
<template>
    <footer class="site-footer">
        <div class="site-footer-content">
            <p class="site-footer-copyright">
                Copyright © {{ startYear }}-{{ currentYear }} {{ owner }} |
                <a
                    :href="icpUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="site-footer-link"
                >
                    {{ icpNumber }}
                </a>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { SITE_CONFIG } from '@/constants'

const { icp, copyright } = SITE_CONFIG
const icpNumber = icp.number
const icpUrl = icp.url
const owner = copyright.owner
const startYear = copyright.startYear

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-xl);
    margin-top: auto;
    background: transparent;
}

.site-footer-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    text-align: center;
}

.site-footer-copyright {
    font-size: var(--font-size-xs);
    color: var(--color-text-light);
    margin: 0;
    font-weight: 390;
}

.site-footer-link {
    color: var(--color-text-light);
    text-decoration: none;
    transition: color var(--transition-fast) ease;
}

.site-footer-link:hover {
    color: var(--color-text);
}

@media (max-width: 768px) {
    .site-footer {
        padding: var(--spacing-md) var(--spacing-md);
    }

    .site-footer-copyright {
        font-size: var(--font-size-xs);
    }
}
</style>
