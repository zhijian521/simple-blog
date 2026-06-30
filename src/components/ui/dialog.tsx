'use client';

import { useEffect, useRef, useCallback } from 'react';
import { XIcon } from '@/components/ui/icons';
import { IconButton } from '@/components/ui/icon-button';

import styles from './dialog.module.css';

/*== Dialog 通用弹窗 — 遮罩 + 居中面板，直角边框匹配后台风格 ==*/
interface DialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    /** 面板最大宽度，默认 28rem */
    maxWidth?: string;
}

export default function Dialog({ open, title, onClose, children, maxWidth }: DialogProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    /* 焦点陷阱：Tab / Shift+Tab 循环在面板内 */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key !== 'Tab' || !panelRef.current) return;

        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, handleKeyDown]);

    /* 仅在弹窗打开瞬间自动聚焦第一个元素，后续重渲染不抢焦点 */
    const prevOpenRef = useRef(false);
    useEffect(() => {
        if (open && !prevOpenRef.current) {
            requestAnimationFrame(() => {
                const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                );
                focusable?.[0]?.focus();
            });
        }
        prevOpenRef.current = open;
    }, [open]);

    if (!open) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.backdrop} onClick={onClose} />
            <div
                className={styles.panel}
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                style={maxWidth ? { maxWidth } : undefined}
            >
                <div className={styles.header}>
                    <h3 className={styles.title} id="dialog-title">{title}</h3>
                    <IconButton icon={<XIcon />} onClick={onClose} size="small" aria-label="关闭" />
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>
    );
}
