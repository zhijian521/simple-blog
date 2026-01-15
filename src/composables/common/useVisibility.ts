/**
 * 页面可见性监听 Composable
 *
 * 用于优化性能，在页面不可见时暂停动画/定时器等资源消耗
 *
 * @param onVisible - 页面变为可见时的回调
 * @param onHidden - 页面变为不可见时的回调
 * @returns 清理函数
 */
export function useVisibilityChange(onVisible: () => void, onHidden: () => void): () => void {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            onVisible()
        } else {
            onHidden()
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
}
