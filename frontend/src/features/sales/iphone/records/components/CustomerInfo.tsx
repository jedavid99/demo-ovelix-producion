import { User, Mail } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { IPhoneRecordForm } from '../types';

interface CustomerInfoProps {
  formData: IPhoneRecordForm;
  onInputChange: (field: string, value: string | number) => void;
}

export function CustomerInfo({ formData, onInputChange }: CustomerInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">2</div>
          <h2 className="text-foreground text-xl font-bold">Información del Cliente</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              <User size={16} /> Nombre Completo
            </span>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              placeholder="Juan Pérez"
              className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Mail size={16} /> Correo Electrónico
            </span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="juan@ejemplo.com"
              className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
