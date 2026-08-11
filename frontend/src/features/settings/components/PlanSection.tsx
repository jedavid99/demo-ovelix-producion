import React, { useState } from 'react';
import { Crown, CalendarDays, Save } from 'lucide-react';
import type { PlanSubscription } from '../types/settings.types';
import { PLAN_LABELS, PLAN_MONTHS_OPTIONS } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';

interface PlanSectionProps {
  plan: PlanSubscription | null;
  setPlan: React.Dispatch<React.SetStateAction<PlanSubscription | null>>;
  isDeveloper: boolean;
}

const PLAN_COLORS: Record<string, string> = {
  DEMO: 'bg-muted dark:bg-muted text-muted-foreground',
  BASICO: 'bg-primary/5 dark:bg-blue-900/20 text-primary dark:text-blue-300',
  PRO: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300',
  PLATINO: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300',
};

export const PlanSection: React.FC<PlanSectionProps> = ({ plan, setPlan, isDeveloper }) => {
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
    } catch (e) {
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
      <div className="bg-card  rounded-xl border border-border  overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border  flex items-center gap-3">
          <div className="size-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
            <Crown className="text-amber-500" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Tu plan actual</h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Plan disponible y fecha de vencimiento de tu cuenta</p>
          </div>
        </div>

        {plan ? (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-transparent rounded-xl border border-border ">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg font-black text-lg ${PLAN_COLORS[plan.plan] || PLAN_COLORS.DEMO}`}>
                    {PLAN_LABELS[plan.plan] || plan.plan}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.activo ? 'bg-green-50 dark:bg-green-900/20 text-success dark:text-green-300' : 'bg-destructive/10 dark:bg-red-900/20 text-destructive dark:text-red-300'}`}>
                    {plan.activo ? 'Activo' : 'Inactivo'}
                  </span>
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
              <div className="mt-6 p-6 border border-border dark:border-border rounded-xl bg-muted dark:bg-muted/50">
                <h3 className="font-bold text-foreground mb-4">Administrar plan (desarrollador)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">Plan</label>
                    <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                      {Object.entries(PLAN_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">Duración (meses)</label>
                    <select className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground" value={selectedMonths} onChange={(e) => setSelectedMonths(parseInt(e.target.value))}>
                      {PLAN_MONTHS_OPTIONS.map(m => (
                        <option key={m} value={m}>{m} {m === 1 ? 'mes' : 'meses'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={savePlan} disabled={saving} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar plan'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center py-10 text-muted-foreground">
            <p className="font-medium">No hay información de plan disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PlanSection;
