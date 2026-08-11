import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Loader2 } from 'lucide-react';
import type { Role, RoleFormData } from '../types';
import { SUGGESTED_PERMISSIONS } from '../types';

interface RoleModalProps {
  role?: Role | null;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function RoleModal({ role, onClose, onSubmit }: RoleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
  });
  const [permissionInput, setPermissionInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('El nombre y la descripción son obligatorios');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el rol');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPermission = () => {
    if (permissionInput.trim() && !formData.permissions.includes(permissionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionInput.trim()],
      }));
      setPermissionInput('');
    }
  };

  const removePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p !== perm),
    }));
  };

  const addSuggested = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: [...prev.permissions, perm],
    }));
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: 0, padding: 0,
      }}
    >
      <div className="bg-card rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {role ? 'Editar Rol' : 'Nuevo Rol'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors" disabled={isSubmitting}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nombre <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Ej: ADMIN"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Descripción <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              rows={3}
              placeholder="Descripción del rol"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Permisos</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={permissionInput}
                onChange={(e) => setPermissionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPermission())}
                className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                placeholder="Agregar permiso"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={addPermission}
                className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted transition-colors"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.permissions.map(perm => (
                <span
                  key={perm}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  {perm}
                  <button type="button" onClick={() => removePermission(perm)} className="hover:text-primary" disabled={isSubmitting}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Permisos sugeridos:</p>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_PERMISSIONS.filter(p => !formData.permissions.includes(p)).map(perm => (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => addSuggested(perm)}
                    className="px-2 py-1 bg-muted text-muted-foreground rounded hover:bg-muted transition-colors"
                    disabled={isSubmitting}
                  >
                    + {perm}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-destructive/10 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                role ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
