import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { AsyncState } from '@/shared/components/async/AsyncState';

interface SystemUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  rol?: { name: string };
}

interface UsersSectionProps {
  users: SystemUser[];
  loading?: boolean;
  onAddUser: () => void;
}

const roleBadge = (roleName?: string) => {
  const name = roleName?.toUpperCase();
  if (name === 'ADMIN' || name === 'ADMINISTRADOR') return 'bg-primary/10 text-primary';
  if (name === 'TECNICO') return 'bg-success/10 text-success';
  if (name === 'VENTAS') return 'bg-primary/10 text-primary';
  if (name === 'RECEPCIONISTA') return 'bg-amber-500/10 text-amber-600';
  if (name === 'DESARROLLADOR') return 'bg-purple-500/10 text-purple-600';
  return 'bg-muted/50 text-muted-foreground';
};

export const UsersSection = ({ users, loading, onAddUser }: UsersSectionProps) => {
  const displayUsers = Array.isArray(users) ? users : [];

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <h2 className="text-lg font-semibold text-foreground">Usuarios del Sistema</h2>
          {!loading && (
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">{displayUsers.length}</span>
          )}
        </div>
        <Button onClick={onAddUser} className="bg-primary hover:bg-primary-hover flex items-center gap-2" size="sm">
          <UserPlus size={16} />
          Agregar Usuario
        </Button>
      </div>
      <AsyncState
        loading={!!loading}
        empty={!loading && displayUsers.length === 0}
        loadingLabel="Cargando usuarios..."
        emptyIcon={Users}
        emptyTitle="No hay usuarios registrados"
        emptyDescription="Agrega usuarios para gestionar el acceso al sistema"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">NOMBRE</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">EMAIL</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ROL</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((u) => {
                const name = [u.nombre, u.apellido].filter(Boolean).join(' ');
                return (
                  <tr key={u.id} className="border-b border-border-light dark:divide-border-dark hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${roleBadge(u.rol?.name)}`}>
                        {u.rol?.name || '\u2014'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-destructive'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AsyncState>
    </div>
  );
};
