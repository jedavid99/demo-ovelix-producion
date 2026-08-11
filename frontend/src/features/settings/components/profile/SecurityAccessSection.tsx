import { ShieldCheck } from 'lucide-react';

interface SecurityAccessSectionProps {
  user: any;
}

export const SecurityAccessSection = ({ user }: SecurityAccessSectionProps) => {
  const permissions = user?.permissions ?? user?.rol?.permissions ?? [];

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck size={14} className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Permisos</h2>
      </div>
      <div>
        {permissions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {permissions.map((p: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {p.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ShieldCheck size={40} className="mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-medium">Sin permisos asignados</p>
            <p className="text-xs mt-1">Los permisos determinan qué secciones del sistema puedes acceder</p>
          </div>
        )}
      </div>
    </div>
  );
};
