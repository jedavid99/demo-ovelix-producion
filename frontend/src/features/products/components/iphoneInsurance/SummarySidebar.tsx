import { Shield, Info } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { calculateDuration, COVERAGE_TYPES } from '../../constants/iphoneInsurance/insurance.constants';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

interface SummarySidebarProps {
  formData: InsuranceFormData;
  isSaving: boolean;
  onSubmit: () => void;
}

export const SummarySidebar = ({ formData, isSaving, onSubmit }: SummarySidebarProps) => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Shield size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground">Resumen</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Duración</span>
            <Badge variant="outline" className="text-xs font-mono">
              {calculateDuration(formData.startDate, formData.endDate)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Costo mensual</span>
            <span className="text-sm font-bold text-success">
              {formData.premium ? formatCurrency(parseFloat(formData.premium) / 12) : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Cobertura</span>
            <span className="text-xs font-medium">
              {COVERAGE_TYPES.find((t) => t.value === formData.coverageType)?.label || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Deducible</span>
            <span className="text-xs font-medium">
              {formData.deductible ? `$${formData.deductible}` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Prima anual</span>
            <span className="text-sm font-bold text-foreground">
              {formData.premium ? `$${formData.premium}` : '—'}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 bg-primary/5 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
          <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-primary dark:text-blue-300">
            Guarda el número de póliza y contacto del proveedor para futuras reclamaciones.
          </p>
        </div>
      </CardContent>
    </Card>
    <Button onClick={onSubmit} className="w-full" disabled={isSaving}>
      {isSaving ? 'Guardando...' : 'Guardar seguro'}
    </Button>
  </div>
);
