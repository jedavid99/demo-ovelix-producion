import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ORDER_STATUSES } from '../constants';

interface OrderDataCardProps {
  orderNumber: string;
  providerId: string;
  issueDate: string;
  deliveryDate: string;
  status: string;
  notes: string;
  errors: Record<string, string>;
  onOrderNumberChange: (v: string) => void;
  onProviderChange: (v: string) => void;
  onIssueDateChange: (v: string) => void;
  onDeliveryDateChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onNotesChange: (v: string) => void;
}

export function OrderDataCard({
  orderNumber, providerId, issueDate, deliveryDate, status, notes, errors,
  onOrderNumberChange, onProviderChange, onIssueDateChange, onDeliveryDateChange,
  onStatusChange, onNotesChange,
}: OrderDataCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Datos de la orden</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Número de orden</Label>
            <Input id="orderNumber" value={orderNumber} onChange={e => onOrderNumberChange(e.target.value)} placeholder="#OC-XXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">Proveedor *</Label>
            <Select value={providerId} onValueChange={onProviderChange}>
              <SelectTrigger id="provider" className={errors.providerId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Proveedor</SelectItem>
              </SelectContent>
            </Select>
            {errors.providerId && <p className="text-sm text-destructive">{errors.providerId}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Fecha de emisión</Label>
            <Input id="issueDate" type="date" value={issueDate} onChange={e => onIssueDateChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Fecha estimada de entrega *</Label>
            <Input id="deliveryDate" type="date" value={deliveryDate} onChange={e => onDeliveryDateChange(e.target.value)}
              className={errors.deliveryDate ? 'border-destructive' : ''} />
            {errors.deliveryDate && <p className="text-sm text-destructive">{errors.deliveryDate}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger id="status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Input id="notes" value={notes} onChange={e => onNotesChange(e.target.value)} placeholder="Observaciones adicionales..." />
        </div>
      </CardContent>
    </Card>
  );
}
