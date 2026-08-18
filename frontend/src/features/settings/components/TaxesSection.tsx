import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Percent, Landmark } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import type { TaxRate, BankAccount } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import { getSectionMeta } from '../constants/settings.constants';
import { SectionHeader } from './ui/SectionHeader';
import { SettingsCard } from './ui/SettingsCard';
import { Field } from './ui/Field';
import { SettingsRow } from './ui/SettingsRow';

interface TaxesSectionProps {
  taxRates: TaxRate[];
  setTaxRates: React.Dispatch<React.SetStateAction<TaxRate[]>>;
  bankAccounts: BankAccount[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const SECTION_OPTIONS = [
  { value: 'reparaciones', label: 'Reparaciones' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'ambos', label: 'Reparaciones y ventas' },
];

const sectionLabel = (value?: string | null) => SECTION_OPTIONS.find(s => s.value === value)?.label || value || 'Sin sección';

export const TaxesSection: React.FC<TaxesSectionProps> = ({ taxRates, setTaxRates, bankAccounts, setBankAccounts }) => {
  const meta = getSectionMeta('taxes');
  const [newRateName, setNewRateName] = useState('');
  const [newRatePct, setNewRatePct] = useState('');
  const [newRateSection, setNewRateSection] = useState('ambos');
  const [newRateDesc, setNewRateDesc] = useState('');

  const [newAlias, setNewAlias] = useState('');
  const [newCbu, setNewCbu] = useState('');
  const [newCuenta, setNewCuenta] = useState('');
  const [newBanco, setNewBanco] = useState('');
  const [newTitular, setNewTitular] = useState('');

  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRateName, setEditRateName] = useState('');
  const [editRatePct, setEditRatePct] = useState('');
  const [editRateSection, setEditRateSection] = useState('');
  const [editRateDesc, setEditRateDesc] = useState('');

  const addTaxRate = async () => {
    if (!newRateName.trim() || !newRatePct) return;
    try {
      const created = await settingsApi.createTaxRate({
        nombre: newRateName.trim(),
        porcentaje: parseFloat(newRatePct),
        seccion: newRateSection,
        descripcion: newRateDesc.trim() || undefined,
      });
      setTaxRates(prev => [...prev, created]);
      setNewRateName('');
      setNewRatePct('');
      setNewRateSection('ambos');
      setNewRateDesc('');
      toast({ title: 'Éxito', description: 'Porcentaje creado correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al crear el porcentaje', variant: 'destructive' });
    }
  };

  const toggleTaxRate = async (rate: TaxRate) => {
    try {
      const updated = await settingsApi.updateTaxRate(rate.id, { activo: !rate.activo });
      setTaxRates(prev => prev.map(r => (r.id === rate.id ? updated : r)));
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar el porcentaje', variant: 'destructive' });
    }
  };

  const deleteTaxRate = async (id: string) => {
    try {
      await settingsApi.deleteTaxRate(id);
      setTaxRates(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Éxito', description: 'Porcentaje eliminado correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar el porcentaje', variant: 'destructive' });
    }
  };

  const startEditRate = (rate: TaxRate) => {
    setEditingRateId(rate.id);
    setEditRateName(rate.nombre);
    setEditRatePct(String(rate.porcentaje));
    setEditRateSection(rate.seccion || '');
    setEditRateDesc(rate.descripcion || '');
  };

  const saveEditRate = async (id: string) => {
    if (!editRateName.trim() || !editRatePct) return;
    try {
      const updated = await settingsApi.updateTaxRate(id, {
        nombre: editRateName.trim(),
        porcentaje: parseFloat(editRatePct),
        seccion: editRateSection || undefined,
        descripcion: editRateDesc.trim() || undefined,
      });
      setTaxRates(prev => prev.map(r => (r.id === id ? updated : r)));
      setEditingRateId(null);
      toast({ title: 'Éxito', description: 'Porcentaje actualizado correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar el porcentaje', variant: 'destructive' });
    }
  };

  const addBankAccount = async () => {
    if (!newAlias.trim() && !newCbu.trim() && !newCuenta.trim()) return;
    try {
      const created = await settingsApi.createBankAccount({
        alias: newAlias.trim() || undefined,
        cbu: newCbu.trim() || undefined,
        numero_cuenta: newCuenta.trim() || undefined,
        banco: newBanco.trim() || undefined,
        titular: newTitular.trim() || undefined,
      });
      setBankAccounts(prev => [...prev, created]);
      setNewAlias('');
      setNewCbu('');
      setNewCuenta('');
      setNewBanco('');
      setNewTitular('');
      toast({ title: 'Éxito', description: 'Cuenta bancaria agregada correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al agregar la cuenta bancaria', variant: 'destructive' });
    }
  };

  const deleteBankAccount = async (id: string) => {
    try {
      await settingsApi.deleteBankAccount(id);
      setBankAccounts(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Éxito', description: 'Cuenta bancaria eliminada correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar la cuenta bancaria', variant: 'destructive' });
    }
  };

  const hasNewRate = newRateName.trim() && newRatePct;
  const hasNewAccount = newAlias.trim() || newCbu.trim() || newCuenta.trim();

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.label} description={meta.description} />

      <SettingsCard
        title="Porcentajes"
        description="Impuestos, recargos y qué sección del sistema afectan"
        icon={<Percent size={18} />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="Nombre" htmlFor="rate-nombre">
            <Input id="rate-nombre" placeholder="Ej. IVA" value={newRateName} onChange={(e) => setNewRateName(e.target.value)} />
          </Field>
          <Field label="Porcentaje" htmlFor="rate-pct">
            <div className="relative">
              <Input
                id="rate-pct"
                type="number"
                step="0.01"
                className="pr-8"
                placeholder="21"
                value={newRatePct}
                onChange={(e) => setNewRatePct(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
          </Field>
          <Field label="Sección" htmlFor="rate-seccion">
            <select
              id="rate-seccion"
              className="h-10 w-full rounded border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
              value={newRateSection}
              onChange={(e) => setNewRateSection(e.target.value)}
            >
              {SECTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Descripción" htmlFor="rate-desc">
            <Input id="rate-desc" placeholder="Opcional" value={newRateDesc} onChange={(e) => setNewRateDesc(e.target.value)} />
          </Field>
        </div>
        <Button onClick={addTaxRate} disabled={!hasNewRate} className="mt-4">
          <Plus size={16} /> Agregar porcentaje
        </Button>

        <div className="mt-6 space-y-2.5">
          {taxRates.length === 0 && (
            <EmptyState icon={Percent} title="No hay porcentajes configurados" className="py-8" />
          )}
          {taxRates.map((rate) => (
            <SettingsRow key={rate.id}>
              {editingRateId === rate.id ? (
                <div className="flex flex-1 flex-col gap-3 md:flex-row">
                  <Input
                    className="flex-1"
                    value={editRateName}
                    onChange={(e) => setEditRateName(e.target.value)}
                    aria-label="Nombre del porcentaje en edición"
                  />
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      className="w-full pr-8 md:w-24"
                      value={editRatePct}
                      onChange={(e) => setEditRatePct(e.target.value)}
                      aria-label="Porcentaje en edición"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                  </div>
                  <select
                    className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                    value={editRateSection}
                    onChange={(e) => setEditRateSection(e.target.value)}
                    aria-label="Sección en edición"
                  >
                    {SECTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => saveEditRate(rate.id)}>Guardar</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingRateId(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                      {Number(rate.porcentaje)}%
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{rate.nombre}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {sectionLabel(rate.seccion)}
                        {rate.descripcion ? ` · ${rate.descripcion}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Switch checked={rate.activo} onCheckedChange={() => toggleTaxRate(rate)} aria-label={`Activar ${rate.nombre}`} />
                    <Button variant="ghost" size="icon-sm" onClick={() => startEditRate(rate)} aria-label={`Editar ${rate.nombre}`} className="text-muted-foreground hover:text-primary">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => deleteTaxRate(rate.id)} aria-label={`Eliminar ${rate.nombre}`} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </SettingsRow>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Cuentas bancarias"
        description="Datos bancarios que aparecerán en facturas para transferencias manuales"
        icon={<Landmark size={18} />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Alias" htmlFor="banco-alias">
            <Input id="banco-alias" placeholder="Alias" value={newAlias} onChange={(e) => setNewAlias(e.target.value)} />
          </Field>
          <Field label="CBU" htmlFor="banco-cbu">
            <Input id="banco-cbu" placeholder="CBU" value={newCbu} onChange={(e) => setNewCbu(e.target.value)} />
          </Field>
          <Field label="Número de cuenta" htmlFor="banco-cuenta">
            <Input id="banco-cuenta" placeholder="Número de cuenta" value={newCuenta} onChange={(e) => setNewCuenta(e.target.value)} />
          </Field>
          <Field label="Banco" htmlFor="banco-nombre">
            <Input id="banco-nombre" placeholder="Banco" value={newBanco} onChange={(e) => setNewBanco(e.target.value)} />
          </Field>
          <Field label="Titular" htmlFor="banco-titular">
            <Input id="banco-titular" placeholder="Titular" value={newTitular} onChange={(e) => setNewTitular(e.target.value)} />
          </Field>
        </div>
        <Button onClick={addBankAccount} disabled={!hasNewAccount} className="mt-4">
          <Plus size={16} /> Agregar cuenta
        </Button>

        <div className="mt-6 space-y-2.5">
          {bankAccounts.length === 0 && (
            <EmptyState
              icon={Landmark}
              title="No hay cuentas bancarias configuradas"
              description="Agrega una cuenta para mostrarla en tus facturas"
              className="py-8"
            />
          )}
          {bankAccounts.map((account) => (
            <SettingsRow
              key={account.id}
              left={
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{account.banco || account.titular || 'Cuenta bancaria'}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[account.alias && `Alias: ${account.alias}`, account.cbu && `CBU: ${account.cbu}`, account.numero_cuenta && `Cuenta: ${account.numero_cuenta}`, account.titular && `Titular: ${account.titular}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
              }
              right={
                <Button variant="ghost" size="icon-sm" onClick={() => deleteBankAccount(account.id)} aria-label="Eliminar cuenta" className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </Button>
              }
            />
          ))}
        </div>
      </SettingsCard>
    </div>
  );
};
export default TaxesSection;