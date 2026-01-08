/**
 * Git 提交活动类型定义
 */

/** 每日提交统计 */
export interface DayCommit {
    /** 日期 (YYYY-MM-DD) */
    date: string
    /** 提交数量 */
    count: number
    /** 提交级别 (用于颜色深浅) */
    level: 0 | 1 | 2 | 3 | 4
}
