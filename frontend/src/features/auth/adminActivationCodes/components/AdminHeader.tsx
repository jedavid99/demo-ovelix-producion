import { LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import logo from '/ovelix-claro.png';

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="ovelix" loading="lazy" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-xs text-muted-foreground">Gestión de Códigos de Activación</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}
