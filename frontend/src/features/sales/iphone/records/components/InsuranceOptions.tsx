import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { IPhoneRecordForm, BillingCycle } from '../types';

interface InsuranceOptionsProps {
  formData: IPhoneRecordForm;
  insuranceEnabled: boolean;
  billingCycle: BillingCycle;
  onToggleInsurance: (enabled: boolean) => void;
  onInputChange: (field: string, value: string | number) => void;
  onBillingCycleChange: (cycle: BillingCycle) => void;
}

export function InsuranceOptions({
  formData, insuranceEnabled, billingCycle,
  onToggleInsurance, onInputChange, onBillingCycleChange,
}: InsuranceOptionsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">3</div>
            <h2 className="text-foreground text-xl font-bold">Seguro iPhone</h2>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={insuranceEnabled}
              onChange={(e) => onToggleInsurance(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            <span className="ml-3 text-sm font-medium text-foreground">Activar Cobertura</span>
          </label>
        </div>
        {insuranceEnabled && (
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Shield size={16} /> Plan de Seguro
                </span>
                <select
                  value={formData.insurancePlan}
                  onChange={(e) => onInputChange('insurancePlan', e.target.value)}
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                >
                  <option>Cobertura Completa (Robo + Daño)</option>
                  <option>Pro (Daño Accidental)</option>
                  <option>Básico (Extendido de Fabricante)</option>
                </select>
              </label>
              <div>
                <span className="text-sm font-semibold text-foreground block mb-2">Ciclo de Facturación</span>
                <div className="flex bg-background p-1 rounded-lg border border-input">
                  <Button
                    variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onBillingCycleChange('monthly')}
                    className="flex-1"
                  >
                    Mensual
                  </Button>
                  <Button
                    variant={billingCycle === 'annual' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onBillingCycleChange('annual')}
                    className="flex-1"
                  >
                    Anual
                  </Button>
                </div>
              </div>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Prima del Seguro</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <input
                    type="text"
                    disabled
                    value={formData.premium.toFixed(2)}
                    className="rounded-lg border border-input bg-muted text-primary py-3 pl-8 pr-4 focus:outline-none w-full h-12 font-bold"
                  />
                </div>
              </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
