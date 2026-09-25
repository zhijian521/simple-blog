<template>
    <div class="site-shell">
        <header class="site-header">
            <div class="site-header__inner">
                <NuxtLink class="site-name" to="/">知简</NuxtLink>
                <nav class="site-nav" aria-label="主导航">
                    <NuxtLink to="/">首页</NuxtLink>
                </nav>
            </div>
        </header>

        <main class="site-main">
            <slot />
        </main>

        <footer class="site-footer">
            <p>记录想法，持续构建。</p>
        </footer>
    </div>
</template>
