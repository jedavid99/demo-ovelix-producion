import { QrCode, Edit } from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getStatusColor, getBatteryColor, statusLabels } from '../constants';
import type { iPhone } from '../types';

interface InventoryTableProps {
  iphones: iPhone[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function InventoryTable({ iphones, loading, error, onRetry }: InventoryTableProps) {
  const batteryTextColor = (color: string) => {
    if (color === 'bg-emerald-500') return 'text-emerald-500';
    if (color === 'bg-amber-500') return 'text-amber-500';
    return 'text-destructive';
  };

  if (loading && iphones.length === 0) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
        <AlertTriangle size={40} className="text-destructive" />
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">Error al cargar el inventario</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
          <tr className="bg-muted dark:bg-muted/50 border-b border-border ">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Almacenamiento</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IMEI / Serial</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bater\u00EDa</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border ">
          {iphones.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                <MdPhoneAndroid size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                <p className="font-medium text-foreground">No hay dispositivos registrados</p>
                <p className="text-sm text-muted-foreground">Agrega dispositivos desde el panel de administraci\u00F3n</p>
              </td>
            </tr>
          ) : (
            iphones.map(phone => {
              const sColors = getStatusColor(phone.status);
              return (
                <tr key={phone.id} className="hover:bg-muted dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted dark:bg-muted rounded-lg flex items-center justify-center text-2xl">
                        {phone.image}
                      </div>
                      <div>
                        <p className={phone.status === 'Out of Stock' ? 'font-semibold text-muted-foreground' : 'font-semibold text-foreground'}>
                          {phone.model}
                        </p>
                        <p className="text-xs text-muted-foreground">{phone.color} \u2022 Modelo {phone.modelNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${phone.status === 'Out of Stock' ? 'bg-muted dark:bg-muted text-muted-foreground' : 'bg-muted dark:bg-muted text-foreground'}`}>
                      {phone.storage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{phone.imei}</td>
                  <td className="px-6 py-4">
                    {phone.battery > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted  rounded-full overflow-hidden">
                          <div className={`h-full ${getBatteryColor(phone.battery)} transition-all`} style={{ width: `${phone.battery}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${batteryTextColor(getBatteryColor(phone.battery))}`}>
                          {phone.battery}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted dark:bg-muted rounded-full" />
                        <span className="text-xs font-medium text-muted-foreground">N/A</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sColors.bg} ${sColors.text}`}>
                      {statusLabels[phone.status] || phone.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {phone.status === 'Out of Stock' ? (
                      <button className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-hover transition-all font-medium">
                        Reponer
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:text-primary transition-colors border border-border  rounded text-muted-foreground" title="Imprimir c\u00F3digo de barras">
                          <QrCode size={16} />
                        </button>
                        <button className="p-1.5 hover:text-primary transition-colors border border-border  rounded text-muted-foreground" title="Editar">
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
