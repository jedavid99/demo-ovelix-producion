import { ShieldCheck, HelpCircle } from 'lucide-react';

interface UserProfile {
  permissions?: string[];
  rol?: { name: string; permissions?: string[] };
}

interface SecurityAccessSectionProps {
  user: UserProfile;
}

export const SecurityAccessSection = ({ user }: SecurityAccessSectionProps) => {
  const permissions = user?.permissions ?? user?.rol?.permissions ?? [];
  const roleName = user?.rol?.name;

  const formatPermission = (p: string) => p.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={14} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Permisos y Acceso</h2>
            <p className="text-xs text-muted-foreground">Rol actual: <span className="font-medium text-foreground">{roleName || 'Sin rol asignado'}</span></p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {permissions.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Tienes acceso a {permissions.length} {'función' + (permissions.length !== 1 ? 'es' : '')} del sistema:
            </p>
            <div className="flex flex-wrap gap-2">
              {permissions.map((p: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  title={p}
                >
                  <ShieldCheck size={10} />
                  {formatPermission(p)}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-lg bg-muted/30">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={28} className="text-muted-foreground/40" />
            </div>
            <p className="font-medium text-foreground mb-1">Sin permisos asignados</p>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
              Los permisos determinan qué secciones del sistema puedes acceder. Contactá a tu administrador si necesitás más acceso.
            </p>
            <HelpCircle size={16} className="text-muted-foreground/60 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};