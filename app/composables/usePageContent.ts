/**
 * 页面内容获取 composable
 *
 * 根据当前路由 path 获取对应的 content 页面数据。
 * 设计：查询失败时返回 null（不抛错），避免刷新/SSR 时因内容缺失导致整页崩溃。
 */
export function usePageContent() {
  const route = useRoute()

  const key = computed(() => `page:${route.path}`)

  const { data, pending, error } = useAsyncData(
    key,
    async () => {
      try {
        const result = await queryCollection('content').path(route.path).first()
        return result ?? null
      } catch {
        return null
      }
    },
    {
      watch: [() => route.path],
      default: () => null,
    }
  )

  return {
    page: data,
    pending,
    error,
  }
}
