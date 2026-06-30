import type { Metadata } from 'next';
import PublicChrome from '@/components/site/public-chrome';
import { SITE_METADATA } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_METADATA.siteUrl),
    title: {
        default: SITE_METADATA.brandTitle,
        template: `%s - ${SITE_METADATA.brandTitle}`,
    },
    description: SITE_METADATA.description,
    keywords: [...SITE_METADATA.keywords],
    authors: [{ name: SITE_METADATA.author }],
    creator: SITE_METADATA.author,
    publisher: SITE_METADATA.author,
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: '32x32' },
            { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [{ url: '/images/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.json',
    openGraph: {
        type: 'website',
        locale: SITE_METADATA.locale,
        siteName: SITE_METADATA.title,
        images: [{ url: SITE_METADATA.ogImage, alt: SITE_METADATA.title }],
    },
    twitter: {
        card: 'summary_large_image',
    },
    alternates: {
        canonical: '/',
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='zh-CN'>
            <body>
                <PublicChrome>{children}</PublicChrome>
            </body>
        </html>
    );
}
