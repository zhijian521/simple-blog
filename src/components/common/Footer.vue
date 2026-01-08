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

@media (max-width: var(--breakpoint-md)) {
    .site-footer {
        padding: var(--spacing-md) var(--spacing-md);
    }

    .site-footer-copyright {
        font-size: var(--font-size-xs);
    }
}
</style>
