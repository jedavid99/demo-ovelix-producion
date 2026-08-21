import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserHeaderCard } from '../../components/profile/UserHeaderCard';
import { InformationSection } from '../../components/profile/InformationSection';
import { SecurityAccessSection } from '../../components/profile/SecurityAccessSection';
import { ChangePasswordSection } from '../../components/profile/ChangePasswordSection';
import { ActivityLogSection } from '../../components/profile/ActivityLogSection';
import { PerformanceSection } from '../../components/profile/PerformanceSection';
import { UsersSection } from '../../components/profile/UsersSection';
import { getAllUsers, createUser } from '@/services/users.service';
import CreateUserModal from '../../CreateUserModal';

const resolveUser = (u: any) => (u?.data && u?.statusCode ? u.data : u);

export default function ProfilePage() {
  const { user: rawUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState(resolveUser(rawUser));

  useEffect(() => {
    setUser(resolveUser(rawUser));
  }, [rawUser]);

  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (!user?.empresa_id) return;
    setUsersLoading(true);
    getAllUsers()
      .then((res: any) => {
        const list = res?.data ?? res ?? [];
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, [user?.empresa_id]);

  const handleCreateUser = async (formData: any) => {
    const nameParts = (formData.fullName || '').trim().split(/\s+/);
    const payload = {
      nombre: nameParts[0] || '',
      apellido: nameParts.slice(1).join(' ') || '',
      email: formData.email,
      telefono: formData.phone,
      rol: formData.role,
      password: formData.password,
    };
    try {
      await createUser(payload);
      const res: any = await getAllUsers();
      setUsers(Array.isArray(res?.data ?? res) ? res.data ?? res : []);
    } catch {
      // error handled by modal
    }
    setShowUserModal(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const isAdmin = user?.rol?.name === 'ADMIN' || user?.rol?.name === 'DESARROLLADOR';

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Signature Header */}
        <UserHeaderCard user={user} />

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Column: Identidad & Seguridad */}
          <div className="lg:col-span-7 space-y-6">
            <InformationSection user={user} onUserUpdate={(u: any) => setUser(u)} />
            <SecurityAccessSection user={user} />
            <ChangePasswordSection userId={user?.id} />
          </div>

          {/* Sidebar Column: Historial & Calificaciones */}
          <div className="lg:col-span-5 space-y-6">
            <PerformanceSection />
            <ActivityLogSection usuarioId={user?.id} />
          </div>
        </div>

        {/* Admin: Team Management */}
{isAdmin && (
            <>
              <div className="border-t border-border my-4" />
              <UsersSection
              users={users}
              loading={usersLoading}
              onAddUser={() => setShowUserModal(true)}
            />
          </>
        )}
      </div>
      <CreateUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
}