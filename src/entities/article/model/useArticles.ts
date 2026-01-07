/**
 * 文章数据（临时 mock）
 *
 * 说明：Nuxt Content 已移除。为了让路由/页面先跑通，这里用静态数据占位。
 * 后续可替换为：
 * - 从 /public/articles.json 拉取
 * - 从本地 markdown 读取（需要额外 Vite 插件）
 * - 从后端 API 拉取
 */
import { computed, type ComputedRef, type Ref, ref } from 'vue'

export interface Article {
  slug: string
  title: string
  description?: string
}

const MOCK: Article[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    description: '第一篇文章（占位数据）',
  },
]

export function useArticles(): {
  articles: Ref<Article[]>
} {
  const articles = ref<Article[]>(MOCK)

  return {
    articles,
  }
}

export function useArticleBySlug(slug: ComputedRef<string> | Ref<string>) {
  const { articles } = useArticles()

  const article = computed(() => {
    const s = slug.value
    if (!s) return null
    return articles.value.find((a) => a.slug === s) ?? null
  })

  return {
    article,
  }
}

