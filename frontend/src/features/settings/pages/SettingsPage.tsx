import React from 'react';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { SECTIONS, SECTION_GROUPS } from '../constants/settings.constants';
import { PLAN_LABELS } from '../types/settings.types';
import { Badge } from '@/shared/components/ui/badge';
import { BusinessSection } from '../components/BusinessSection';
import { CategoriaSection } from '../components/CategoriaSection';
import { TaxesSection } from '../components/TaxesSection';
import { NotificationsSection } from '../components/NotificationsSection';
import { ApiSection } from '../components/ApiSection';
import { PlanSection } from '../components/PlanSection';
import { PDFSection } from '../components/PDFSection';
import { TenantPageSection } from '../components/TenantPageSection';

const PLAN_BADGE: Record<string, string> = {
  DEMO: 'bg-muted text-muted-foreground border border-border',
  BASICO: 'bg-primary/10 text-primary',
  PRO: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
  PLATINO: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <Badge className={PLAN_BADGE[plan] || PLAN_BADGE.DEMO}>
      {PLAN_LABELS[plan] || plan || 'Demo'}
    </Badge>
  );
}

function LeftNav({ current, onChange, plan }: { current: string; onChange: (id: string) => void; plan: any }) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block" aria-label="Secciones de configuración">
      <div className="sticky top-6 space-y-6">
        <nav className="space-y-5">
          {SECTION_GROUPS.map((group) => {
            const items = SECTIONS.filter((s) => s.group === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id}>
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {items.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onChange(s.id)}
                      aria-current={current === s.id ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        current === s.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className={current === s.id ? 'text-primary' : ''}>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Plan</span>
            <PlanBadge plan={plan?.plan} />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays size={12} className="shrink-0" />
            {plan?.fecha_vencimiento
              ? `Vence el ${new Date(plan.fecha_vencimiento).toLocaleDateString('es-AR')}`
              : 'Sin datos de uso disponibles'}
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileSectionNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <nav className="lg:hidden -mx-1 mb-6 overflow-x-auto pb-1" aria-label="Secciones de configuración">
      <div className="flex gap-2 px-1 w-max">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-pressed={current === s.id}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              current === s.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            <span className="text-muted-foreground">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

const resolveUser = (u: any) => (u?.data && u?.statusCode ? u.data : u);

export default function SettingsPage() {
  const {
    section, setSection,
    isEditingBusiness, setIsEditingBusiness, businessInfo,
    loading, error, mutationLoading, handleBusinessEdit,
    sectionLoading, configError, reloadCurrent,
    repairStates, stateRequests, setStateRequests,
    paymentMethods, setPaymentMethods,
    taxRates, setTaxRates,
    bankAccounts, setBankAccounts,
    notificationPrefs, setNotificationPrefs,
    integrations, setIntegrations,
    plan, setPlan,
    categories, setCategories,
  } = useSettings();

  const { user: rawUser } = useAuth();
  const user = resolveUser(rawUser);
  const userRol = typeof user?.rol === 'string' ? user?.rol : user?.rol?.name;
  const isDeveloper = userRol === 'DESARROLLADOR';

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start">
      <LeftNav current={section} onChange={setSection} plan={plan} />
      <main className="min-w-0 flex-1">
        <MobileSectionNav current={section} onChange={setSection} />
        {configError && !sectionLoading && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive"
          >
            <p className="text-sm">{configError}</p>
            <button
              onClick={reloadCurrent}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-destructive/90"
            >
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        )}
        {sectionLoading && section !== 'pdf' && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Cargando...</span>
            </div>
          </div>
        )}
        {!sectionLoading && section === 'business' && (
          <BusinessSection
            loading={loading} error={error} businessInfo={businessInfo}
            isEditingBusiness={isEditingBusiness} setIsEditingBusiness={setIsEditingBusiness}
            mutationLoading={mutationLoading} handleBusinessEdit={handleBusinessEdit}
            repairStates={repairStates} stateRequests={stateRequests} setStateRequests={setStateRequests}
            paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods}
          />
        )}
        {!sectionLoading && section === 'tenantPage' && <TenantPageSection />}
        {!sectionLoading && section === 'Categoria' && <CategoriaSection categories={categories} setCategories={setCategories} />}
        {!sectionLoading && section === 'taxes' && <TaxesSection taxRates={taxRates} setTaxRates={setTaxRates} bankAccounts={bankAccounts} setBankAccounts={setBankAccounts} />}
        {!sectionLoading && section === 'notificationes' && <NotificationsSection notificationPrefs={notificationPrefs} setNotificationPrefs={setNotificationPrefs} />}
        {!sectionLoading && section === 'api' && <ApiSection integrations={integrations} setIntegrations={setIntegrations} />}
        {!sectionLoading && section === 'plan' && <PlanSection plan={plan} setPlan={setPlan} isDeveloper={isDeveloper} />}
        {section === 'pdf' && <PDFSection />}
      </main>
    </div>
  );
}
export { SettingsPage as Settings };