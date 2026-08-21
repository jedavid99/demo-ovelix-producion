import { Users, UserPlus, UserX, Edit2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { AsyncState } from '@/shared/components/async/AsyncState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

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

const statusBadge = (activo: boolean) =>
  activo
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-destructive';

export const UsersSection = ({ users, loading, onAddUser }: UsersSectionProps) => {
  const displayUsers = Array.isArray(users) ? users : [];

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary" />
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
        emptyDescription="Agregá usuarios para gestionar el acceso al sistema"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="grid">
            <thead className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Estado</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {displayUsers.map((u) => {
                const name = [u.nombre, u.apellido].filter(Boolean).join(' ');
                return (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold ${roleBadge(u.rol?.name)}`}>
                        {u.rol?.name || '\u2014'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge(u.activo)}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" aria-label={`Opciones para ${name}`}>
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
                            <Edit2 size={14} /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                            <UserX size={14} />
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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