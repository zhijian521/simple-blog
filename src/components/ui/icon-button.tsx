import Link from 'next/link';
import styles from './icon-button.module.css';

export interface IconButtonProps {
    /** 按钮图标，传入 SVG 元素 */
    icon: React.ReactNode;
    /** 按钮变体：default 默认 / danger 危险红 */
    variant?: 'default' | 'danger';
    /** 按钮尺寸：small 紧凑 / medium 中等 / default 默认 */
    size?: 'small' | 'medium' | 'default';
    /** 链接地址，传入则渲染为 Link */
    href?: string;
}

const SIZE_CLASS: Record<string, string | undefined> = {
    small: 'small',
    medium: 'medium',
    // default 不需要额外 class，基础样式即为 default 尺寸
};

/*== IconButton 图标按钮 — 正方形，纯图标无文字 ==*/
export function IconButton({ icon, variant = 'default', size = 'medium', href, className, ...props }: IconButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'>) {
    const variantClass = variant === 'default' ? '' : ` ${styles[variant]}`;
    const sizeClass = SIZE_CLASS[size];
    const cls = `${styles.button}${variantClass}${sizeClass ? ` ${styles[sizeClass]}` : ''}${className ? ` ${className}` : ''}`;

    if (href) {
        return (
            <Link className={cls} href={href} {...props}>
                {icon}
            </Link>
        );
    }

    return (
        <button className={cls} type="button" {...props}>
            {icon}
        </button>
    );
}
