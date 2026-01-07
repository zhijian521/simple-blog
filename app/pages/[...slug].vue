<script setup lang="ts">
const { page, pending, error } = usePageContent()
</script>

<template>
  <div class="page">
    <div v-if="pending" class="page__state">内容加载中...</div>
    <Alert
      v-else-if="error || !page"
      color="red"
      class="page__state"
    >
      未找到页面或加载出错。
    </Alert>
    <ContentRenderer
      v-else
      :value="page"
    />
  </div>
</template>

<style scoped>
.page__state {
  padding: 12px 14px;
  background: #fef9c3;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
}
</style>
