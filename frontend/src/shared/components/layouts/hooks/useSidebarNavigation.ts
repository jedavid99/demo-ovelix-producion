import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { navItems } from '../constants/sidebar.constants';
import type { NavItem } from '../types/sidebar.types';

export function useSidebarNavigation() {
  const location = useLocation();
  const { canAccessRoute } = usePermissions();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const filterNavItems = useCallback((items: NavItem[]): NavItem[] => {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterNavItems(item.children);
        if (filteredChildren.length > 0) return { ...item, children: filteredChildren };
        return null;
      }
      if (canAccessRoute(item.href)) return item;
      return null;
    }).filter((item): item is NavItem => item !== null);
  }, [canAccessRoute]);

  const filteredNavItems = useMemo(
    () => navItems.map(section => ({
      ...section,
      children: filterNavItems(section.children || [])
    })).filter(section => section.children && section.children.length > 0),
    [filterNavItems]
  );

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const path = location.pathname;
    const newOpenSections: Record<string, boolean> = {};
    navItems.forEach(section => {
      const expandSection = section.children?.some(item => {
        if (item.href === path) return true;
        if (item.children) return item.children.some(subItem => subItem.href === path);
        return false;
      });
      if (expandSection) newOpenSections[section.title] = true;
    });
    setOpenSections(prev => ({ ...prev, ...newOpenSections }));
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  const isChildActive = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(item => item.href === location.pathname || item.children?.some(sub => sub.href === location.pathname));
  };

  return { filteredNavItems, openSections, hoveredSection, setHoveredSection, toggleSection, isActive, isChildActive };
}
