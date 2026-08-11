import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '/ovelix-claro.png';

interface SidebarHeaderProps {
  collapsed: boolean;
  onClose: () => void;
}

export const SidebarHeader = ({ collapsed, onClose }: SidebarHeaderProps) => (
  <div className={`${collapsed ? 'px-0' : 'px-4'} py-5 border-b border-border`}>
    <div className="flex items-center justify-between">
      <Link to="/dashboard" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <img src={logo} alt="ovelix" className="w-9 h-9 rounded-lg flex-shrink-0" />
        {!collapsed && (
          <div>
            <span className="font-semibold text-foreground block">ovelix</span>
            <span className="text-xs text-muted-foreground">Sistema de Gestión</span>
          </div>
        )}
      </Link>
      <button onClick={onClose} aria-label="Cerrar menú" className="lg:hidden p-2.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors">
        <X size={20} />
      </button>
    </div>
  </div>
);
