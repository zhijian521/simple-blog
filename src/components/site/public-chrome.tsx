'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { MenuIcon, XIcon } from '@/components/ui/icons';
import { APP_ROUTES, PUBLIC_NAV_ITEMS, SITE_METADATA } from '@/lib/site';
import { isNavItemActive } from '@/lib/utils';
import styles from './public-chrome.module.css';

interface PublicChromeProps {
    children: React.ReactNode;
}

/*== 前台公共壳层：统一提供头部导航和页脚 ==*/
export default function PublicChrome({ children }: PublicChromeProps) {
    const pathname = usePathname();
    const isHomePage = pathname === APP_ROUTES.home;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isHomePage) return;
        function onScroll() {
            setIsScrolled(window.scrollY > 10);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isHomePage]);

    useEffect(() => {
        if (!isMobileNavOpen) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                mobileNavRef.current?.contains(target) ||
                mobileTriggerRef.current?.contains(target)
            ) {
                return;
            }
            setIsMobileNavOpen(false);
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key !== 'Escape') return;
            setIsMobileNavOpen(false);
            mobileTriggerRef.current?.focus();
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMobileNavOpen]);

    function toggleMobileNav() {
        setIsMobileNavOpen((prev) => !prev);
    }

    function closeMobileNav() {
        setIsMobileNavOpen(false);
        mobileTriggerRef.current?.focus();
    }

    return (
        <div className={`${styles.root} ${isHomePage ? styles.rootTransparent : ''}`}>
            <header className={`${isHomePage ? styles.headerHome : styles.headerInner} ${isScrolled ? styles.headerScrolled : ''}`}>
                <div className={styles.headerContainer}>
                    <Link className={styles.brand} href={APP_ROUTES.home}>
                        <Image alt={SITE_METADATA.name} height={32} src='/images/logo.webp' width={32} />
                        <span className={styles.brandText}>{SITE_METADATA.name}</span>
                    </Link>

                    <div className={styles.navArea}>
                        <nav aria-label='站点主导航' className={styles.nav}>
                            {PUBLIC_NAV_ITEMS.map((item) => {
                                const isActive = isNavItemActive(pathname, item.href, item.match);

                                return (
                                    <Link
                                        className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                                        href={item.href}
                                        key={item.label}
                                    >
                                        {item.label}
                                        {isActive ? <span aria-hidden className={styles.navUnderline} /> : null}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className={styles.mobileNavWrapper}>
                            <button
                                aria-controls='public-mobile-nav'
                                aria-expanded={isMobileNavOpen}
                                aria-label={isMobileNavOpen ? '关闭导航菜单' : '打开导航菜单'}
                                className={`${styles.mobileMenu} ${isMobileNavOpen ? styles.mobileMenuOpen : ''}`}
                                onClick={toggleMobileNav}
                                ref={mobileTriggerRef}
                                type='button'
                            >
                                <MenuIcon className={styles.mobileMenuIcon} />
                            </button>

                            {isMobileNavOpen ? (
                                <div
                                    aria-label='移动端导航菜单'
                                    className={styles.mobilePanel}
                                    id='public-mobile-nav'
                                    ref={mobileNavRef}
                                    role='dialog'
                                >
                                    <div className={styles.mobilePanelHeader}>
                                        <span className={styles.mobilePanelTitle}>导航</span>
                                        <button
                                            aria-label='关闭导航菜单'
                                            className={styles.mobileClose}
                                            onClick={closeMobileNav}
                                            type='button'
                                        >
                                            <XIcon className={styles.mobileCloseIcon} />
                                        </button>
                                    </div>

                                    <nav aria-label='移动端站点导航' className={styles.mobileNav}>
                                        {PUBLIC_NAV_ITEMS.map((item) => {
                                            const isActive = isNavItemActive(pathname, item.href, item.match);

                                            return (
                                                <Link
                                                    className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                                                    href={item.href}
                                                    key={item.label}
                                                >
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.main}>{children}</div>

            <footer className={styles.footer}>
                <p className={styles.footerCopy}>
                    © {new Date().getFullYear()} {SITE_METADATA.name}：认真生活，简单做人，用心做事
                </p>
            </footer>
        </div>
    );
}
