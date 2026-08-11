import { Eye, Edit, PowerOff, Power, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { Client } from '../types/clients.types';

interface ClientsTableProps {
  data: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDeactivate: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientsTable = ({ data, onView, onEdit, onDeactivate, onDelete }: ClientsTableProps) => (
  <div className="overflow-x-auto border border-border rounded-lg bg-background">
    <table className="w-full">
      <thead className="bg-muted sticky top-0">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">DNI</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Teléfono</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha registro</th>
          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map(row => (
          <tr key={row.id} className="border-t hover:bg-muted/50">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {row.nombre_completo?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{row.nombre_completo || 'Sin nombre'}</p>
                  <p className="text-xs text-muted-foreground">{row.email || 'Sin email'}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-foreground">{row.dni || '\u2014'}</td>
            <td className="px-4 py-3 text-sm text-foreground">{row.telefono || '\u2014'}</td>
            <td className="px-4 py-3 text-sm text-foreground">
              {row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-AR') : '\u2014'}
            </td>
            <td className="px-4 py-3">
              <Badge variant={row.estado === 'activo' ? 'success' : 'secondary'} className="capitalize">
                {row.estado || 'activo'}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => onView(row)} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver cliente">
                  <Eye size={16} className="text-muted-foreground" />
                </button>
                <button onClick={() => onEdit(row)} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Editar cliente">
                  <Edit size={16} className="text-muted-foreground" />
                </button>
                <button onClick={() => onDeactivate(row)} className="p-1.5 rounded-md hover:bg-warning/10 transition-colors"
                  title={row.estado === 'activo' ? 'Inactivar cliente' : 'Activar cliente'}>
                  {row.estado === 'activo' ? <PowerOff size={16} className="text-yellow-600" /> : <Power size={16} className="text-success" />}
                </button>
                <button onClick={() => onDelete(row)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors" title="Eliminar cliente">
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
