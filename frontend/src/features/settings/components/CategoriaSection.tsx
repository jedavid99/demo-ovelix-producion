import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Tags } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { StockCategory } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import { getSectionMeta } from '../constants/settings.constants';
import { SectionHeader } from './ui/SectionHeader';
import { SettingsCard } from './ui/SettingsCard';
import { Field } from './ui/Field';
import { SettingsRow } from './ui/SettingsRow';

interface CategoriaSectionProps {
  categories: StockCategory[];
  setCategories: React.Dispatch<React.SetStateAction<StockCategory[]>>;
}

export const CategoriaSection: React.FC<CategoriaSectionProps> = ({ categories, setCategories }) => {
  const meta = getSectionMeta('Categoria');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addCategory = async () => {
    if (!newName.trim()) return;
    setSubmitting(true);
    try {
      const created = await settingsApi.createCategory({
        nombre: newName.trim(),
        descripcion: newDesc.trim() || undefined,
      });
      setCategories(prev => [...prev, created]);
      setNewName('');
      setNewDesc('');
      toast({ title: 'Éxito', description: 'Categoría creada correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al crear la categoría', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: StockCategory) => {
    setEditingId(cat.id);
    setEditName(cat.nombre);
    setEditDesc(cat.descripcion || '');
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const updated = await settingsApi.updateCategory(id, {
        nombre: editName.trim(),
        descripcion: editDesc.trim() || undefined,
      });
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
      setEditingId(null);
      toast({ title: 'Éxito', description: 'Categoría actualizada correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar la categoría', variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await settingsApi.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Éxito', description: 'Categoría eliminada correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar la categoría', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.label} description={meta.description} />

      <SettingsCard
        title="Agregar categoría"
        description="Creá una categoría nueva para organizar tu inventario"
        icon={<Tags size={18} />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nombre" htmlFor="categoria-nombre">
            <Input
              id="categoria-nombre"
              placeholder="Ej. Pantallas, Baterías"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Field>
          <Field label="Descripción" htmlFor="categoria-descripcion">
            <Input
              id="categoria-descripcion"
              placeholder="Descripción (opcional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </Field>
        </div>
        <Button onClick={addCategory} disabled={submitting || !newName.trim()} className="mt-4">
          <Plus size={16} /> Agregar categoría
        </Button>
      </SettingsCard>

      <SettingsCard>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Categorías activas</h3>
          <span className="text-xs font-medium text-muted-foreground">{categories.length}</span>
        </div>
        {categories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No hay categorías configuradas"
            description="Agrega tu primera categoría para empezar a organizar tu inventario"
            className="py-8"
          />
        ) : (
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <SettingsRow key={cat.id}>
                {editingId === cat.id ? (
                  <div className="flex flex-1 flex-col gap-3 md:flex-row">
                    <Input
                      className="flex-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Nombre de la categoría en edición"
                    />
                    <Input
                      className="flex-1"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Descripción"
                      aria-label="Descripción de la categoría en edición"
                    />
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => saveEdit(cat.id)}>Guardar</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{cat.nombre}</p>
                      {cat.descripcion && <p className="text-xs text-muted-foreground">{cat.descripcion}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => startEdit(cat)}
                        aria-label={`Editar ${cat.nombre}`}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteCategory(cat.id)}
                        aria-label={`Eliminar ${cat.nombre}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </SettingsRow>
            ))}
          </div>
        )}
      </SettingsCard>
    </div>
  );
};
export default CategoriaSection;