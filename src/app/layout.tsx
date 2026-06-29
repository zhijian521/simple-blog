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
    openGraph: {
        type: 'website',
        locale: SITE_METADATA.locale,
        siteName: SITE_METADATA.title,
        images: [{ url: SITE_METADATA.ogImage, alt: SITE_METADATA.title }],
    },
    twitter: {
        card: 'summary_large_image',
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
