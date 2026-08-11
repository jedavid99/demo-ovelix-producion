import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Percent, Landmark } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import type { TaxRate, BankAccount } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';

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

export const TaxesSection: React.FC<TaxesSectionProps> = ({ taxRates, setTaxRates, bankAccounts, setBankAccounts }) => {
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
    } catch (e) {
      toast({ title: 'Error', description: 'Error al crear el porcentaje', variant: 'destructive' });
    }
  };

  const toggleTaxRate = async (rate: TaxRate) => {
    try {
      const updated = await settingsApi.updateTaxRate(rate.id, { activo: !rate.activo });
      setTaxRates(prev => prev.map(r => (r.id === rate.id ? updated : r)));
    } catch (e) {
      toast({ title: 'Error', description: 'Error al actualizar el porcentaje', variant: 'destructive' });
    }
  };

  const deleteTaxRate = async (id: string) => {
    try {
      await settingsApi.deleteTaxRate(id);
      setTaxRates(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Éxito', description: 'Porcentaje eliminado correctamente' });
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      toast({ title: 'Error', description: 'Error al agregar la cuenta bancaria', variant: 'destructive' });
    }
  };

  const deleteBankAccount = async (id: string) => {
    try {
      await settingsApi.deleteBankAccount(id);
      setBankAccounts(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Éxito', description: 'Cuenta bancaria eliminada correctamente' });
    } catch (e) {
      toast({ title: 'Error', description: 'Error al eliminar la cuenta bancaria', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-card  rounded-xl border border-border  overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border ">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Percent size={18} className="text-primary" /> Porcentajes</h2>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Agrega porcentajes (impuestos, recargos) indicando a qué sección del sistema afecta</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <input aria-label="Nombre del porcentaje" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground" placeholder="Nombre (ej. IVA)" value={newRateName} onChange={(e) => setNewRateName(e.target.value)} />
            <div className="relative">
              <input aria-label="Porcentaje" type="number" step="0.01" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-8 text-sm text-foreground" placeholder="Porcentaje" value={newRatePct} onChange={(e) => setNewRatePct(e.target.value)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
            </div>
            <select aria-label="Sección" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground" value={newRateSection} onChange={(e) => setNewRateSection(e.target.value)}>
              {SECTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input aria-label="Descripción del porcentaje" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground" placeholder="Descripción (opcional)" value={newRateDesc} onChange={(e) => setNewRateDesc(e.target.value)} />
          </div>
          <button onClick={addTaxRate} disabled={!newRateName.trim() || !newRatePct} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
            <Plus size={14} /> Agregar porcentaje
          </button>

          <div className="mt-6 space-y-3">
            {taxRates.length === 0 && (
              <EmptyState
                icon={Percent}
                title="No hay porcentajes configurados"
                className="py-8"
              />
            )}
            {taxRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-4 bg-muted dark:bg-muted rounded-xl">
                {editingRateId === rate.id ? (
                  <div className="flex-1 flex flex-col md:flex-row gap-3">
                    <input aria-label="Nombre del porcentaje en edición" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editRateName} onChange={(e) => setEditRateName(e.target.value)} />
                    <div className="relative">
                      <input aria-label="Porcentaje en edición" type="number" step="0.01" className="w-28 rounded-lg border border-input bg-background px-3 py-2 pr-7 text-sm" value={editRatePct} onChange={(e) => setEditRatePct(e.target.value)} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                    </div>
                    <select aria-label="Sección en edición" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editRateSection} onChange={(e) => setEditRateSection(e.target.value)}>
                      {SECTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={() => saveEditRate(rate.id)} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg">Guardar</button>
                    <button onClick={() => setEditingRateId(null)} className="px-4 py-2 text-xs font-bold text-muted-foreground border border-border dark:border-border rounded-lg">Cancelar</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg font-black text-sm">{Number(rate.porcentaje)}%</span>
                      <div>
                        <p className="font-bold">{rate.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {SECTION_OPTIONS.find(s => s.value === rate.seccion)?.label || rate.seccion || 'Sin sección'}
                          {rate.descripcion ? ` · ${rate.descripcion}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={rate.activo} onChange={() => toggleTaxRate(rate)} />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                      <button onClick={() => startEditRate(rate)} className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label={`Editar ${rate.nombre}`}><Pencil size={16} /></button>
                      <button onClick={() => deleteTaxRate(rate.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Eliminar ${rate.nombre}`}><Trash2 size={16} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card  rounded-xl border border-border  overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border ">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Landmark size={18} className="text-primary" /> Cuentas bancarias guardadas</h2>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Datos bancarios que aparecerán en facturas para transferencias manuales</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <input aria-label="Alias de la cuenta" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="Alias" value={newAlias} onChange={(e) => setNewAlias(e.target.value)} />
            <input aria-label="CBU" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="CBU" value={newCbu} onChange={(e) => setNewCbu(e.target.value)} />
            <input aria-label="Número de cuenta" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="Número de cuenta" value={newCuenta} onChange={(e) => setNewCuenta(e.target.value)} />
            <input aria-label="Banco" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="Banco" value={newBanco} onChange={(e) => setNewBanco(e.target.value)} />
            <input aria-label="Titular" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm" placeholder="Titular" value={newTitular} onChange={(e) => setNewTitular(e.target.value)} />
          </div>
          <button onClick={addBankAccount} disabled={!newAlias.trim() && !newCbu.trim() && !newCuenta.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
            <Plus size={14} /> Agregar cuenta
          </button>

          <div className="mt-6 space-y-3">
            {bankAccounts.length === 0 && (
              <EmptyState
                icon={Landmark}
                title="No hay cuentas bancarias configuradas"
                description="Agrega una cuenta para mostrarla en tus facturas"
                className="py-8"
              />
            )}
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-muted dark:bg-muted rounded-xl">
                <div>
                  <p className="font-bold">{account.banco || account.titular || 'Cuenta bancaria'}</p>
                  <p className="text-xs text-muted-foreground">
                    {[account.alias && `Alias: ${account.alias}`, account.cbu && `CBU: ${account.cbu}`, account.numero_cuenta && `Cuenta: ${account.numero_cuenta}`, account.titular && `Titular: ${account.titular}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <button onClick={() => deleteBankAccount(account.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" aria-label="Eliminar cuenta"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaxesSection;
