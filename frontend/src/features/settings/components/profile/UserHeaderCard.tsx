import { Calendar, Building2, BadgeCheck, MapPin, Mail, Phone } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface UserEmpresa {
  razon_social?: string;
  codigo_empresa?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
}

interface UserHeaderCardProps {
  user: {
    nombre?: string;
    apellido?: string;
    rol?: { name: string };
    empresa?: UserEmpresa;
    activo?: boolean;
    email?: string;
    telefono?: string;
    created_at?: string;
  };
}

export const UserHeaderCard = ({ user }: UserHeaderCardProps) => {
  const fullName = [user?.nombre, user?.apellido].filter(Boolean).join(' ') || 'Sin nombre';
  const roleName = user?.rol?.name || 'Sin rol';
  const companyName = user?.empresa?.razon_social;
  const companyCode = user?.empresa?.codigo_empresa;
  const companyAddress = [user?.empresa?.direccion, user?.empresa?.ciudad, user?.empresa?.provincia].filter(Boolean).join(', ');
  const isActive = user?.activo !== false;
  const initials = [user?.nombre?.charAt(0), user?.apellido?.charAt(0)].filter(Boolean).join('').toUpperCase() || '?';
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
    : null;
  const email = user?.email;
  const phone = user?.telefono;

  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border">
      {/* Subtle accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
          {/* Avatar - signature element */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-4xl lg:text-5xl font-bold shadow-lg shadow-primary/25 ring-4 ring-background">
              {initials}
            </div>
            {/* Status badge on avatar */}
            <span className={cn(
              'absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 ring-2 ring-background flex items-center justify-center',
              isActive ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            )}>
              <BadgeCheck size={12} />
            </span>
          </div>

          {/* Identity & Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate">{fullName}</h1>
                <p className="mt-1 text-base lg:text-lg text-muted-foreground">{roleName}</p>
              </div>

              {/* Quick meta chips */}
              <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                {companyName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                    <Building2 size={14} />
                    {companyName}
                  </span>
                )}
                {companyCode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    <span className="font-mono">{companyCode}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Secondary info row */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="shrink-0" />
                  Desde {joinDate}
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1.5 truncate max-w-xs">
                  <Mail size={14} className="shrink-0" />
                  {email}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="shrink-0" />
                  {phone}
                </span>
              )}
              {companyAddress && (
                <span className="flex items-center gap-1.5 truncate max-w-md">
                  <MapPin size={14} className="shrink-0" />
                  {companyAddress}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};