import { useContext } from 'react';
import { AuthContext, useAuth } from '../contexts/AuthContext';

// Constantes de permisos (deben coincidir con el backend)
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  REPAIRS_VIEW: 'repairs.view',
  REPAIRS_CREATE: 'repairs.create',
  REPAIRS_EDIT: 'repairs.edit',
  REPAIRS_DELETE: 'repairs.delete',
  REPAIRS_ASSIGN: 'repairs.assign',
  CLIENTS_VIEW: 'clients.view',
  CLIENTS_CREATE: 'clients.create',
  CLIENTS_EDIT: 'clients.edit',
  CLIENTS_DELETE: 'clients.delete',
  STOCK_VIEW: 'stock.view',
  STOCK_CREATE: 'stock.create',
  STOCK_EDIT: 'stock.edit',
  STOCK_DELETE: 'stock.delete',
  STOCK_MOVEMENTS: 'stock.movements',
  SALES_VIEW: 'sales.view',
  SALES_CREATE: 'sales.create',
  SALES_EDIT: 'sales.edit',
  SALES_DELETE: 'sales.delete',
  CASH_VIEW: 'cash.view',
  CASH_OPEN: 'cash.open',
  CASH_CLOSE: 'cash.close',
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_PERMISSIONS: 'users.manage_permissions',
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  COMPANIES_VIEW: 'companies.view',
  COMPANIES_CREATE: 'companies.create',
  COMPANIES_EDIT: 'companies.edit',
  COMPANIES_DELETE: 'companies.delete',
  REPORTS_VIEW: 'reports.view',
  REPORTS_SALES: 'reports.sales',
  REPORTS_REPAIRS: 'reports.repairs',
  REPORTS_STOCK: 'reports.stock',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  AUDIT_VIEW: 'audit.view',
  DEVELOPER_VIEW: 'developer.view',
  DEVELOPER_MANAGE: 'developer.manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Mapeo de páginas a permisos (para UI amigable)
export const PAGE_PERMISSIONS = {
  dashboard: {
    title: 'Dashboard',
    icon: '📊',
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
  },
  clients: {
    title: 'Clientes',
    icon: '👥',
    permissions: [PERMISSIONS.CLIENTS_VIEW, PERMISSIONS.CLIENTS_CREATE, PERMISSIONS.CLIENTS_EDIT, PERMISSIONS.CLIENTS_DELETE],
  },
  sales: {
    title: 'Ventas',
    icon: '💰',
    permissions: [PERMISSIONS.SALES_VIEW, PERMISSIONS.SALES_CREATE, PERMISSIONS.SALES_EDIT, PERMISSIONS.SALES_DELETE],
  },
  stock: {
    title: 'Stock',
    icon: '📦',
    permissions: [PERMISSIONS.STOCK_VIEW, PERMISSIONS.STOCK_CREATE, PERMISSIONS.STOCK_EDIT, PERMISSIONS.STOCK_DELETE, PERMISSIONS.STOCK_MOVEMENTS],
  },
  providers: {
    title: 'Proveedores',
    icon: '🚚',
    permissions: [PERMISSIONS.STOCK_VIEW, PERMISSIONS.STOCK_CREATE],
  },
  repairs: {
    title: 'Reparaciones',
    icon: '🔧',
    permissions: [PERMISSIONS.REPAIRS_VIEW, PERMISSIONS.REPAIRS_CREATE, PERMISSIONS.REPAIRS_EDIT, PERMISSIONS.REPAIRS_DELETE, PERMISSIONS.REPAIRS_ASSIGN],
  },
  shipping: {
    title: 'Envíos',
    icon: '📦',
    permissions: [PERMISSIONS.STOCK_VIEW],
  },
  cash: {
    title: 'Caja Diaria',
    icon: '💵',
    permissions: [PERMISSIONS.CASH_VIEW, PERMISSIONS.CASH_OPEN, PERMISSIONS.CASH_CLOSE],
  },
  expenses: {
    title: 'Gastos',
    icon: '💸',
    permissions: [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_EDIT],
  },
  reports: {
    title: 'Reportes',
    icon: '📈',
    permissions: [PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_SALES, PERMISSIONS.REPORTS_REPAIRS, PERMISSIONS.REPORTS_STOCK],
  },
  billing: {
    title: 'Facturación',
    icon: '🧾',
    permissions: [PERMISSIONS.SALES_VIEW, PERMISSIONS.SALES_CREATE],
  },
  iphone: {
    title: 'iPhone',
    icon: '📱',
    permissions: [PERMISSIONS.SALES_VIEW, PERMISSIONS.SALES_CREATE],
  },
  users: {
    title: 'Usuarios',
    icon: '👤',
    permissions: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE, PERMISSIONS.USERS_MANAGE_PERMISSIONS],
  },
  companies: {
    title: 'Empresas',
    icon: '🏢',
    permissions: [PERMISSIONS.COMPANIES_VIEW, PERMISSIONS.COMPANIES_CREATE, PERMISSIONS.COMPANIES_EDIT, PERMISSIONS.COMPANIES_DELETE],
  },
  roles: {
    title: 'Roles',
    icon: '🔐',
    permissions: [PERMISSIONS.ROLES_VIEW, PERMISSIONS.ROLES_CREATE, PERMISSIONS.ROLES_EDIT, PERMISSIONS.ROLES_DELETE],
  },
  developer: {
    title: 'Desarrollador',
    icon: '💻',
    permissions: [PERMISSIONS.DEVELOPER_VIEW, PERMISSIONS.DEVELOPER_MANAGE],
  },
  audit: {
    title: 'Auditoría',
    icon: '📋',
    permissions: [PERMISSIONS.AUDIT_VIEW],
  },
  settings: {
    title: 'Configuración',
    icon: '⚙️',
    permissions: [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_EDIT],
  },
};

