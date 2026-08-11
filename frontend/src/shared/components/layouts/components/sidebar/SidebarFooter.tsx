import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';

interface SidebarFooterProps {
  collapsed: boolean;
  onLogout: () => void;
}

export const SidebarFooter = ({ collapsed, onLogout }: SidebarFooterProps) => (
  <div className="border-t border-border p-4 space-y-1">
    {!collapsed && <ThemeToggle />}
    <button onClick={onLogout}
      className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap ${collapsed ? 'justify-center px-0' : 'px-4'}`}
      title="Cerrar sesión">
      <LogOut size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1 text-left">Cerrar sesión</span>}
    </button>
  </div>
);
