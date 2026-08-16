import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarNavigation } from './hooks/useSidebarNavigation';
import { SidebarOverlay } from './components/sidebar/SidebarOverlay';
import { SidebarHeader } from './components/sidebar/SidebarHeader';
import { SidebarFooter } from './components/sidebar/SidebarFooter';
import { SidebarNavItem } from './components/sidebar/SidebarNavItem';
import type { NavItem } from './types/sidebar.types';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  orders?: any[];
  notificationsCount?: number;
}

const AdminSidebar = ({
  isOpen = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
  orders = [],
  notificationsCount = 0,
}: AdminSidebarProps) => {
  const { logout } = useAuth();
  const { filteredNavItems, openSections, hoveredSection, setHoveredSection, toggleSection, isActive, isChildActive } = useSidebarNavigation();

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose} />
      <aside
        data-tour="sidebar"
        className={`fixed z-40 inset-y-0 left-0 bg-card border-r border-border transition-[width,transform] duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64 ${collapsed ? 'lg:w-16' : 'lg:w-60'} shadow-xl lg:shadow-none`}>
        <div className="h-full flex flex-col">
          <SidebarHeader collapsed={collapsed} onClose={onClose} />
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 overscroll-contain">
            {filteredNavItems.map(section => (
              <div key={section.title} className="mb-6">
                {!collapsed && <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</h3>}
                {section.children?.map(item => (
                  <React.Fragment key={item.href || item.title}>
                    <SidebarNavItem item={item} depth={0} collapsed={collapsed} openSections={openSections} hoveredSection={hoveredSection} isActive={isActive} isChildActive={isChildActive} onToggleSection={toggleSection} onHover={setHoveredSection} />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
          <SidebarFooter collapsed={collapsed} onLogout={logout} />
        </div>
      </aside>
    </>
  );
};

export { AdminSidebar };
export default AdminSidebar;
