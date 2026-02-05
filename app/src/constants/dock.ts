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
export function createDockItems(
    searchAction: () => void,
    listAction: () => void,
    tocAction?: () => void
) {
    return {
        // 文章列表页 Dock 配置
        articleList: [
            { id: 'list', icon: GridIcon, action: listAction },
            { id: 'search', icon: SearchIcon, action: searchAction },
            { id: 'home', icon: HomeIcon, to: '/' },
        ] as DockItem[],

        // 文章详情页 Dock 配置
        articleDetail: [
            { id: 'toc', icon: ListIcon, action: tocAction },
            { id: 'list', icon: GridIcon, action: listAction },
            { id: 'search', icon: SearchIcon, action: searchAction },
            { id: 'home', icon: HomeIcon, to: '/' },
        ] as DockItem[],
    }
}
