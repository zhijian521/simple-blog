import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function isNavItemActive(pathname: string, href: string, match: 'exact' | 'prefix'): boolean {
  return match === 'exact' ? pathname === href : pathname.startsWith(href);
}
