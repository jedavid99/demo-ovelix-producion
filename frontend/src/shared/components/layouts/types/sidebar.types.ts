import type { ReactNode } from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon?: ReactNode;
  children?: NavItem[];
  badge?: number;
}
