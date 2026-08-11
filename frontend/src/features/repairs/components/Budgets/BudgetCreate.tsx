import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdPerson,
  MdPhone,
  MdContactPage,
  MdDevices,
  MdBuild,
  MdStorefront,
  MdCategory,
  MdReceiptLong,
  MdArrowBack,
  MdSave,
  MdAdd,
  MdClose,
} from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { formatCurrency } from './Budgets.types';
import type { NewBudget, BudgetErrors, BudgetItem } from './Budgets.types';
import type { TaxRate } from '@/features/settings/types/settings.types';
import { cn } from '@/shared/lib/utils';

interface BudgetCreateProps {
  onClose: () => void;
  newBudget: NewBudget;
  onBudgetChange: (field: string, value: string | number) => void;
  onSave: () => void;
  errors: BudgetErrors;
  isSubmitting: boolean;
  taxRates: TaxRate[];
  deviceCategories: string[];
  onItemChange: (id: string, field: 'deviceType' | 'device' | 'price', value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

const TIPO_OPTIONS = [
  { value: 'venta', label: 'Venta', hint: 'Presupuesto de venta' },
  { value: 'reparacion', label: 'Reparación', hint: 'Presupuesto de reparación' },
];

const BUDGET_CATEGORY_OPTIONS = ['Equipo', 'Accesorio', 'Servicio', 'Otro'];

const FALLBACK_CATEGORIES = ['Celular', 'Tablet', 'Portátil', 'Consola', 'Smartwatch', 'Otro'];

const selectClass =
  'h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50';

const Section = ({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) => (
  <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
    {children}
  </section>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

const createStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const receiptLineVariants = {
  hidden: { opacity: 0, x: -4 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

function useCountUp(value: number, duration = 360) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || value === prev.current) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const start = prev.current;
    const change = value - start;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + change * eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else prev.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

export const BudgetCreate: React.FC<BudgetCreateProps> = ({
  onClose,
  newBudget,
  onBudgetChange,
  onSave,
  errors,
  isSubmitting,
  taxRates,
  deviceCategories,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  const visibleTaxRates = useMemo(() => {
    if (!newBudget.tipo) return [];
    const expected = newBudget.tipo === 'venta' ? 'ventas' : 'reparaciones';
    return taxRates.filter(
      (rate) =>
        rate.activo &&
        (!rate.seccion || rate.seccion === 'ambos' || rate.seccion === expected)
    );
  }, [taxRates, newBudget.tipo]);

  const hasTipo = Boolean(newBudget.tipo);
  const isRepair = newBudget.tipo === 'reparacion';
  const hasAmount = newBudget.baseTotal > 0;
  const animatedTotal = useCountUp(newBudget.total);

  const items = newBudget.items;

  const filledReceiptItems = items.filter((it) => it.device.trim() || it.deviceType.trim() || (Number(it.price) || 0) > 0);
  const emptySlip = !newBudget.clientName && !newBudget.clientDni && filledReceiptItems.length === 0;

  const receiptHeader = [
    { label: 'Cliente', value: newBudget.clientName, show: Boolean(newBudget.clientName) },
    { label: 'DNI', value: newBudget.clientDni, show: Boolean(newBudget.clientDni) },
    { label: 'Teléfono', value: newBudget.clientPhone, show: Boolean(newBudget.clientPhone) },
  ];

  return (
    <motion.div variants={createStagger} initial="hidden" animate="show" className="mx-auto w-full max-w-6xl px-1">
      {/* Cabecera */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div variants={receiptLineVariants}>
            <Button variant="ghost" size="sm" onClick={onClose} className="gap-2 px-2" aria-label="Volver a presupuestos">
              <MdArrowBack size={18} />
              Presupuestos
            </Button>
          </motion.div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Presupuesto · Borrador
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo presupuesto</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Formulario */}
        <div className="space-y-6">
          <motion.div variants={sectionVariants}>
            <Section eyebrow="Cliente">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bc-clientName">Nombre</Label>
                  <Input
                    id="bc-clientName"
                    value={newBudget.clientName}
                    onChange={(e) => onBudgetChange('clientName', e.target.value)}
                    placeholder="Nombre completo"
                    leftIcon={<MdPerson size={18} />}
                    error={errors.clientName}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bc-clientDni">DNI</Label>
                    <Input
                      id="bc-clientDni"
                      value={newBudget.clientDni}
                      onChange={(e) => onBudgetChange('clientDni', e.target.value)}
                      placeholder="00.000.000"
                      inputMode="numeric"
                      leftIcon={<MdContactPage size={18} />}
                      error={errors.clientDni}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bc-clientPhone">Teléfono</Label>
                    <Input
                      id="bc-clientPhone"
                      value={newBudget.clientPhone}
                      onChange={(e) => onBudgetChange('clientPhone', e.target.value)}
                      placeholder="11 2345 6789"
                      inputMode="tel"
                      leftIcon={<MdPhone size={18} />}
                      error={errors.clientPhone}
                    />
                  </div>
                </div>
              </div>
            </Section>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <Section eyebrow="Detalle">
              <div className="space-y-2">
                <Label>Tipo de presupuesto</Label>
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-1.5">
                  {TIPO_OPTIONS.map((opt) => {
                    const active = newBudget.tipo === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onBudgetChange('tipo', opt.value)}
                        aria-pressed={active}
                        className={cn(
                          'group relative isolate rounded-md px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          active ? 'text-primary-foreground' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="bc-tipo-active"
                            className="absolute inset-0 -z-10 rounded-md bg-primary"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className="flex items-center gap-2 font-medium">
                          <MdStorefront size={16} className={active ? 'text-primary-foreground' : ''} />
                          {opt.label}
                        </span>
                        <span className={cn('mt-0.5 block text-[11px]', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                          {opt.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.tipo && <p className="text-sm font-medium text-destructive">{errors.tipo}</p>}
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="bc-category">Categoría del presupuesto</Label>
                <div className="relative">
                  <MdCategory
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <select
                    id="bc-category"
                    value={newBudget.category}
                    onChange={(e) => onBudgetChange('category', e.target.value)}
                    className={cn(selectClass, 'pl-10')}
                  >
                    <option value="">Seleccionar...</option>
                    {BUDGET_CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="text-sm font-medium text-destructive">{errors.category}</p>}
              </div>
            </Section>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <Section eyebrow="Productos">
              {!hasTipo ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
                  <MdDevices className="mx-auto mb-2 text-muted-foreground" size={22} />
                  <p className="text-sm text-muted-foreground">
                    Elegí primero si es <span className="font-medium text-foreground">venta</span> o{' '}
                    <span className="font-medium text-foreground">reparación</span> para cargar productos.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item: BudgetItem, index: number) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 gap-2 md:grid-cols-[8.5rem_1fr_8.5rem_2.5rem] md:items-start"
                      >
                        <div className="space-y-1.5">
                          <Label htmlFor={`bc-itm-type-${item.id}`} className="sr-only">
                            Tipo de equipo
                          </Label>
                          <select
                            id={`bc-itm-type-${item.id}`}
                            value={item.deviceType}
                            onChange={(e) => onItemChange(item.id, 'deviceType', e.target.value)}
                            className={cn(selectClass, 'h-10')}
                          >
                            <option value="">Tipo</option>
                            {(deviceCategories.length ? deviceCategories : FALLBACK_CATEGORIES).map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`bc-itm-device-${item.id}`} className="sr-only">
                            Producto {index + 1}
                          </Label>
                          <Input
                            id={`bc-itm-device-${item.id}`}
                            value={item.device}
                            onChange={(e) => onItemChange(item.id, 'device', e.target.value)}
                            placeholder={isRepair ? 'Servicio o repuesto' : 'Producto'}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`bc-itm-price-${item.id}`} className="sr-only">
                            Precio
                          </Label>
                          <Input
                            id={`bc-itm-price-${item.id}`}
                            type="number"
                            value={item.price || ''}
                            onChange={(e) => onItemChange(item.id, 'price', e.target.value)}
                            placeholder="0,00"
                            min={0}
                            step={0.01}
                            rightIcon={<span className="font-mono text-muted-foreground">$</span>}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-0.5 h-10 w-10 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Eliminar producto ${index + 1}`}
                        >
                          <MdClose size={18} />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button type="button" variant="secondary" size="sm" onClick={onAddItem} className="gap-1.5">
                    <MdAdd size={16} />
                    Agregar producto
                  </Button>
                  {errors.items && <p className="text-sm font-medium text-destructive">{errors.items}</p>}

                  <AnimatePresence>
                    {isRepair && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-2">
                          <Label htmlFor="bc-issue">Problema</Label>
                          <Input
                            id="bc-issue"
                            value={newBudget.issue}
                            onChange={(e) => onBudgetChange('issue', e.target.value)}
                            placeholder="Descripción del problema"
                            leftIcon={<MdBuild size={18} />}
                            error={errors.issue}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Section>
          </motion.div>

          <motion.div variants={sectionVariants}>
            <Section eyebrow="Precio">
              <div className="space-y-2">
                <Label htmlFor="bc-taxRate">Porcentaje (admin)</Label>
                <select
                  id="bc-taxRate"
                  value={newBudget.taxRateId}
                  onChange={(e) => onBudgetChange('taxRateId', e.target.value)}
                  disabled={!hasTipo}
                  className={cn(selectClass, hasTipo ? '' : 'text-muted-foreground')}
                >
                  <option value="">
                    {!hasTipo ? 'Elegí el tipo primero' : 'Seleccionar...'}
                  </option>
                  {visibleTaxRates.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.nombre} · {Number(rate.porcentaje)}%
                    </option>
                  ))}
                  {hasTipo && visibleTaxRates.length === 0 && (
                    <option value="" disabled>
                      Sin porcentajes activos para este tipo
                    </option>
                  )}
                </select>
                {newBudget.taxRateName && (
                  <p className="font-mono text-xs text-muted-foreground">
                    {newBudget.taxRateName} · +{newBudget.taxRatePorct}%
                  </p>
                )}
              </div>
            </Section>
          </motion.div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="min-w-[9rem]">
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={isSubmitting} className="gap-2">
              {isSubmitting ? 'Guardando...' : (
                <>
                  <MdSave className="h-4 w-4" />
                  Guardar presupuesto
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recibo (el slip de presupuesto en vivo) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="relative overflow-hidden rounded-xl border border-border shadow-sm bg-[#FDFBF7] dark:bg-[#191C22]">
            <div className="flex items-center justify-between border-b border-dashed p-5">
              <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground">
                <MdReceiptLong size={18} className="text-primary" />
                OVELIX
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Cotización
              </span>
            </div>

            <div className="p-5">
              {emptySlip ? (
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  El recibo se completa mientras escribís.<br />
                  Tipeá el nombre y cargá productos para verlo aquí.
                </p>
              ) : (
                <>
                  <dl className="space-y-3">
                    {receiptHeader.map((line) =>
                      line.show ? (
                        <motion.div
                          key={line.label}
                          variants={receiptLineVariants}
                          initial="hidden"
                          animate="show"
                          className="flex items-baseline justify-between gap-4 border-b border-dashed border-border pb-1.5"
                        >
                          <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                            {line.label}
                          </dt>
                          <dd className="truncate font-mono text-sm text-foreground">{line.value}</dd>
                        </motion.div>
                      ) : null
                    )}
                  </dl>

                  {filledReceiptItems.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {filledReceiptItems.length} {filledReceiptItems.length === 1 ? 'producto' : 'productos'}
                      </p>
                      <dl className="space-y-1.5">
                        {filledReceiptItems.map((it) => (
                          <motion.div
                            key={it.id}
                            variants={receiptLineVariants}
                            initial="hidden"
                            animate="show"
                            className="flex items-baseline justify-between gap-3"
                          >
                            <dt className="truncate font-mono text-sm text-foreground">
                              {it.device || (it.deviceType ? `${it.deviceType} (sin nombre)` : 'Producto')}
                            </dt>
                            <dd className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                              {(Number(it.price) || 0) > 0 ? formatCurrency(it.price) : '—'}
                            </dd>
                          </motion.div>
                        ))}
                      </dl>
                    </div>
                  )}
                </>
              )}

              <AnimatePresence>
                {hasAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex items-end justify-between font-mono text-sm">
                      <span className="text-muted-foreground">Base</span>
                      <span className="tabular-nums text-foreground">{formatCurrency(newBudget.baseTotal)}</span>
                    </div>
                    <div className="mt-1 flex items-end justify-between font-mono text-sm">
                      <span className="text-muted-foreground">Recargo ({newBudget.taxRatePorct}%)</span>
                      <span className="tabular-nums text-muted-foreground">
                        {newBudget.taxRatePorct > 0
                          ? formatCurrency(newBudget.total - newBudget.baseTotal)
                          : '—'}
                      </span>
                    </div>

                    <div className="mt-4 border-t-2 border-dashed pt-3">
                      <div className="flex items-baseline justify-between text-primary">
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em]">A pagar</span>
                        <span className="font-mono text-3xl font-bold leading-none tabular-nums">
                          {formatCurrency(animatedTotal)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetCreate;