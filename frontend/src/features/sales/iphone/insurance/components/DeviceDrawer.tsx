import { Smartphone, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import type { Device } from '../types';

interface DeviceDrawerProps {
  device: Device;
  onClose: () => void;
}

export function DeviceDrawer({ device, onClose }: DeviceDrawerProps) {
  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        hideClose
        className="p-0 sm:max-w-md w-full"
        aria-describedby={undefined}
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-border flex-row items-center justify-between space-y-0 text-left bg-muted/30 sticky top-0 z-10">
            <div>
              <SheetTitle className="text-lg font-bold">Detalles de Póliza</SheetTitle>
              <SheetDescription className="text-sm">
                Venta {device.saleId} · {device.customer}
              </SheetDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Cerrar">
              <span className="text-xl leading-none" aria-hidden="true">×</span>
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {device.status !== 'none' && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Póliza de Seguro</h4>
                  <Badge variant={device.status === 'active' ? 'success' : 'destructive'}>
                    {device.status === 'active' ? 'ACTIVO' : 'EXPIRADO'}
                  </Badge>
                </div>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                      <Field label="Tipo de Plan" value={device.planType} />
                      <Field label="ID de Póliza" value={device.policyId} />
                      <Field label="Fecha Inicio" value={device.startDate} />
                      <Field label="Expira" value={device.expiryDate} />
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <section>
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Smartphone size={16} /> Info Hardware
              </h4>
              <div className="space-y-3">
                <DetailRow label="Modelo" value={device.model} />
                <DetailRow label="IMEI" value={device.imei} mono />
                <DetailRow label="Fecha Venta" value={device.saleDate} />
              </div>
            </section>

            {device.claims && device.claims.length > 0 && (
              <section>
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                  <Shield size={16} /> Reclamaciones
                </h4>
                <div className="space-y-3">
                  {device.claims.map(claim => (
                    <Card key={claim.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-foreground">{claim.type}</p>
                          <Badge variant="outline" className="text-xs">{claim.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{claim.date}</p>
                        <p className="text-xs text-muted-foreground">{claim.center}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-bold uppercase">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value || '—'}</p>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between border-b border-border pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-foreground ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  );
}
