import { Building } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { ServiceOrderData } from '../../types/pdfConfig/pdfConfig.types';

interface CompanySectionProps {
  data: ServiceOrderData;
  onChange: <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => void;
}

export const CompanySection = ({ data, onChange }: CompanySectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h3 className="font-bold text-foreground flex items-center gap-2"><Building size={16} className="text-primary" /> Empresa</h3>
      <Input value={data.companyName} onChange={(e) => onChange('companyName', e.target.value)} placeholder="Nombre de la empresa" />
      <Input value={data.companyAddress} onChange={(e) => onChange('companyAddress', e.target.value)} placeholder="Dirección" />
      <Input value={data.companyPhone} onChange={(e) => onChange('companyPhone', e.target.value)} placeholder="Teléfono" />
      <Input value={data.companyEmail} onChange={(e) => onChange('companyEmail', e.target.value)} placeholder="Email" />
      <div className="flex gap-2">
        <Input value={data.orderNumber} onChange={(e) => onChange('orderNumber', e.target.value)} placeholder="N° Orden" className="flex-1" />
        <Input type="date" value={data.orderDate} onChange={(e) => onChange('orderDate', e.target.value)} className="w-32" />
      </div>
    </CardContent>
  </Card>
);
