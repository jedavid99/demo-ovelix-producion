import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

interface DatesAmountsSectionProps {
  formData: InsuranceFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof InsuranceFormData, value: string) => void;
}

export const DatesAmountsSection = ({ formData, errors, onFieldChange }: DatesAmountsSectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Calendar size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Fechas y Montos</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="startDate" className="text-xs font-semibold">Inicio *</Label>
          <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => onFieldChange('startDate', e.target.value)} className="h-8 text-sm" />
          {errors.startDate && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.startDate}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate" className="text-xs font-semibold">Fin *</Label>
          <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => onFieldChange('endDate', e.target.value)} className="h-8 text-sm" />
          {errors.endDate && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.endDate}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="premium" className="text-xs font-semibold">Prima Anual ($) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="premium" type="number" step="0.01" value={formData.premium} onChange={(e) => onFieldChange('premium', e.target.value)} placeholder="0.00" className="h-8 pl-7 text-sm" />
          </div>
          {errors.premium && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.premium}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="deductible" className="text-xs font-semibold">Deducible ($)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="deductible" type="number" step="0.01" value={formData.deductible} onChange={(e) => onFieldChange('deductible', e.target.value)} placeholder="0.00" className="h-8 pl-7 text-sm" />
          </div>
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="coverageAmount" className="text-xs font-semibold">Cobertura Máxima ($) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="coverageAmount" type="number" step="0.01" value={formData.coverageAmount} onChange={(e) => onFieldChange('coverageAmount', e.target.value)} placeholder="0.00" className="h-8 pl-7 text-sm" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
