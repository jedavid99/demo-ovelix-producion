import { ChevronRight, ChevronLeft, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { Device } from '../types';

interface DevicesTableProps {
  devices: Device[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelectDevice: (device: Device) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function DevicesTable({ devices, currentPage, onPageChange, onSelectDevice, getStatusBadge }: DevicesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID Venta</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modelo iPhone</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IMEI</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha Venta</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Seguro</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <Smartphone size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                    <p className="font-medium">No hay dispositivos registrados</p>
                    <p className="text-sm">Agrega ventas desde el panel de administración</p>
                  </td>
                </tr>
              ) : (
                devices.map(device => (
                  <tr key={device.id} onClick={() => onSelectDevice(device)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-foreground">{device.saleId}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{device.customer}</span>
                        <span className="text-xs text-muted-foreground">{device.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-foreground">{device.model}</td>
                    <td className="px-6 py-5 text-sm font-mono text-muted-foreground">{device.imei}</td>
                    <td className="px-6 py-5 text-sm text-muted-foreground">{device.saleDate}</td>
                    <td className="px-6 py-5">{getStatusBadge(device.status)}</td>
                    <td className="px-6 py-5 text-right">
                      <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border">
          <span className="text-sm text-muted-foreground">Mostrando {devices.length} de {devices.length} entradas</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm"><ChevronLeft size={16} /></Button>
            <Button variant="default" size="icon-sm">1</Button>
            <Button variant="outline" size="icon-sm"><ChevronRight size={16} /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
