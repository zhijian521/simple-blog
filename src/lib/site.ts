export interface NavItem {
    href: string;
    label: string;
    match: 'exact' | 'prefix';
}

/*============================================================================
  站点全局配置

  本文件是站点唯一配置入口，集中管理：
  - 站点元数据（标题、描述、关键词、SEO）
  - 路由路径常量
  - 前台导航结构

  修改原则：
  - 标题/描述/关键词 → 改 SITE_METADATA，全局自动生效
  - 新增页面路由 → 改 APP_ROUTES，导航引用自动同步
  - 新增导航项 → 改 PUBLIC_NAV_ITEMS
  - 不要在页面组件中硬编码标题/路径，统一引用此文件
============================================================================*/

/*== 站点元数据 — SEO、OG、JSON-LD 的数据源 ==*/
export const SITE_METADATA = {
    /*-- 英文品牌名 --*/
    name: 'Zhijian',
    /*-- 中文站名，用于 JSON-LD、siteName 等结构化数据 --*/
    title: '知简',
    /*-- 品牌标题，主页 <title> 直接使用，根布局 template 后缀，改此一处全站生效 --*/
    brandTitle: 'Zhijian博客 - 简静造物',
    /*-- 全局描述，主页 <meta description> / OG / Twitter / JSON-LD --*/
    description: 'Zhijian的个人技术博客 — 追求简洁设计与美好事物，以代码与文字安静造物。涵盖前端开发、React、Next.js、TypeScript、AI编程、Vibe Coding、全栈实践与Agent开发。',
    /*-- 站点 URL，用于 canonical / OG url --*/
    siteUrl: 'https://www.yuwb.dev',
    /*-- OG / Twitter 区域标识 --*/
    locale: 'zh_CN',
    /*-- OG 默认分享图（相对路径，metadataBase 自动补全绝对 URL） --*/
    ogImage: '/images/og-default.webp',
    /*-- 作者名，metadata.authors / JSON-LD Person --*/
    author: 'Zhi Jian',
    /*-- 文章列表页标题前缀 --*/
    blogTitle: '文章',
    /*-- 文章列表页描述，/blog 页 <meta description> / OG / Twitter --*/
    blogDescription:
        'Zhijian的技术博客，追求简洁设计与美好事物，安静造物。分享前端开发、React、Next.js、TypeScript、AI编程、Vibe Coding、Agent开发与全栈实践。',
    /*-- 全站关键词，详情页自动追加文章标签和分类名 --*/
    keywords: [
        '简静造物',
        '知简',
        'Zhijian',
        '前端开发',
        '全栈开发',
        '全栈实践',
        'React',
        'Next.js',
        'TypeScript',
        'CSS Modules',
        '简约设计',
        '技术博客',
        '个人博客',
        'AI编程',
        'Vibe Coding',
        'Agent开发',
        'Claude Code',
    ],
} as const;

/*== 路由路径常量 — 全站路由统一引用，避免硬编码 ==*/
export const APP_ROUTES = {
    home: '/',
    blog: '/blog',
} as const;

/*== 前台导航：顶部导航栏菜单项 ==*/
export const PUBLIC_NAV_ITEMS: NavItem[] = [
    { href: APP_ROUTES.home, label: '首页', match: 'exact' },
    { href: APP_ROUTES.blog, label: '文章', match: 'prefix' },
];
