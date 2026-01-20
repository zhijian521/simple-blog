/**
 * 共享类型定义
 */

export type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
export type Priority =
    | '0.0'
    | '0.1'
    | '0.2'
    | '0.3'
    | '0.4'
    | '0.5'
    | '0.6'
    | '0.7'
    | '0.8'
    | '0.9'
    | '1.0'

export interface SitemapPage {
    loc: string
    changefreq: ChangeFreq
    priority: Priority
}

export interface Article {
    id: string
    date: string
}

export interface FrontMatterAttributes {
    id?: string
    date?: string
    title?: string
    description?: string
    excerpt?: string
    category?: string
    tags?: string[]
    author?: string
    [key: string]: unknown
}

export interface Commit {
    date: string
    count: number
}

export interface GitActivityData {
    updated: string
    total: number
    commits: Commit[]
}
