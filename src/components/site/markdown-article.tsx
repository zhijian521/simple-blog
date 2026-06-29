import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import { CodeBlock } from './code-block';

import 'highlight.js/styles/github.css';
import styles from './markdown-article.module.css';

export interface MarkdownArticleProps {
    /** Markdown 文本内容 */
    content: string;
}

/*== MarkdownArticle — 统一 MD 渲染组件 ==*/
export function MarkdownArticle({ content }: MarkdownArticleProps) {
    return (
        <div className={styles.body}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{ pre: CodeBlock }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
