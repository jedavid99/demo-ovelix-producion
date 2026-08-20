import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { exportToCSV } from '@/shared/lib/export';
import { toast } from '@/shared/components/ui/use-toast';
import { settingsApi } from '@/features/settings/services/settingsApi';
import type { TaxRate } from '@/features/settings/types/settings.types';
import type { Budget, NewBudget, BudgetErrors } from './Budgets.types';
import { initialNewBudget, ITEMS_PER_PAGE, newBudgetItem } from './Budgets.types';
import { budgetsApi, dtoToBudget, newBudgetToPayload, budgetToNewBudget } from './budgetsApi';

const getErrorMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    const e = err as { response?: { data?: { message?: unknown } }; message?: unknown };
    const m = e.response?.data?.message ?? e.message;
    if (typeof m === 'string') return m;
  }
  return '';
};

const LIST_LIMIT = 500;

export const useBudgets = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Opciones configurables por el admin (porcentajes y categorías de equipo)
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [deviceCategories, setDeviceCategories] = useState<string[]>([]);

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [newBudget, setNewBudget] = useState<NewBudget>(initialNewBudget);
  const [errors, setErrors] = useState<BudgetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBudgets = useCallback(async (): Promise<Budget[]> => {
    const res = await budgetsApi.list({ page: 1, limit: LIST_LIMIT });
    return res.data.map(dtoToBudget);
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      setBudgets(await loadBudgets());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [loadBudgets]);

  // Cargar presupuestos
  useEffect(() => {
    let active = true;
    loadBudgets()
      .then((data) => {
        if (!active) return;
        setBudgets(data);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadBudgets]);

  // Cargar porcentajes y categorías del admin al montar
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rates, cats] = await Promise.all([
          settingsApi.getTaxRates(),
          settingsApi.getCategories(),
        ]);
        if (!active) return;
        setTaxRates(Array.isArray(rates) ? rates : []);
        const catList: { nombre: string }[] = Array.isArray(cats) ? cats : [];
        const c = catList.map((x) => x.nombre || '').filter(Boolean);
        setDeviceCategories(c);
      } catch {
        if (!active) return;
        setTaxRates([]);
        setDeviceCategories([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Filtrar presupuestos
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (budget.numero || budget.id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalBudgets = filteredBudgets.length;
  const totalPending = filteredBudgets.filter((b) => b.status === 'Pendiente').length;
  const totalApproved = filteredBudgets.filter((b) => b.status === 'Aprobado').length;
  const totalValue = filteredBudgets.reduce((sum, b) => sum + b.total, 0);

  // Datos para gráfico de estado
  const statusData = [
    { name: 'Pendiente', value: totalPending },
    { name: 'Aprobado', value: totalApproved },
    {
      name: 'Rechazado',
      value: filteredBudgets.filter((b) => b.status === 'Rechazado').length,
    },
    {
      name: 'Completado',
      value: filteredBudgets.filter((b) => b.status === 'Completado').length,
    },
    {
      name: 'Vencido',
      value: filteredBudgets.filter((b) => b.status === 'Vencido').length,
    },
  ].filter((d) => d.value > 0);

  // Paginación
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredBudgets.length / ITEMS_PER_PAGE);

  // Exportar CSV
  const handleExport = useCallback(() => {
    const csvData = filteredBudgets.map((budget) => ({
      ID: budget.numero || budget.id,
      Cliente: budget.clientName,
      Teléfono: budget.clientPhone,
      Dispositivo: budget.device,
      Problema: budget.issue,
      Total: budget.total,
      Estado: budget.status,
      Fecha: format(budget.date, 'dd/MM/yyyy', { locale: es }),
    }));
    exportToCSV(csvData, 'presupuestos');
  }, [filteredBudgets]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    fetchBudgets();
  }, [fetchBudgets]);

  // Manejadores del modal
  const handleNewBudgetChange = useCallback(
    (field: string, value: string | number) => {
      setNewBudget((prev) => {
        const next = { ...prev, [field]: value };

        // Al cambiar el total base, recalcular el total con el porcentaje actual
        if (field === 'baseTotal') {
          next.baseTotal = Number(value) || 0;
          next.total = next.baseTotal * (1 + next.taxRatePorct / 100);
        }

        // Al elegir el tipo, si no hay líneas, iniciar una primera línea de producto
        if (field === 'tipo' && value && next.items.length === 0) {
          next.items = [newBudgetItem()];
        }

        // Al elegir un porcentaje, aplicar su valor al total
        if (field === 'taxRateId') {
          const rate = taxRates.find((r) => r.id === value);
          next.taxRateId = String(value);
          next.taxRateName = rate?.nombre || '';
          next.taxRatePorct = Number(rate?.porcentaje) || 0;
          next.total = next.baseTotal * (1 + (rate?.porcentaje || 0) / 100);
        }

        // Vigencia en días (1-365)
        if (field === 'vigenciaDias') {
          const parsed = Math.max(1, Math.min(365, Math.floor(Number(value)) || 7));
          next.vigenciaDias = parsed;
        }

        return next;
      });
      if (errors[field as keyof BudgetErrors]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors, taxRates]
  );

  const recalcFromItems = (items: NewBudget['items'], taxRatePorct: number) => {
    const baseTotal = items.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
    return { baseTotal, total: baseTotal * (1 + taxRatePorct / 100) };
  };

  const handleItemChange = useCallback(
    (id: string, field: 'deviceType' | 'device' | 'price', value: string | number) => {
      setNewBudget((prev) => {
        const items = prev.items.map((it) =>
          it.id === id
            ? { ...it, [field]: field === 'price' ? Number(value) || 0 : value }
            : it
        );
        const { baseTotal, total } = recalcFromItems(items, prev.taxRatePorct);
        return { ...prev, items, baseTotal, total };
      });
    },
    []
  );

  const handleAddItem = useCallback(() => {
    setNewBudget((prev) => ({ ...prev, items: [...prev.items, newBudgetItem()] }));
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setNewBudget((prev) => {
      const items = prev.items.filter((it) => it.id !== id);
      const { baseTotal, total } = recalcFromItems(items, prev.taxRatePorct);
      return { ...prev, items, baseTotal, total };
    });
  }, []);

  const validateNewBudget = useCallback((): boolean => {
    const newErrors: BudgetErrors = {};
    if (!newBudget.clientName.trim()) newErrors.clientName = 'El nombre del cliente es obligatorio';
    if (!newBudget.clientDni.trim()) newErrors.clientDni = 'El DNI es obligatorio';
    if (!newBudget.clientPhone.trim()) newErrors.clientPhone = 'El teléfono es obligatorio';
    if (!newBudget.tipo) newErrors.tipo = 'Seleccioná si es para venta o reparación';
    if (!newBudget.category.trim()) newErrors.category = 'Seleccioná la categoría del presupuesto';
    if (!newBudget.device.trim()) newErrors.device = 'Ingresá el dispositivo del presupuesto';
    if (newBudget.items.length === 0) {
      newErrors.items = 'Agregá al menos un producto';
    } else {
      const anyFilled = newBudget.items.some((it) => it.device.trim() && (Number(it.price) || 0) > 0);
      const allInvalid = newBudget.items.every((it) => !it.device.trim() && !it.deviceType.trim() && (Number(it.price) || 0) === 0);
      if (!anyFilled) newErrors.items = allInvalid ? 'Agregá al menos un producto' : 'Completá nombre y precio de cada producto';
    }
    if (newBudget.tipo === 'reparacion' && !newBudget.issue.trim())
      newErrors.issue = 'El problema es obligatorio';
    if (!newBudget.total || newBudget.total <= 0) newErrors.total = 'El total debe ser mayor a 0';
    const vigencia = Number(newBudget.vigenciaDias);
    if (!Number.isInteger(vigencia) || vigencia < 1 || vigencia > 365)
      newErrors.vigenciaDias = 'La vigencia debe ser entre 1 y 365 días';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newBudget]);

  const handleSaveBudget = useCallback(async () => {
    if (!validateNewBudget()) {
      toast({
        title: 'Faltan datos',
        description: 'Completá los campos marcados en rojo para poder guardar el presupuesto.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = newBudgetToPayload(newBudget);
      if (editingBudgetId) {
        const updated = await budgetsApi.update(editingBudgetId, payload);
        const mapped = dtoToBudget(updated);
        setBudgets((prev) => prev.map((b) => (b.id === editingBudgetId ? mapped : b)));
        toast({ title: 'Éxito', description: 'Presupuesto actualizado correctamente.' });
      } else {
        const created = await budgetsApi.create(payload);
        setBudgets((prev) => [dtoToBudget(created), ...prev]);
        toast({ title: 'Éxito', description: 'Presupuesto creado correctamente.' });
      }
      setIsModalOpen(false);
      setNewBudget(initialNewBudget);
      setEditingBudgetId(null);
      setErrors({});
    } catch (err) {
      const message = getErrorMessage(err);
      toast({
        title: 'Error',
        description: message || 'No se pudo guardar el presupuesto. Verificá la conexión e intentá de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newBudget, validateNewBudget, editingBudgetId]);

  const handleEditBudget = useCallback(
    (id: string) => {
      const budget = budgets.find((b) => b.id === id);
      if (!budget) return;
      setNewBudget(budgetToNewBudget(budget));
      setEditingBudgetId(id);
      setErrors({});
      setIsModalOpen(true);
    },
    [budgets]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  return {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    budgets,
    setBudgets,
    currentPage,
    setCurrentPage,
    filteredBudgets,
    paginatedBudgets,
    totalPages,
    totalBudgets,
    totalPending,
    totalApproved,
    totalValue,
    statusData,
    isModalOpen,
    setIsModalOpen,
    editingBudgetId,
    setEditingBudgetId,
    newBudget,
    setNewBudget,
    errors,
    setErrors,
    isSubmitting,
    handleExport,
    handleRetry,
    handleNewBudgetChange,
    handleSaveBudget,
    handleEditBudget,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    clearFilters,
    taxRates,
    deviceCategories,
  };
};