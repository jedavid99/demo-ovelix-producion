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
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <UserHeaderCard user={user} />
        <div className="grid lg:grid-cols-2 gap-6">
          <InformationSection user={user} onUserUpdate={(u: any) => setUser(u)} />
          <div className="space-y-6">
            <SecurityAccessSection user={user} />
            <ChangePasswordSection userId={user?.id} />
          </div>
        </div>
        <ActivityLogSection usuarioId={user?.id} />
        <PerformanceSection />
        <UsersSection
          users={users}
          loading={usersLoading}
          onAddUser={() => setShowUserModal(true)}
        />
      </div>
      <CreateUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
}