// Mapeo de rutas a permisos requeridos
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/': [PERMISSIONS.DASHBOARD_VIEW],
  '/dashboard': [PERMISSIONS.DASHBOARD_VIEW],
  '/clients': [PERMISSIONS.CLIENTS_VIEW],
  '/clients/add': [PERMISSIONS.CLIENTS_CREATE],
  '/sales': [PERMISSIONS.SALES_VIEW],
  '/sales/add': [PERMISSIONS.SALES_CREATE],
  '/stock': [PERMISSIONS.STOCK_VIEW],
  '/stock/add': [PERMISSIONS.STOCK_CREATE],
  '/stock/repuestos': [PERMISSIONS.STOCK_VIEW],
  '/stock/iphone': [PERMISSIONS.STOCK_VIEW],
  '/stock/iphone-add': [PERMISSIONS.STOCK_CREATE],
  '/stock/iphone-insurance': [PERMISSIONS.STOCK_VIEW],
  '/stock/adjustments': [PERMISSIONS.STOCK_MOVEMENTS],
  '/reparaciones/list': [PERMISSIONS.REPAIRS_VIEW],
  '/reparaciones/add': [PERMISSIONS.REPAIRS_CREATE],
  '/reparaciones/add-simple': [PERMISSIONS.REPAIRS_CREATE],
  '/reparaciones/edit/:id': [PERMISSIONS.REPAIRS_EDIT],
  '/reparaciones/confirmation': [PERMISSIONS.REPAIRS_VIEW],
  '/reparaciones/budgets': [PERMISSIONS.REPAIRS_VIEW],
  '/reparaciones/qr-scanner': [PERMISSIONS.REPAIRS_VIEW],
  '/costos-reparaciones': [PERMISSIONS.REPAIRS_VIEW],
  '/caja-diaria': [PERMISSIONS.CASH_VIEW],
  '/reports': [PERMISSIONS.REPORTS_VIEW],
  '/reports/sales': [PERMISSIONS.REPORTS_SALES],
  '/reports/stock': [PERMISSIONS.REPORTS_STOCK],
  '/reports/financial': [PERMISSIONS.REPORTS_VIEW],
  '/reports/repairs': [PERMISSIONS.REPORTS_REPAIRS],
  '/billing': [PERMISSIONS.SALES_VIEW],
  '/billing/create': [PERMISSIONS.SALES_CREATE],
  '/billing/ARCA': [PERMISSIONS.SALES_VIEW],
  '/billing/ARCA/iva': [PERMISSIONS.SALES_VIEW],
  '/settings': [PERMISSIONS.SETTINGS_VIEW],
  '/profile': [PERMISSIONS.SETTINGS_VIEW],
  '/expenses': [PERMISSIONS.SETTINGS_VIEW],
  '/expenses/add': [PERMISSIONS.SETTINGS_EDIT],
  '/expenses/categories': [PERMISSIONS.SETTINGS_EDIT],
  '/notifications': [PERMISSIONS.SETTINGS_VIEW],
  '/docs': [PERMISSIONS.SETTINGS_VIEW],
  '/help': [PERMISSIONS.SETTINGS_VIEW],
  // Developer routes
  '/developer': [PERMISSIONS.DEVELOPER_VIEW],
  '/developer/companies': [PERMISSIONS.COMPANIES_VIEW],
  '/developer/users': [PERMISSIONS.USERS_VIEW],
  '/developer/database': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/settings': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/tests': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/security/roles': [PERMISSIONS.ROLES_VIEW],
  '/developer/security/audit': [PERMISSIONS.AUDIT_VIEW],
  '/developer/monitoring/health': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/monitoring/cron': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/monitoring/logs': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/analytics/stats': [PERMISSIONS.REPORTS_VIEW],
  '/developer/analytics/dashboards': [PERMISSIONS.REPORTS_VIEW],
  '/developer/backup/backups': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/backup/restore': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/api/docs': [PERMISSIONS.DEVELOPER_VIEW],
  '/developer/api/tokens': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/notifications/templates': [PERMISSIONS.DEVELOPER_MANAGE],
  '/developer/notifications/bulk': [PERMISSIONS.DEVELOPER_MANAGE],
  // Providers
  '/providers': [PERMISSIONS.STOCK_VIEW],
  '/providers/add': [PERMISSIONS.STOCK_CREATE],
  '/providers/orders': [PERMISSIONS.STOCK_VIEW],
  '/providers/orders/add': [PERMISSIONS.STOCK_CREATE],
  '/providers/orders/edit/:id': [PERMISSIONS.STOCK_EDIT],
  '/providers/orders/:id': [PERMISSIONS.STOCK_VIEW],
  // Envios
  '/envios': [PERMISSIONS.STOCK_VIEW],
  '/envios/tracking': [PERMISSIONS.STOCK_VIEW],
  '/envios/remises': [PERMISSIONS.STOCK_VIEW],
  // iPhone
  '/iphone/sales': [PERMISSIONS.SALES_VIEW],
  '/iphone/records': [PERMISSIONS.SALES_VIEW],
  '/iphone/insurance': [PERMISSIONS.SALES_VIEW],
  '/iphone-canje': [PERMISSIONS.SALES_VIEW],
  '/iphone-canje/new': [PERMISSIONS.SALES_CREATE],
};

export const usePermissions = () => {
  const { user, isLoading } = useAuth();

  const permissions: string[] = user?.permissions || [];

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene alguno de los permisos especificados
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  const canAccessRoute = (path: string): boolean => {
    const requiredPermissions = ROUTE_PERMISSIONS[path];
    
    // Si aún está cargando, permitir acceso temporalmente para evitar bloqueos
    if (isLoading) {
      return true;
    }
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No se requieren permisos específicos
    }

    const hasAccess = hasAnyPermission(requiredPermissions);
    return hasAccess;
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    isLoading,
  };
};
