/**
 * 文章列表数据获取 composable
 *
 * 职责：从 content 集合中读取文章条目，并做必要的过滤与排序。
 * 注意：这里按路径排序仅用于提供稳定展示顺序；如后续有日期字段，应改为按日期排序。
 */
export function useArticles() {
  interface Article {
    _path: string
    title?: string
    description?: string
  }

  const { data: articles, pending, error } = useAsyncData<Article[]>(
    'articles',
    async () => {
      const list = await queryCollection('content').all()

      return (list ?? [])
        .filter((item): item is Article => typeof item?._path === 'string' && item._path.startsWith('/articles/'))
        .sort((a, b) => a._path.localeCompare(b._path))
    },
    {
      default: () => [],
    }
  )

  return {
    articles,
    pending,
    error,
  }
}
