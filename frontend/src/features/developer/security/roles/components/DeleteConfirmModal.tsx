import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import type { Role } from '../types';

interface DeleteConfirmModalProps {
  role: Role;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ role, onClose, onConfirm }: DeleteConfirmModalProps) {
  return createPortal(
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999, backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: 0, padding: 0,
      }}
    >
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full m-4 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Eliminar Rol</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          ¿Estás seguro de que deseas eliminar el rol <strong>{role.name}</strong>?
        </p>
        {role._count.users > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 mb-4">
            Este rol tiene {role._count.users} usuario(s) asignado(s). No se puede eliminar.
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={role._count.users > 0}
            className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
