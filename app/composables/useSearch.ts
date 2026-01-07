/**
 * 搜索功能 composable
 * 提供搜索弹窗状态管理和搜索提交处理
 */
export function useSearch() {
  const showSearch = ref(false)
  const searchQuery = ref('')
  const searchInputRef = ref<HTMLInputElement | null>(null)

  const toggleSearch = () => {
    showSearch.value = !showSearch.value
    if (showSearch.value) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
    }
  }

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    }
  }

  return {
    showSearch,
    searchQuery,
    searchInputRef,
    toggleSearch,
    handleSearch
  }
}

