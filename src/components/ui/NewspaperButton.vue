<!--
  NewspaperButton - 报纸排版按钮组件

  位于首页右上角搜索按钮左侧，点击跳转到报纸排版页面
  液态透明玻璃效果，与 SearchButton 保持一致的样式
-->
<template>
    <router-link to="/newspaper" class="newspaper-button" title="报纸排版" aria-label="报纸排版">
        <svg
            class="newspaper-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            fill="currentColor"
        >
            <path
                d="M928 213.333333h-74.666667V96a53.393333 53.393333 0 0 0-53.333333-53.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333333v704a53.393333 53.393333 0 0 0 53.333333 53.333333h117.333333v74.666667a53.393333 53.393333 0 0 0 53.333334 53.333333h661.333333a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334zM96 810.666667a10.666667 10.666667 0 0 1-10.666667-10.666667V96a10.666667 10.666667 0 0 1 10.666667-10.666667h704a10.666667 10.666667 0 0 1 10.666667 10.666667v704a10.666667 10.666667 0 0 1-10.666667 10.666667z m842.666667 117.333333a10.666667 10.666667 0 0 1-10.666667 10.666667H266.666667a10.666667 10.666667 0 0 1-10.666667-10.666667v-74.666667h544a53.393333 53.393333 0 0 0 53.333333-53.333333V256h74.666667a10.666667 10.666667 0 0 1 10.666667 10.666667z m-256-309.333333a21.333333 21.333333 0 0 1-21.333334 21.333333H234.666667a21.333333 21.333333 0 0 1 0-42.666667h426.666666a21.333333 21.333333 0 0 1 21.333334 21.333334z m0-213.333334a21.333333 21.333333 0 0 1-21.333334 21.333334H533.333333a21.333333 21.333333 0 0 1 0-42.666667h128a21.333333 21.333333 0 0 1 21.333334 21.333333z m0-170.666666a21.333333 21.333333 0 0 1-21.333334 21.333333H533.333333a21.333333 21.333333 0 0 1 0-42.666667h128a21.333333 21.333333 0 0 1 21.333334 21.333334zM213.333333 448V234.666667a21.333333 21.333333 0 0 1 38-13.333334l132.666667 165.853334V234.666667a21.333333 21.333333 0 0 1 42.666667 0v213.333333a21.333333 21.333333 0 0 1-38 13.333333L256 295.48V448a21.333333 21.333333 0 0 1-42.666667 0z"
            />
        </svg>
    </router-link>
</template>

<style scoped>
.newspaper-button {
    position: fixed;
    top: var(--spacing-lg);
    right: calc(var(--spacing-lg) + 48px); /* 搜索按钮左侧，40px 宽度 + 8px 间距 */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    z-index: 100;
    transition: background 0.2s ease;
}

.newspaper-button:hover {
    background: rgba(0, 0, 0, 0.06);
}

.newspaper-button:active {
    background: rgba(0, 0, 0, 0.1);
}

.newspaper-icon {
    width: 20px;
    height: 20px;
    color: var(--color-text-light);
    flex-shrink: 0;
}

/* 移动端响应式 */
@media (max-width: 768px) {
    .newspaper-button {
        top: var(--spacing-md);
        right: calc(var(--spacing-md) + 44px); /* 搜索按钮左侧，36px 宽度 + 8px 间距 */
        width: 36px;
        height: 36px;
    }

    .newspaper-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
