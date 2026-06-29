import React from 'react';

/*== 图标组件属性 ==*/
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    className?: string;
}

/*== 图标组件的函数类型，用于 NavSubItem 等 ==*/
export type IconComponent = React.ComponentType<IconProps>;

/*============================================================================
  图标映射 — SVG inner content

  所有图标共用 viewBox="0 0 24 24"。
  stroke 图标: fill="none" stroke="currentColor" strokeWidth={2}
  fill 图标: fill="currentColor" (仅 github)
============================================================================*/

/*-- stroke 类型图标的 inner SVG，按 key 索引 --*/
const STROKE_ICONS: Record<string, React.ReactNode> = {
    'arrow-down': <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />,
    'arrow-left': <path d="m12 19-7-7 7-7M19 12H5" strokeLinecap="round" strokeLinejoin="round" />,
    'arrow-right': <path d="M5 12h14m0 0l-7-7m7 7l-7 7" strokeLinecap="round" strokeLinejoin="round" />,
    'arrow-up': <path d="m5 12 7-7 7 7M12 5v14" strokeLinecap="round" strokeLinejoin="round" />,
    book: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />,
    check: <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
    code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
    copy: (
        <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
    ),
    'external-link': <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />,
    home: <path d="M15 21v-6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v6M3 10l9-7 9 7M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />,
    list: (
        <>
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
        </>
    ),
    mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />,
    x: <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />,
};

/*-- fill 类型图标（仅 github） --*/
const FILL_ICONS: Record<string, React.ReactNode> = {
    github: <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />,
};

/*============================================================================
  图标组件 — 按 key 渲染对应 SVG
============================================================================*/

export function Icon({ name, className, ...props }: IconProps & { name: string }) {
    const fillChildren = FILL_ICONS[name];
    if (fillChildren) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
                {fillChildren}
            </svg>
        );
    }

    const strokeChildren = STROKE_ICONS[name];
    if (strokeChildren) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                {strokeChildren}
            </svg>
        );
    }

    return null;
}

/*============================================================================
  便捷命名导出 — 兼容 import { XxxIcon } 用法

  ponytail: 保持向后兼容的具名导出。后续新增图标直接加 STROKE_ICONS / FILL_ICONS
  条目 + 对应 makeIcon 导出即可，无需新增文件。
============================================================================*/

/*-- 生成具名图标组件 --*/
function makeIcon(name: string): React.ComponentType<IconProps> {
    const Component = (props: IconProps) => <Icon name={name} {...props} />;
    Component.displayName = `${name.replace(/(^|-)(\w)/g, (_, _s, c) => c.toUpperCase())}Icon`;
    return Component;
}

export const ArrowDownIcon = makeIcon('arrow-down');
export const ArrowLeftIcon = makeIcon('arrow-left');
export const ArrowRightIcon = makeIcon('arrow-right');
export const ArrowUpIcon = makeIcon('arrow-up');
export const BookIcon = makeIcon('book');
export const CheckIcon = makeIcon('check');
export const CodeIcon = makeIcon('code');
export const CopyIcon = makeIcon('copy');
export const ExternalLinkIcon = makeIcon('external-link');
export const GitHubIcon = makeIcon('github');
export const HomeIcon = makeIcon('home');
export const ListIcon = makeIcon('list');
export const MailIcon = makeIcon('mail');
export const MenuIcon = makeIcon('menu');
export const XIcon = makeIcon('x');
