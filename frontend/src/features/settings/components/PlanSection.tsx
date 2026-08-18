import React, { useState } from 'react';
import { Crown, CalendarDays, Save, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { PlanSubscription } from '../types/settings.types';
import { PLAN_LABELS, PLAN_MONTHS_OPTIONS } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import { getSectionMeta } from '../constants/settings.constants';
import { SectionHeader } from './ui/SectionHeader';
import { SettingsCard } from './ui/SettingsCard';
import { Field } from './ui/Field';

interface PlanSectionProps {
  plan: PlanSubscription | null;
  setPlan: React.Dispatch<React.SetStateAction<PlanSubscription | null>>;
  isDeveloper: boolean;
}

const PLAN_BADGE: Record<string, string> = {
  DEMO: 'bg-muted text-muted-foreground',
  BASICO: 'bg-primary/10 text-primary',
  PRO: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
  PLATINO: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
};

export const PlanSection: React.FC<PlanSectionProps> = ({ plan, setPlan, isDeveloper }) => {
  const meta = getSectionMeta('plan');
  const [selectedPlan, setSelectedPlan] = useState(plan?.plan || 'DEMO');
  const [selectedMonths, setSelectedMonths] = useState(plan?.meses || 1);
  const [saving, setSaving] = useState(false);

  const savePlan = async () => {
    setSaving(true);
    try {
      const updated = await settingsApi.updatePlan({
        plan: selectedPlan,
        meses: selectedMonths,
      });
      setPlan(updated);
      toast({ title: 'Éxito', description: 'Plan actualizado correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar el plan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const daysLeft = plan ? Math.max(0, Math.ceil((new Date(plan.fecha_vencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.label} description={meta.description} />

      <SettingsCard
        title="Tu plan actual"
        description="Plan disponible y fecha de vencimiento de tu cuenta"
        icon={<Crown size={18} />}
      >
        {plan ? (
          <>
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-gradient-to-r from-muted/60 to-transparent p-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`rounded-lg px-3 py-1.5 text-lg font-bold ${PLAN_BADGE[plan.plan] || PLAN_BADGE.DEMO}`}>
                    {PLAN_LABELS[plan.plan] || plan.plan}
                  </span>
                  <Badge variant={plan.activo ? 'success' : 'destructive'}>
                    {plan.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} className="text-primary" />
                  Vence el {formatDate(plan.fecha_vencimiento)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Meses contratados: {plan.meses}</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-4xl font-black text-foreground">{daysLeft}</p>
                <p className="text-xs text-muted-foreground">días restantes</p>
              </div>
            </div>

            {isDeveloper && (
              <div className="mt-6 rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-5">
                <h3 className="mb-4 font-semibold text-foreground">Administrar plan (desarrollador)</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Plan" htmlFor="plan-select">
                    <select
                      id="plan-select"
                      className="h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      {Object.entries(PLAN_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Duración (meses)" htmlFor="plan-meses">
                    <select
                      id="plan-meses"
                      className="h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                      value={selectedMonths}
                      onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
                    >
                      {PLAN_MONTHS_OPTIONS.map(m => (
                        <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Button onClick={savePlan} disabled={saving} className="mt-4">
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar plan'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
            <CreditCard size={28} className="mb-1 opacity-40" />
            <p className="font-medium">No hay información de plan disponible</p>
          </div>
        )}
      </SettingsCard>
    </div>
  );
};
export default PlanSection;