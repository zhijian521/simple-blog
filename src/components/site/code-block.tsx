'use client';

import { useCallback, useState } from 'react';
import { CheckIcon, CopyIcon } from '@/components/ui/icons';

import styles from './code-block.module.css';

/*== 从 React children 中提取纯文本 ==*/
function extractText(children: React.ReactNode): string {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (children && typeof children === 'object' && 'props' in children) {
        return extractText((children as { props: { children: React.ReactNode } }).props.children);
    }
    return '';
}

/*== CodeBlock — 自定义代码块渲染：语法高亮 + 右上角浮动复制按钮 ==*/
export function CodeBlock({ children, className, ...rest }: React.ComponentPropsWithoutRef<'pre'>) {
    const code = extractText(children);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* 剪贴板不可用时静默失败 */
        }
    }, [code]);

    return (
        <div className={styles.codeBlock}>
            <button
                aria-label="复制代码"
                className={styles.copyBtn}
                onClick={handleCopy}
                type="button"
            >
                {copied
                    ? <CheckIcon className={styles.checkIcon} />
                    : <CopyIcon className={styles.copyIcon} />
                }
            </button>
            <pre className={`${styles.codeArea}${className ? ` ${className}` : ''}`} {...rest}>
                {children}
            </pre>
        </div>
    );
}