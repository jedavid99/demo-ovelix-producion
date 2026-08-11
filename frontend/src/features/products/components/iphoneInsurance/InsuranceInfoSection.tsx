import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { PROVIDERS, COVERAGE_TYPES } from '../../constants/iphoneInsurance/insurance.constants';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

interface InsuranceInfoSectionProps {
  formData: InsuranceFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof InsuranceFormData, value: string) => void;
}

export const InsuranceInfoSection = ({ formData, errors, onFieldChange }: InsuranceInfoSectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Shield size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Información del Seguro</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="insuranceProvider" className="text-xs font-semibold">Proveedor *</Label>
          <select id="insuranceProvider" value={formData.insuranceProvider} onChange={(e) => onFieldChange('insuranceProvider', e.target.value)}
            className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Seleccionar</option>
            {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.insuranceProvider && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.insuranceProvider}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="policyNumber" className="text-xs font-semibold">Número de Póliza *</Label>
          <Input id="policyNumber" value={formData.policyNumber} onChange={(e) => onFieldChange('policyNumber', e.target.value)} placeholder="Ej. POL-123456789" className="h-8 text-sm" />
          {errors.policyNumber && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.policyNumber}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Tipo de Cobertura</Label>
          <select value={formData.coverageType} onChange={(e) => onFieldChange('coverageType', e.target.value)}
            className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {COVERAGE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {COVERAGE_TYPES.map((type) => (
          <button key={type.value} onClick={() => onFieldChange('coverageType', type.value)}
            className={`p-2 rounded-lg border text-center transition-all ${
              formData.coverageType === type.value
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/40'
            }`}>
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                formData.coverageType === type.value ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {formData.coverageType === type.value && <CheckCircle size={8} className="text-white" />}
              </div>
              <span className="text-xs font-semibold">{type.label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{type.description}</p>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);
