import { Calendar, Building2, BadgeCheck } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface UserHeaderCardProps {
  user: any;
}

export const UserHeaderCard = ({ user }: UserHeaderCardProps) => {
  const fullName = [user?.nombre, user?.apellido].filter(Boolean).join(' ') || 'Sin nombre';
  const roleName = user?.rol?.name || 'Sin rol';
  const companyName = user?.empresa?.razon_social;
  const isActive = user?.activo !== false;
  const initials = [user?.nombre?.charAt(0), user?.apellido?.charAt(0)].filter(Boolean).join('') || '?';
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 lg:p-8 shadow-md">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex gap-6 flex-1">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 pt-2 min-w-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground truncate">{fullName}</h1>
              <p className="text-sm lg:text-base text-muted-foreground mt-1">{roleName}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs lg:text-sm text-muted-foreground">
              {companyName && (
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  {companyName}
                </span>
              )}
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Desde {joinDate}
                </span>
              )}
              <span className={cn(
                'flex items-center gap-1.5',
                isActive ? 'text-success' : 'text-destructive'
              )}>
                <BadgeCheck size={14} />
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
