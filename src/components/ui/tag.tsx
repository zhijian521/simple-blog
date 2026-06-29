import styles from './tag.module.css';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** 标签样式变体：default 米黄底 / primary 朱砂淡底 / outlined 边框无底 */
    variant?: 'default' | 'primary' | 'outlined';
    /** 标签尺寸：mini 极小 / small 紧凑 / medium 中等 / default 默认 */
    size?: 'mini' | 'small' | 'medium' | 'default';
}

/*== Tag 标签 — 全站通用，支持 default/primary/outlined 三种变体 ==*/
const SIZE_CLASS: Record<string, string | undefined> = {
    mini: 'mini',
    small: 'small',
    medium: 'medium',
    // default 不需要额外 class，基础样式即为 default 尺寸
};

export function Tag({ variant = 'default', size = 'medium', className, ...props }: TagProps) {
    const variantClass = variant === 'default' ? '' : ` ${styles[variant]}`;
    const sizeClass = SIZE_CLASS[size];
    return (
        <span
            className={`${styles.tag}${variantClass}${sizeClass ? ` ${styles[sizeClass]}` : ''}${className ? ` ${className}` : ''}`}
            {...props}
        />
    );
}
