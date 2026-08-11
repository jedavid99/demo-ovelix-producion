export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  _count: { users: number };
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

export const SUGGESTED_PERMISSIONS = [
  'Empresas', 'Usuarios', 'Seguridad', 'Monitoreo', 'Backup', 'API',
  'Ventas', 'Stock', 'Reparaciones', 'Clientes', 'Finanzas', 'Presupuestos',
];
