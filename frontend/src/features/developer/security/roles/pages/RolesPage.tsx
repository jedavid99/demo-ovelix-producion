import { Plus } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { RoleCard } from '../components/RoleCard';
import { RoleModal } from '../components/RoleModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { EmptyState } from '@/shared/components/async/EmptyState';

export default function RolesPage() {
  const {
    roles, loading, loadError, showModal, editingRole, deletingRole,
    setShowModal, setEditingRole, setDeletingRole,
    handleCreate, handleEdit, handleDelete,
  } = useRoles();

  if (loading) {
    return <LoadingState label="Cargando roles..." />;
  }

  return (
    <div className="space-y-6">
      {loadError && <ErrorState message={loadError} className="!py-4" />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Roles y Permisos</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestionar qué usuarios tienen acceso a qué módulos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Rol</span>
        </button>
      </div>

      {roles.length === 0 ? (
        <EmptyState
          title="No hay roles registrados"
          description="Crea el primer rol para comenzar."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={setEditingRole}
              onDelete={setDeletingRole}
            />
          ))}
        </div>
      )}

      {showModal && (
        <RoleModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}

      {editingRole && (
        <RoleModal
          role={editingRole}
          onClose={() => setEditingRole(null)}
          onSubmit={(data) => handleEdit(editingRole.id, data)}
        />
      )}

      {deletingRole && (
        <DeleteConfirmModal
          role={deletingRole}
          onClose={() => setDeletingRole(null)}
          onConfirm={() => handleDelete(deletingRole)}
        />
      )}
    </div>
  );
}
