import { Award } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { ServiceOrderData } from '../../types/pdfConfig/pdfConfig.types';

interface WarrantySectionProps {
  warrantyMonths: string;
  warrantyTerms: string;
  onChange: <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => void;
}

export const WarrantySection = ({ warrantyMonths, warrantyTerms, onChange }: WarrantySectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h3 className="font-bold text-foreground flex items-center gap-2"><Award size={16} className="text-primary" /> Garantía</h3>
      <Input value={warrantyMonths} onChange={(e) => onChange('warrantyMonths', e.target.value)} placeholder="Meses de garantía" />
      <textarea value={warrantyTerms} onChange={(e) => onChange('warrantyTerms', e.target.value)} placeholder="Términos y condiciones"
        rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
    </CardContent>
  </Card>
);
