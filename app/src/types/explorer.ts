export interface ExplorerNode {
    name: string
    path: string
    type: 'directory' | 'file'
    children?: ExplorerNode[]
    articleId?: string
}
