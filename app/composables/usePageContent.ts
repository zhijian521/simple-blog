import { useRoute, useAsyncData, queryCollection } from '#imports'

export function usePageContent() {
  const route = useRoute()

  const { data, pending, error } = useAsyncData(
    'page-' + route.path,
    () => queryCollection('content').path(route.path).first(),
    { watch: [() => route.path] }
  )

  return {
    page: data,
    pending,
    error
  }
}

