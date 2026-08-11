import { useState, useEffect, useCallback, useRef } from 'react';
import { useBusinessInfo, useBusinessInfoMutations } from '@/hooks/useBusinessInfo';
import { settingsApi } from '../services/settingsApi';
import type {
  PaymentMethod,
  TaxRate,
  BankAccount,
  NotificationPreference,
  Integration,
  PlanSubscription,
  RepairStateRequest,
  StockCategory,
} from '../types/settings.types';

const PROFILE_REQUESTS = [
  settingsApi.getRepairStates,
  settingsApi.getRepairStateRequests,
  settingsApi.getPaymentMethods,
] as const;

export function useSettings() {
  const [section, setSection] = useState('business');
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  const { data: businessInfo, loading, error, refetch } = useBusinessInfo();
  const { updateBusinessInfo, loading: mutationLoading } = useBusinessInfoMutations();

  // Datos de configuración
  const [repairStates, setRepairStates] = useState<string[]>([]);
  const [stateRequests, setStateRequests] = useState<RepairStateRequest[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [plan, setPlan] = useState<PlanSubscription | null>(null);
  const [categories, setCategories] = useState<StockCategory[]>([]);

  const [sectionLoading, setSectionLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const loadedSections = useRef<Set<string>>(new Set(['pdf']));

  // ---------- Carga por sección (solo lo que cada sección necesita) ----------

  const loadProfile = useCallback(async () => {
    setSectionLoading(true);
    setConfigError(null);
    try {
      const results = await Promise.allSettled(PROFILE_REQUESTS.map((fn) => fn()));
      if (results[0].status === 'fulfilled') setRepairStates(results[0].value);
      if (results[1].status === 'fulfilled') setStateRequests(results[1].value);
      if (results[2].status === 'fulfilled') setPaymentMethods(results[2].value);
      const failed = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
      if (failed) setConfigError(failed.reason?.message || 'Error al cargar la configuración');
    } catch (e: any) {
      setConfigError(e?.message || 'Error al cargar la configuración');
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const loadPlan = useCallback(async () => {
    try {
      setPlan(await settingsApi.getPlan());
    } catch {
      // La tarjeta del plan muestra un default si aún no hay plan
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setSectionLoading(true);
    setConfigError(null);
    try {
      setCategories(await settingsApi.getCategories());
    } catch (e: any) {
      setConfigError(e?.message || 'Error al cargar las categorías');
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const loadTaxes = useCallback(async () => {
    setSectionLoading(true);
    setConfigError(null);
    try {
      const [rates, accounts] = await Promise.all([
        settingsApi.getTaxRates(),
        settingsApi.getBankAccounts(),
      ]);
      setTaxRates(rates);
      setBankAccounts(accounts);
    } catch (e: any) {
      setConfigError(e?.message || 'Error al cargar impuestos y pagos');
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setSectionLoading(true);
    setConfigError(null);
    try {
      setNotificationPrefs(await settingsApi.getNotificationPreferences());
    } catch (e: any) {
      setConfigError(e?.message || 'Error al cargar las notificaciones');
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const loadApi = useCallback(async () => {
    setSectionLoading(true);
    setConfigError(null);
    try {
      setIntegrations(await settingsApi.getIntegrations());
    } catch (e: any) {
      setConfigError(e?.message || 'Error al cargar las integraciones');
    } finally {
      setSectionLoading(false);
    }
  }, []);

  const sectionLoaders: Record<string, () => Promise<void>> = {
    business: loadProfile,
    Categoria: loadCategories,
    taxes: loadTaxes,
    notificationes: loadNotifications,
    api: loadApi,
    plan: loadPlan,
  };

  // Carga inicial: datos del perfil + plan (tarjeta lateral)
  useEffect(() => {
    loadProfile();
    loadPlan();
    loadedSections.current.add('business');
    loadedSections.current.add('plan');
  }, [loadProfile, loadPlan]);

  // Cambio de sección: carga perezosa solo si no se cargó antes
  useEffect(() => {
    const loader = sectionLoaders[section];
    if (loader && !loadedSections.current.has(section)) {
      loadedSections.current.add(section);
      loader();
    }
  }, [section, sectionLoaders]);

  const reloadCurrent = useCallback(() => {
    const loader = sectionLoaders[section];
    if (loader) loader();
  }, [section, sectionLoaders]);

  const handleBusinessEdit = async (data: any) => {
    const result = await updateBusinessInfo(data);
    if (result) {
      refetch();
      setIsEditingBusiness(false);
    }
  };

  return {
    section,
    setSection,
    isEditingBusiness,
    setIsEditingBusiness,
    businessInfo,
    loading,
    error,
    mutationLoading,
    refetch,
    handleBusinessEdit,
    sectionLoading,
    configError,
    reloadCurrent,
    repairStates,
    stateRequests,
    setStateRequests,
    paymentMethods,
    setPaymentMethods,
    taxRates,
    setTaxRates,
    bankAccounts,
    setBankAccounts,
    notificationPrefs,
    setNotificationPrefs,
    integrations,
    setIntegrations,
    plan,
    setPlan,
    categories,
    setCategories,
  };
}
