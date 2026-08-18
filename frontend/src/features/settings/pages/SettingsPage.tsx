import React from 'react';
import { Cloud, CalendarDays, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { SECTIONS } from '../constants/settings.constants';
import { BusinessSection } from '../components/BusinessSection';
import { CategoriaSection } from '../components/CategoriaSection';
import { TaxesSection } from '../components/TaxesSection';
import { NotificationsSection } from '../components/NotificationsSection';
import { ApiSection } from '../components/ApiSection';
import { PlanSection } from '../components/PlanSection';
import { PDFSection } from '../components/PDFSection';
import { TenantPageSection } from '../components/TenantPageSection';
import { PLAN_LABELS } from '../types/settings.types';

function LeftNav({ current, onChange, plan }: { current: string; onChange: (id: string) => void; plan: any }) {
  return (
    <aside className="w-64 pr-6 hidden lg:block">
      <div className="sticky top-6 space-y-4">
        <div className="text-sm font-semibold text-foreground dark:text-muted-foreground">CONFIGURACIÓN</div>
        <div className="bg-card  rounded-xl shadow-sm divide-y">
          <div className="p-3">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${current === s.id ? 'bg-primary/5 dark:bg-blue-900/30 text-primary dark:text-blue-300' : 'hover:bg-muted dark:hover:bg-muted text-foreground dark:text-muted-foreground'}`}
              >
                <div className="text-muted-foreground">{s.icon}</div>
                <div className="flex-1">{s.label}</div>
              </button>
            ))}
          </div>
          <div className="p-3">
            <div className="rounded bg-primary/5 dark:bg-blue-900/30 p-3 text-sm text-primary dark:text-blue-300">
              PLAN {PLAN_LABELS[plan?.plan] || plan?.plan || 'PRO'}
              <br />
              <span className="text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-1 mt-1">
                <CalendarDays size={12} />
                {plan?.fecha_vencimiento
                  ? `Vence: ${new Date(plan.fecha_vencimiento).toLocaleDateString('es-AR')}`
                  : 'Sin datos de uso disponibles'}
              </span>
            </div>
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
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-pressed={current === s.id}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              current === s.id
                ? 'border-primary bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-300'
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
    <div className="min-h-screen bg-muted">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <LeftNav current={section} onChange={setSection} plan={plan} />
        <main className="flex-1 min-w-0">
          <MobileSectionNav current={section} onChange={setSection} />
          <div className="mb-6" />
          {configError && !sectionLoading && (
            <div className="mb-4 flex items-center justify-between gap-4 bg-destructive/10 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              <p className="text-sm">{configError}</p>
              <button onClick={reloadCurrent} className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive text-white rounded-lg text-xs font-bold hover:bg-destructive/90 transition-all whitespace-nowrap">
                <RefreshCw size={14} /> Reintentar
              </button>
            </div>
          )}
          {sectionLoading && section !== 'pdf' && (
            <div className="flex items-center justify-center py-24">
              <div className="flex items-center gap-3 text-muted-foreground dark:text-muted-foreground">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
    </div>
  );
}
export { SettingsPage as Settings };
