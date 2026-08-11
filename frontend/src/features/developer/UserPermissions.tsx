import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, RotateCcw, Check } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  ShoppingCart,
  BarChart,
  Calendar,
  Mail,
  MessageSquare,
  ClipboardList,
  UserCog,
  Home,
  Package,
  Truck,
  DollarSign,
  PieChart,
  Layers,
  Box,
  Menu,
} from 'lucide-react';
import api from '@/services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { PAGE_PERMISSIONS } from '@/hooks/usePermissions';

interface UserPermissionsProps {
  userId: string;
  userName: string;
  userRole: string;
  onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  users: Users,
  settings: Settings,
  reports: FileText,
  orders: ShoppingCart,
  analytics: BarChart,
  calendar: Calendar,
  email: Mail,
  chat: MessageSquare,
  tasks: ClipboardList,
  profile: UserCog,
  home: Home,
  inventory: Package,
  shipping: Truck,
  finance: DollarSign,
  stats: PieChart,
  categories: Layers,
  products: Box,
  navigation: Menu,
};

const DefaultIcon = LayoutDashboard;

export function UserPermissions({ userId, userName, userRole, onBack }: UserPermissionsProps) {
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    fetchUserPermissions();
  }, [userId]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/permissions/user/${userId}`);
      const userPermissions = response.data?.data?.permissions || response.data?.permissions || [];
      
      const pages = new Set<string>();
      Object.entries(PAGE_PERMISSIONS).forEach(([pageKey, pageData]) => {
        const hasAllPermissions = pageData.permissions.every(perm => 
          userPermissions.includes(perm)
        );
        if (hasAllPermissions) {
          pages.add(pageKey);
        }
      });
      
      setSelectedPages(pages);
    } catch (err) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching user permissions:', err);
      setError('Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (pageKey: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageKey)) {
      newSelected.delete(pageKey);
    } else {
      newSelected.add(pageKey);
    }
    setSelectedPages(newSelected);
  };

  const savePermissions = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const permissions: string[] = [];
      selectedPages.forEach(pageKey => {
        const pageData = PAGE_PERMISSIONS[pageKey as keyof typeof PAGE_PERMISSIONS];
        if (pageData) {
          permissions.push(...pageData.permissions);
        }
      });
      
      await api.put(`/permissions/user/${userId}`, { permissions });
      toast({ title: 'Éxito', description: 'Permisos guardados exitosamente' });
    } catch (err) {
      toast({ title: 'Error', description: 'Error al guardar. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error saving permissions:', err);
      setError('Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };

  const handleResetClick = () => {
    setResetConfirmOpen(true);
  };

  const resetToRoleDefaults = async () => {
    setResetConfirmOpen(false);
    try {
      setSaving(true);
      setError(null);
      await api.put(`/permissions/user/${userId}/reset`);
      await fetchUserPermissions();
      toast({ title: 'Éxito', description: 'Permisos reseteados exitosamente' });
    } catch (err) {
      toast({ title: 'Error', description: 'Error al eliminar. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error resetting permissions:', err);
      setError('Error al resetear permisos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState label="Cargando permisos..." />;
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg overflow-hidden shadow-sm">
      {/* Header compacto */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-foreground">Permisos de Páginas</h2>
            <p className="text-xs text-muted-foreground">
              {userName} ({userRole})
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleResetClick}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground bg-muted hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Resetear
          </button>
          <button
            onClick={savePermissions}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <ErrorState message={error} className="!py-4 mx-4 mt-3" />}

      {/* Pages grid con scroll interno y fondo sólido */}
      <div className="flex-1 overflow-y-auto p-4 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(PAGE_PERMISSIONS).map(([pageKey, pageData]) => {
            const isSelected = selectedPages.has(pageKey);
            const IconComponent = iconMap[pageKey] || DefaultIcon;
            return (
              <button
                key={pageKey}
                onClick={() => togglePage(pageKey)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-primary/5 hover:bg-primary/10'
                    : 'border-border hover:border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="truncate">
                      <h3 className="text-sm font-medium text-foreground truncate">{pageData.title}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {pageData.permissions.length} permiso(s)
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Summary compacto */}
        <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{selectedPages.size}</span> de {Object.keys(PAGE_PERMISSIONS).length} páginas seleccionadas
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Resetear permisos"
        description="¿Estás seguro de resetear los permisos a los del rol por defecto?"
        onConfirm={resetToRoleDefaults}
        confirmLabel="Resetear"
      />
    </div>
  );
}