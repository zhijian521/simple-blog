/**
 * Git 提交活动类型定义
 */

/** 每日提交统计 */
export interface DayCommit {
    date: string
    count: number
}

/** Git 活动数据响应 */
export interface GitActivityData {
    updated: string
    total: number
    commits: DayCommit[]
}
