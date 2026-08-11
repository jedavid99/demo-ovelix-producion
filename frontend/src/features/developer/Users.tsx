import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, MoreVertical } from 'lucide-react';
import api from '../../services/api';
import { toast } from '@/shared/components/ui/use-toast';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { UserPermissions } from './UserPermissions';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

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
  empresa_id?: string;
  dni?: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}

export default function DeveloperUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Record<string, {codigo_empresa: string; razon_social: string}>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

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
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await api.get('/users');
      const data = response.data.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('No se pudieron cargar los usuarios. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingState label="Cargando usuarios..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { setLoading(true); fetchUsers(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Usuarios del Sistema</h2>
          <p className="text-sm text-muted-foreground mt-1">Todos los usuarios registrados en todas las empresas</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            aria-label="Buscar usuarios"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

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
                    user.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
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
