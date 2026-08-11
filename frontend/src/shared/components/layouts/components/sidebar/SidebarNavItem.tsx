import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { NavItem } from '../../types/sidebar.types';

interface SidebarNavItemProps {
  item: NavItem;
  depth: number;
  collapsed: boolean;
  openSections: Record<string, boolean>;
  hoveredSection: string | null;
  isActive: (href: string) => boolean;
  isChildActive: (children?: NavItem[]) => boolean;
  onToggleSection: (key: string) => void;
  onHover: (title: string | null) => void;
}

export const SidebarNavItem = ({ item, depth, collapsed, openSections, hoveredSection, isActive, isChildActive, onToggleSection, onHover }: SidebarNavItemProps) => {
  const hasChildren = item.children && item.children.length > 0;
  const isItemActive = isActive(item.href);
  const isParentActive = hasChildren && isChildActive(item.children);
  const paddingLeft = depth * 12;
  const isHovered = hoveredSection === item.title;

  if (hasChildren) {
    return (
      <div className="mb-1 relative"
        onMouseEnter={() => collapsed && onHover(item.title)}
        onMouseLeave={() => onHover(null)}
      >
        <button onClick={() => !collapsed && onToggleSection(item.title)}
          className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap ${collapsed ? 'justify-center px-0' : 'px-4 mx-2'} ${isParentActive ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
          style={{ paddingLeft: collapsed ? undefined : `${paddingLeft + 16}px` }} title={collapsed ? item.title : undefined}>
          <span className="h-5 w-5 flex items-center justify-center shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && item.badge > 0 && <Badge variant="secondary" size="sm">{item.badge}</Badge>}
              <ChevronDown size={16} className={`transition-transform duration-200 text-muted-foreground ${openSections[item.title] ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
        {collapsed && isHovered && (
          <div className="absolute left-full top-0 ml-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 p-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mb-1">{item.title}</div>
            {item.children?.map(child => <SidebarNavItem key={child.href || child.title} item={child} depth={depth + 1} collapsed={collapsed} openSections={openSections} hoveredSection={hoveredSection} isActive={isActive} isChildActive={isChildActive} onToggleSection={onToggleSection} onHover={onHover} />)}
          </div>
        )}
        <AnimatePresence>
          {openSections[item.title] && !collapsed && item.children && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-1">{item.children.map(child => <SidebarNavItem key={child.href || child.title} item={child} depth={depth + 1} collapsed={collapsed} openSections={openSections} hoveredSection={hoveredSection} isActive={isActive} isChildActive={isChildActive} onToggleSection={onToggleSection} onHover={onHover} />)}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link key={item.href} to={item.href}
      className={`flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap group ${collapsed ? 'justify-center px-0' : 'px-4 mx-2'} ${isItemActive ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
      style={{ paddingLeft: collapsed ? undefined : `${paddingLeft + 16}px` }} title={collapsed ? item.title : undefined}>
      <span className="h-5 w-5 flex items-center justify-center shrink-0">{item.icon}</span>
      {!collapsed && (
        <><span className="flex-1">{item.title}</span>{item.badge && item.badge > 0 && <Badge variant="secondary" size="sm">{item.badge}</Badge>}</>
      )}
    </Link>
  );
};
