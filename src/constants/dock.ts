import HomeIcon from '@/components/icons/HomeIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import GridIcon from '@/components/icons/GridIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import type { Component } from 'vue'

export interface DockItem {
    id: string
    icon: Component
    to?: string
    action?: () => void
}

// 创建 Dock 配置工厂函数
export function createDockItems(searchAction: () => void) {
    return {
        // 文章列表页 Dock 配置
        articleList: [
            { id: 'home', icon: HomeIcon, to: '/' },
            { id: 'search', icon: SearchIcon, action: searchAction },
            { id: 'list', icon: GridIcon, to: '/articles' },
        ] as DockItem[],

        // 文章详情页 Dock 配置
        articleDetail: [
            { id: 'home', icon: HomeIcon, to: '/' },
            { id: 'search', icon: SearchIcon, action: searchAction },
            { id: 'list', icon: GridIcon, to: '/articles' },
            { id: 'toc', icon: ListIcon },
        ] as DockItem[],
    }
}
