import { AlertCircle, LucideBanknote, Landmark } from 'lucide-react';
import { MdAdd, MdCreditCard } from 'react-icons/md';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { categories, suppliers, currencies } from '../constants';
import type { ExpenseForm } from '../types';

interface FormFieldsProps {
  form: ExpenseForm;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function FormFields({ form, errors, onChange }: FormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 space-y-1">
        <Label htmlFor="title" className="text-xs font-semibold">
          Descripci&oacute;n <span className="text-destructive">*</span>
        </Label>
        <Input id="title" value={form.title} onChange={(e) => onChange('title', e.target.value)}
          placeholder="Ej. Alquiler mensual"
          className={`h-9 text-sm ${errors.title ? 'border-destructive' : ''}`}
        />
        {errors.title && <ErrorText msg={errors.title} />}
      </div>
      <SelectField id="category" label="Categoría" value={form.category} error={errors.category}
        onChange={(v) => onChange('category', v)} options={categories} required />
      <div className="space-y-1">
        <Label htmlFor="supplier" className="text-xs font-semibold">
          Proveedor <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-1">
          <select id="supplier" value={form.supplier} onChange={(e) => onChange('supplier', e.target.value)}
            className={`flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.supplier ? 'border-destructive' : ''}`}
          >
            <option value="">Seleccionar</option>
            {suppliers.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button type="button" className="h-9 px-3 rounded-lg border border-input bg-muted/30 hover:bg-muted flex items-center text-primary text-xs font-medium">
            <MdAdd size={16} />
          </button>
        </div>
        {errors.supplier && <ErrorText msg={errors.supplier} />}
      </div>
    </div>
  );
}

export function AmountCurrencyRow({ form, errors, onChange }: FormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <div className="space-y-1">
        <Label htmlFor="amount" className="text-xs font-semibold">
          Monto <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <Input id="amount" type="number" step="0.01" value={form.amount}
            onChange={(e) => onChange('amount', e.target.value)} placeholder="0.00"
            className={`h-9 pl-7 text-sm ${errors.amount ? 'border-destructive' : ''}`}
          />
        </div>
        {errors.amount && <ErrorText msg={errors.amount} />}
      </div>
      <SelectField id="currency" label="Moneda" value={form.currency}
        onChange={(v) => onChange('currency', v)} options={currencies} />
      <div className="space-y-1">
        <Label htmlFor="date" className="text-xs font-semibold">
          Fecha <span className="text-destructive">*</span>
        </Label>
        <Input id="date" type="date" value={form.date}
          onChange={(e) => onChange('date', e.target.value)}
          className={`h-9 text-sm ${errors.date ? 'border-destructive' : ''}`}
        />
        {errors.date && <ErrorText msg={errors.date} />}
      </div>
      <PaymentMethodRow value={form.paymentMethod} onChange={(v) => onChange('paymentMethod', v)} />
    </div>
  );
}

function PaymentMethodRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const methods = [
    { value: 'cash', label: 'Efectivo', icon: <LucideBanknote size={16} /> },
    { value: 'card', label: 'Tarjeta', icon: <MdCreditCard size={16} /> },
    { value: 'bank', label: 'Transferencia', icon: <Landmark size={16} /> },
  ];
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold">M&eacute;todo de pago</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
        {methods.map((method) => (
          <label key={method.value}
            className={`flex flex-col items-center justify-center gap-0.5 p-1.5 border rounded-lg cursor-pointer transition-all text-xs ${
              value === method.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'
            }`}
          >
            <input type="radio" name="paymentMethod" value={method.value} checked={value === method.value}
              onChange={() => onChange(method.value)} className="sr-only"
            />
            <span className="text-base">{method.icon}</span>
            <span className="font-medium">{method.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SelectField({ id, label, value, error, onChange, options, required }: {
  id: string; label: string; value: string; error?: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${error ? 'border-destructive' : ''}`}
      >
        <option value="">Seleccionar</option>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <ErrorText msg={error} />}
    </div>
  );
}

function ErrorText({ msg }: { msg: string }) {
  return (
    <p className="text-[10px] text-destructive flex items-center gap-1">
      <AlertCircle size={12} /> {msg}
    </p>
  );
}
