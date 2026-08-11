import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import type { CashForm } from '../types';

interface PhysicalCountFormProps {
  cash: CashForm;
  actualTotal: number;
  onChange: (field: string, value: string) => void;
}

export function PhysicalCountForm({ cash, actualTotal, onChange }: PhysicalCountFormProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-primary" />
            <CardTitle>Conteo físico</CardTitle>
          </div>
          <Badge variant="outline" size="sm">Cajón A-1</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Billetes</Label>
            <div className="space-y-2">
              <BillRow label="$100" value={cash.bills100} field="bills100" onChange={onChange} />
              <BillRow label="$50" value={cash.bills50} field="bills50" onChange={onChange} />
              <BillRow label="$20" value={cash.bills20} field="bills20" onChange={onChange} />
              <BillRow label="$10" value={cash.bills10} field="bills10" onChange={onChange} />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Monedas y billetes pequeños</Label>
            <div className="space-y-2">
              <BillRow label="$5" value={cash.bills5} field="bills5" onChange={onChange} />
              <BillRow label="$1" value={cash.bills1} field="bills1" onChange={onChange} />
              <BillRow label="Otros" value={cash.other} field="other" onChange={onChange} step="0.01" placeholder="0.00" />
              <div className="pt-4 mt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Total actual</span>
                  <span className="text-xl font-bold text-foreground">${actualTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-6 border-t border-border">
          <Label>Notas de cierre</Label>
          <textarea
            value={cash.notes}
            onChange={e => onChange('notes', e.target.value)}
            className="w-full rounded border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            placeholder="Algún problema u observación durante el conteo?"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BillRow({ label, value, field, onChange, step, placeholder }: {
  label: string; value: string; field: string; onChange: (f: string, v: string) => void; step?: string; placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-sm font-medium text-muted-foreground">{label}</span>
      <Input type="number" step={step} value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder || '0'}
      />
    </div>
  );
}
