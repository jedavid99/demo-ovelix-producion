import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import api from '../../services/api';
import { toast } from '@/shared/components/ui/use-toast';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { UserPermissions } from './UserPermissions';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { Button } from '@/shared/components/ui/button';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
  };
  activo: boolean;
  status?: string;
  empresa_id?: string;
  dni?: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}

type TabType = 'all' | 'pending';

export default function DeveloperUsers() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Record<string, {codigo_empresa: string; razon_social: string}>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      const data = response.data.data;
      if (Array.isArray(data)) {
        const companiesMap: Record<string, {codigo_empresa: string; razon_social: string}> = {};
        data.forEach((company: any) => {
          companiesMap[company.id] = {
            codigo_empresa: company.codigo_empresa,
            razon_social: company.razon_social,
          };
        });
        setCompanies(companiesMap);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const data = response.data.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('No se pudieron cargar los usuarios. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los usuarios.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/users/pending');
      const data = response.data.data;
      setPendingUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar usuarios pendientes.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching pending users:', error);
      setPendingUsers([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchUsers(), fetchPendingUsers(), fetchCompanies()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      setProcessingId(userId);
      await api.patch(`/users/${userId}/status`, { status: 'ACTIVE' });
      toast({ title: 'Aprobado', description: 'El usuario ha sido aprobado exitosamente.', variant: 'default' });
      await fetchPendingUsers();
      await fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo aprobar el usuario. Intentá de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error approving user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setProcessingId(userId);
      await api.patch(`/users/${userId}/status`, { status: 'REJECTED' });
      toast({ title: 'Rechazado', description: 'El usuario ha sido rechazado.', variant: 'default' });
      await fetchPendingUsers();
      await fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo rechazar el usuario. Intentá de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error rejecting user:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingState label="Cargando usuarios..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Administra los usuarios del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => { setActiveTab('all'); setSearchTerm(''); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Todos los Usuarios ({users.length})
        </button>
        <button
          onClick={() => { setActiveTab('pending'); setSearchTerm(''); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Pendientes de Aprobación ({pendingUsers.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={activeTab === 'pending' ? 'Buscar usuarios pendientes...' : 'Buscar usuarios...'}
          aria-label="Buscar usuarios"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-card"
        />
      </div>

      {/* Pending Users Table */}
      {activeTab === 'pending' && (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Fecha de Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.nombre} {user.apellido}
                          </div>
                          {user.telefono && (
                            <div className="text-xs text-muted-foreground">{user.telefono}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.empresa_id && companies[user.empresa_id] ? (
                        <div>
                          <div className="font-medium">{companies[user.empresa_id].codigo_empresa}</div>
                          <div className="text-xs text-muted-foreground">{companies[user.empresa_id].razon_social}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin empresa</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                          disabled={processingId === user.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(user.id)}
                          disabled={processingId === user.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPendingUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      <UserCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="font-medium text-foreground">No hay usuarios pendientes</p>
                      <p className="mt-1">Todos los usuarios han sido revisados.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Users Table */}
      {activeTab === 'all' && (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.nombre} {user.apellido}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.rol.name === 'DESARROLLADOR' ? 'bg-purple-100 text-purple-800' :
                        user.rol.name === 'ADMIN' ? 'bg-primary/10 text-blue-800' :
                        user.rol.name === 'TECNICO' ? 'bg-green-100 text-green-800' :
                        'bg-muted text-foreground'
                      }`}>
                        {user.rol.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.empresa_id && companies[user.empresa_id] ? (
                        <div>
                          <div className="font-medium">{companies[user.empresa_id].codigo_empresa}</div>
                          <div className="text-xs text-muted-foreground">{companies[user.empresa_id].razon_social}</div>
                        </div>
                      ) : user.rol.name === 'DESARROLLADOR' ? (
                        <div>
                          <div className="font-medium">ovelix</div>
                          <div className="text-xs text-muted-foreground">ovelix</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        user.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        user.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'PENDING' ? 'Pendiente' :
                         user.status === 'REJECTED' ? 'Rechazado' :
                         user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissions(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Permisos
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p>No se encontraron usuarios</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog
        open={showPermissions && !!selectedUser}
        onOpenChange={(open) => { if (!open) { setShowPermissions(false); setSelectedUser(null); } }}
      >
        <DialogContent hideClose className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0">
          {selectedUser && (
            <UserPermissions
              userId={selectedUser.id}
              userName={`${selectedUser.nombre} ${selectedUser.apellido}`}
              userRole={selectedUser.rol.name}
              onBack={() => {
                setShowPermissions(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
