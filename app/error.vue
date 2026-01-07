<script setup lang="ts">
interface Props {
  error: {
    statusCode: number
    statusMessage: string
    message?: string
  }
}

const props = defineProps<Props>()
const route = useRoute()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__title">{{ props.error.statusCode || '404' }}</h1>
      <p class="error-page__message">
        {{ props.error.statusMessage || props.error.message || '页面未找到' }}
      </p>
      <div class="error-page__actions">
        <NuxtLink to="/" class="error-page__btn">返回首页</NuxtLink>
        <NuxtLink to="/articles" class="error-page__btn error-page__btn--secondary">查看文章</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #fafafa;
}

.error-page__content {
  text-align: center;
  max-width: 500px;
}

.error-page__title {
  font-size: 72px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px;
  line-height: 1;
}

.error-page__message {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 32px;
}

.error-page__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-page__btn {
  display: inline-block;
  padding: 12px 24px;
  background: #1f2937;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.error-page__btn:hover {
  background: #111827;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error-page__btn--secondary {
  background: white;
  color: #1f2937;
  border: 2px solid #1f2937;
}

.error-page__btn--secondary:hover {
  background: #f3f4f6;
}
</style>

