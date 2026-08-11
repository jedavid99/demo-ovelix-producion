import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { exportToCSV } from '@/shared/lib/export';
import { settingsApi } from '@/features/settings/services/settingsApi';
import type { TaxRate } from '@/features/settings/types/settings.types';
import type { Budget, NewBudget, BudgetErrors } from './Budgets.types';
import { initialNewBudget, ITEMS_PER_PAGE, STATUS_FILTERS, newBudgetItem } from './Budgets.types';

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
  const [newBudget, setNewBudget] = useState<NewBudget>(initialNewBudget);
  const [errors, setErrors] = useState<BudgetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/budgets').then(res => setBudgets(res.data)).catch(() => setError(true)).finally(() => setLoading(false))
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

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
      budget.id.toLowerCase().includes(searchQuery.toLowerCase());
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
      ID: budget.id,
      Cliente: budget.clientName,
      Teléfono: budget.clientPhone,
      Dispositivo: budget.device,
      Problema: budget.issue,
      Total: budget.total,
      Estado: budget.status,
      Fecha: format(budget.date, 'dd/MM/yyyy', { locale: es }),
      Técnico: budget.technician,
    }));
    exportToCSV(csvData, 'presupuestos');
  }, [filteredBudgets]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    // api.get('/budgets').then(...)
    setLoading(false);
  }, []);

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
          next.taxRatePorct = rate?.porcentaje || 0;
          next.total = next.baseTotal * (1 + (rate?.porcentaje || 0) / 100);
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
    if (!newBudget.technician.trim()) newErrors.technician = 'El técnico es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newBudget]);

  const handleSaveBudget = useCallback(async () => {
    if (!validateNewBudget()) return;
    setIsSubmitting(true);

    // Simular llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const filledItems = newBudget.items.filter((it) => it.device.trim() || it.deviceType.trim());
    const budget: Budget = {
      id: `BUD-${Date.now()}`,
      ...newBudget,
      device: filledItems.map((it) => it.device.trim()).filter(Boolean).join(' · ') || newBudget.device,
      deviceType: filledItems[0]?.deviceType || newBudget.deviceType,
      items: filledItems,
      status: 'Pendiente',
      date: new Date(),
    };

    setBudgets((prev) => [budget, ...prev]);
    setIsModalOpen(false);
    setNewBudget(initialNewBudget);
    setErrors({});
    setIsSubmitting(false);
  }, [newBudget, validateNewBudget]);

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
    newBudget,
    setNewBudget,
    errors,
    setErrors,
    isSubmitting,
    handleExport,
    handleRetry,
    handleNewBudgetChange,
    handleSaveBudget,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    clearFilters,
    taxRates,
    deviceCategories,
  };
};
