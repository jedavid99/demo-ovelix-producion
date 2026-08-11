import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Tags } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import type { StockCategory } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';

interface CategoriaSectionProps {
  categories: StockCategory[];
  setCategories: React.Dispatch<React.SetStateAction<StockCategory[]>>;
}

export const CategoriaSection: React.FC<CategoriaSectionProps> = ({ categories, setCategories }) => {
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
    } catch (e) {
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
    } catch (e) {
      toast({ title: 'Error', description: 'Error al actualizar la categoría', variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await settingsApi.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Éxito', description: 'Categoría eliminada correctamente' });
    } catch (e) {
      toast({ title: 'Error', description: 'Error al eliminar la categoría', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorías de stock</h1>
          <p className="text-muted-foreground dark:text-muted-foreground mt-1">Gestiona las categorías usadas para organizar el inventario.</p>
        </div>
      </div>

      <div className="bg-card  rounded-2xl border border-border  overflow-hidden">
        <div className="p-6 border-b border-border ">
          <h2 className="text-lg font-bold text-foreground">Agregar categoría</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              aria-label="Nombre de la categoría"
              className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
              placeholder="Nombre (ej. Pantallas, Baterías)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              aria-label="Descripción de la categoría"
              className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
              placeholder="Descripción (opcional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <button onClick={addCategory} disabled={submitting || !newName.trim()} className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50">
            <Plus size={18} /> Agregar categoría
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Categorías activas ({categories.length})</p>
          {categories.length === 0 ? (
            <EmptyState
              icon={Tags}
              title="No hay categorías configuradas"
              description="Agrega tu primera categoría para empezar a organizar tu inventario"
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-muted dark:bg-muted rounded-xl">
                  {editingId === cat.id ? (
                    <div className="flex-1 flex flex-col md:flex-row gap-3">
                      <input
                        aria-label="Nombre de la categoría en edición"
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <input
                        aria-label="Descripción de la categoría en edición"
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Descripción"
                      />
                      <button onClick={() => saveEdit(cat.id)} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg">Guardar</button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-muted-foreground border border-border dark:border-border rounded-lg">Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-bold">{cat.nombre}</p>
                        {cat.descripcion && <p className="text-xs text-muted-foreground">{cat.descripcion}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(cat)} className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label={`Editar ${cat.nombre}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Eliminar ${cat.nombre}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CategoriaSection;
