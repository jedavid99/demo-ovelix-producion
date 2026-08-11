import { Shield, Check, Edit, Trash2 } from 'lucide-react';
import type { Role } from '../types';

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-muted-foreground hover:text-muted-foreground transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-1">{role.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-2">Permisos:</p>
        <div className="flex flex-wrap gap-1">
          {role.permissions.map((perm, idx) => (
            <span key={idx} className="text-xs bg-muted text-foreground px-2 py-1 rounded">
              {perm}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">{role._count?.users ?? 0} usuarios</span>
        <div className="flex items-center space-x-1 text-success">
          <Check className="w-4 h-4" />
          <span className="text-xs font-medium">Activo</span>
        </div>
      </div>
    </div>
  );
}
