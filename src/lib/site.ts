export interface NavItem {
  href: string;
  label: string;
  match: 'exact' | 'prefix';
}

export const SITE_METADATA = {
  name: 'Zhijian',
  title: '知简',
  brandTitle: 'Zhijian博客 - 简静造物',
  description: 'Zhijian的个人技术博客 — 追求简洁设计与美好事物，以代码与文字安静造物。',
  siteUrl: 'https://www.yuwb.dev',
  locale: 'zh_CN',
  ogImage: '/images/og-default.webp',
  author: 'Zhi Jian',
  blogTitle: '文章',
  blogDescription: 'Zhijian的技术博客，追求简洁设计与美好事物，安静造物。',
  keywords: ['知简', 'Zhijian', '前端开发', '全栈开发', '技术博客', '个人博客'],
} as const;

export const APP_ROUTES = {
  home: '/',
  blog: '/blog',
} as const;

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: APP_ROUTES.home, label: '首页', match: 'exact' },
  { href: APP_ROUTES.blog, label: '文章', match: 'prefix' },
];
