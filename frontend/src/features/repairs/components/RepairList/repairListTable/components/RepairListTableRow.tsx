import { useState } from 'react';
import { Eye, Edit, FileText, Package, Trash2, RefreshCw, Printer, MoreHorizontal, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { getPriorityBadge } from '../../RepairList.types';
import type { Repair } from '../../RepairList.types';
import { getEstadoConfig } from '@/config/estadosReparacion.config';

interface RepairListTableRowProps {
  repair: Repair;
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onEditStatus: (id: string) => void;
  onPDF: (id: string) => void;
  onThermalPrint: (id: string) => void;
  onMarkDelivered: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RepairListTableRow({
  repair,
  onPreview, onEdit, onEditStatus, onPDF, onThermalPrint, onMarkDelivered, onDelete,
}: RepairListTableRowProps) {
  const [open, setOpen] = useState(false);
  const config = getEstadoConfig(repair.estado);
  const priorityStyle = getPriorityBadge(repair.prioridad);

  return (
    <tr className="hover:bg-muted/10 transition-colors">
      <td className="px-3 py-2 text-muted-foreground font-mono truncate max-w-[70px]">
        {repair.numero_reparacion || repair.id?.substring(0, 8)}
      </td>
      <td className="px-3 py-2 text-foreground font-medium truncate max-w-[110px]">
        <div className="truncate" title={repair.cliente_nombre || '—'}>{repair.cliente_nombre || '—'}</div>
        <div className="text-[10px] text-muted-foreground truncate">DNI: {repair.dni || '—'}</div>
      </td>
      <td className="px-3 py-2 text-foreground font-medium truncate max-w-[100px]">
        <div className="truncate" title={repair.modelo || '—'}>{repair.modelo || '—'}</div>
        <div className="text-[10px] text-muted-foreground truncate">{repair.marca || '—'}</div>
      </td>
      <td className="hidden md:table-cell px-3 py-2 text-muted-foreground truncate max-w-[90px]">
        {repair.categoria_dispositivo || 'Sin categoría'}
      </td>
      <td className="px-3 py-2 text-muted-foreground truncate max-w-[110px]" title={repair.problema_reportado || '—'}>
        {repair.problema_reportado || '—'}
      </td>
      <td className="hidden lg:table-cell px-3 py-2 text-muted-foreground truncate max-w-[110px]" title={repair.diagnosis || '—'}>
        {repair.diagnosis || 'Por Diagnosticar'}
      </td>
      <td className="px-3 py-2">
        <Badge
          className="px-2.5 py-1 text-[11px] font-semibold rounded-full border-0 shadow-sm"
          style={{
            backgroundColor: config.color,
            color: config.textColor === '#FFFFFF' ? 'white' : '#1a1a1a',
          }}
        >
          <span className="flex items-center gap-1.5">{config.label}</span>
        </Badge>
      </td>
      <td className="hidden sm:table-cell px-3 py-2">
        <Badge
          variant="outline"
          className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap`}
        >
          <span className="flex items-center gap-1">
            {repair.prioridad === 'high' && <AlertCircle className="w-2.5 h-2.5" />}
            {repair.prioridad === 'medium' && <AlertCircle className="w-2.5 h-2.5" />}
            {repair.prioridad === 'low' && <AlertCircle className="w-2.5 h-2.5" />}
            {priorityStyle.label}
          </span>
        </Badge>
      </td>
      <td className="px-3 py-2 text-right">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-muted/20 transition-colors" aria-label="Acciones">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 text-xs">
            <DropdownMenuItem onClick={() => onPreview(repair.id)}><Eye className="mr-2 h-3.5 w-3.5" /> Ver detalle</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditStatus(repair.id)}><RefreshCw className="mr-2 h-3.5 w-3.5" /> Cambiar estado</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(repair.id)}><Edit className="mr-2 h-3.5 w-3.5" /> Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPDF(repair.id)}><FileText className="mr-2 h-3.5 w-3.5" /> Generar PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThermalPrint(repair.id)}><Printer className="mr-2 h-3.5 w-3.5" /> Impresión térmica</DropdownMenuItem>
            {repair.estado !== 'ENTREGADO_AL_CLIENTE' &&
             repair.estado !== 'CANCELADO_POR_CLIENTE' &&
             repair.estado !== 'ABANDONADO_POR_CLIENTE' && (
              <DropdownMenuItem onClick={() => onMarkDelivered(repair.id)}><Package className="mr-2 h-3.5 w-3.5" /> Marcar entregado</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(repair.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
