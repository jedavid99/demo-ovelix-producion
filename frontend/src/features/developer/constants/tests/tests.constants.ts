import {
  Users, Building2, ShoppingCart, Package, Wrench, FileText, DollarSign, Plus, Edit
} from 'lucide-react';
import type { VisualTest, ApiTestCategory } from '../../types/tests/tests.types';

export const visualTests: VisualTest[] = [
  {
    id: 'clients-list',
    category: 'Clientes',
    name: 'Listar Clientes',
    description: 'Ver la lista de todos los clientes registrados con búsqueda y filtros',
    path: '/clients',
    icon: Users,
    features: ['Búsqueda por nombre/email', 'Filtros por estado', 'Paginación', 'Ver detalles', 'Editar cliente', 'Eliminar cliente']
  },
  {
    id: 'clients-add',
    category: 'Clientes',
    name: 'Registrar Nuevo Cliente',
    description: 'Formulario para agregar un nuevo cliente al sistema',
    path: '/clients/add',
    icon: Plus,
    features: ['Datos personales', 'Información de contacto', 'Dirección', 'Validación de campos', 'Confirmación']
  },
  {
    id: 'sales-list',
    category: 'Ventas',
    name: 'Historial de Ventas',
    description: 'Ver todas las ventas realizadas con filtros y detalles',
    path: '/sales',
    icon: ShoppingCart,
    features: ['Lista de ventas', 'Filtros por fecha', 'Búsqueda', 'Ver detalles', 'Anular venta', 'Generar factura']
  },
  {
    id: 'sales-add',
    category: 'Ventas',
    name: 'Nueva Venta',
    description: 'Crear una nueva venta con selección de productos',
    path: '/sales/add',
    icon: Plus,
    features: ['Seleccionar cliente', 'Agregar productos', 'Calcular total', 'Métodos de pago', 'Confirmación']
  },
  {
    id: 'sales-invoice',
    category: 'Ventas',
    name: 'Facturación',
    description: 'Generar y gestionar facturas de ventas',
    path: '/billing/create',
    icon: FileText,
    features: ['Seleccionar venta', 'Datos fiscales', 'Generar factura', 'Descargar PDF', 'Enviar por email']
  },
  {
    id: 'stock-list',
    category: 'Stock',
    name: 'Inventario de Productos',
    description: 'Ver todos los productos en stock con cantidades',
    path: '/stock',
    icon: Package,
    features: ['Lista de productos', 'Stock actual', 'Precio', 'Categorías', 'Búsqueda', 'Editar stock']
  },
  {
    id: 'stock-add',
    category: 'Stock',
    name: 'Agregar Producto',
    description: 'Registrar un nuevo producto en el inventario',
    path: '/stock/add',
    icon: Plus,
    features: ['Nombre del producto', 'Categoría', 'Precio', 'Stock inicial', 'Descripción', 'Imágenes']
  },
  {
    id: 'stock-adjust',
    category: 'Stock',
    name: 'Ajustar Stock',
    description: 'Ajustar las cantidades de stock de productos',
    path: '/stock/adjustments',
    icon: Edit,
    features: ['Seleccionar producto', 'Cantidad a ajustar', 'Motivo del ajuste', 'Confirmación', 'Historial de ajustes']
  },
  {
    id: 'repairs-list',
    category: 'Reparaciones',
    name: 'Lista de Reparaciones',
    description: 'Ver todas las reparaciones en curso y finalizadas',
    path: '/reparaciones/list',
    icon: Wrench,
    features: ['Estado de reparaciones', 'Asignación a técnicos', 'Filtros por estado', 'Ver detalles', 'Editar']
  },
  {
    id: 'repairs-add',
    category: 'Reparaciones',
    name: 'Nueva Reparación',
    description: 'Iniciar una nueva reparación de dispositivo',
    path: '/reparaciones/add',
    icon: Plus,
    features: ['Seleccionar cliente', 'Tipo de dispositivo', 'Descripción del problema', 'Diagnóstico inicial', 'Presupuesto']
  },
  {
    id: 'repairs-budget',
    category: 'Reparaciones',
    name: 'Presupuestos de Reparación',
    description: 'Gestionar presupuestos para reparaciones',
    path: '/reparaciones/budgets',
    icon: FileText,
    features: ['Crear presupuesto', 'Listar materiales', 'Costo de mano de obra', 'Aprobar/Rechazar', 'Enviar al cliente']
  },
  {
    id: 'cash-register',
    category: 'Finanzas',
    name: 'Caja Diaria',
    description: 'Gestionar el cierre de caja diario',
    path: '/caja-diaria',
    icon: DollarSign,
    features: ['Ventas del día', 'Ingresos', 'Egresos', 'Balance', 'Cerrar caja', 'Reporte']
  },
  {
    id: 'expenses',
    category: 'Finanzas',
    name: 'Gastos',
    description: 'Registrar y gestionar gastos operativos',
    path: '/expenses',
    icon: DollarSign,
    features: ['Registrar gasto', 'Categorías', 'Monto', 'Descripción', 'Fecha', 'Ver historial']
  },
  {
    id: 'dashboard',
    category: 'Dashboard',
    name: 'Panel Principal',
    description: 'Vista general del sistema con estadísticas',
    path: '/dashboard',
    icon: Building2,
    features: ['Ventas del día', 'Reparaciones pendientes', 'Stock bajo', 'Alertas', 'Gráficos', 'Accesos rápidos']
  },
];

export const apiTestCategories: ApiTestCategory[] = [
  {
    name: 'Autenticación',
    icon: Users,
    tests: [
      { name: 'Login desarrollador', endpoint: '/auth/login', method: 'POST' },
      { name: 'Registro desarrollador', endpoint: '/auth/register-developer', method: 'POST' },
      { name: 'Obtener usuario actual', endpoint: '/auth/me', method: 'GET' },
      { name: 'Refresh token', endpoint: '/auth/refresh', method: 'POST' },
      { name: 'Logout', endpoint: '/auth/logout', method: 'POST' },
    ]
  },
  {
    name: 'Empresas',
    icon: Building2,
    tests: [
      { name: 'Listar empresas', endpoint: '/companies', method: 'GET' },
      { name: 'Crear empresa', endpoint: '/companies', method: 'POST' },
      { name: 'Obtener empresa por ID', endpoint: '/companies/:id', method: 'GET' },
      { name: 'Actualizar empresa', endpoint: '/companies/:id', method: 'PUT' },
      { name: 'Activar empresa', endpoint: '/companies/:id/activate', method: 'PATCH' },
      { name: 'Desactivar empresa', endpoint: '/companies/:id/deactivate', method: 'PATCH' },
    ]
  },
  {
    name: 'Usuarios',
    icon: Users,
    tests: [
      { name: 'Listar usuarios', endpoint: '/users', method: 'GET' },
      { name: 'Crear usuario', endpoint: '/users', method: 'POST' },
      { name: 'Obtener usuario por ID', endpoint: '/users/:id', method: 'GET' },
      { name: 'Actualizar usuario', endpoint: '/users/:id', method: 'PUT' },
      { name: 'Cambiar contraseña', endpoint: '/users/:id/change-password', method: 'POST' },
    ]
  },
  {
    name: 'Ventas',
    icon: ShoppingCart,
    tests: [
      { name: 'Listar ventas', endpoint: '/sales', method: 'GET' },
      { name: 'Crear venta', endpoint: '/sales', method: 'POST' },
      { name: 'Obtener venta por ID', endpoint: '/sales/:id', method: 'GET' },
      { name: 'Actualizar venta', endpoint: '/sales/:id', method: 'PUT' },
      { name: 'Anular venta', endpoint: '/sales/:id/anular', method: 'DELETE' },
    ]
  },
  {
    name: 'Stock',
    icon: Package,
    tests: [
      { name: 'Listar productos', endpoint: '/stock', method: 'GET' },
      { name: 'Crear producto', endpoint: '/stock', method: 'POST' },
      { name: 'Obtener producto por ID', endpoint: '/stock/:id', method: 'GET' },
      { name: 'Actualizar producto', endpoint: '/stock/:id', method: 'PUT' },
      { name: 'Ajustar stock', endpoint: '/stock/adjust', method: 'POST' },
    ]
  },
  {
    name: 'Reparaciones',
    icon: Wrench,
    tests: [
      { name: 'Listar reparaciones', endpoint: '/repairs', method: 'GET' },
      { name: 'Crear reparación', endpoint: '/repairs', method: 'POST' },
      { name: 'Obtener reparación por ID', endpoint: '/repairs/:id', method: 'GET' },
      { name: 'Actualizar reparación', endpoint: '/repairs/:id', method: 'PUT' },
      { name: 'Cambiar estado', endpoint: '/repairs/:id/estado', method: 'PATCH' },
    ]
  },
  {
    name: 'Presupuestos',
    icon: FileText,
    tests: [
      { name: 'Listar presupuestos', endpoint: '/budgets', method: 'GET' },
      { name: 'Crear presupuesto', endpoint: '/budgets', method: 'POST' },
      { name: 'Obtener presupuesto por ID', endpoint: '/budgets/:id', method: 'GET' },
      { name: 'Actualizar presupuesto', endpoint: '/budgets/:id', method: 'PUT' },
      { name: 'Aprobar presupuesto', endpoint: '/budgets/:id/approve', method: 'POST' },
    ]
  },
  {
    name: 'Finanzas',
    icon: DollarSign,
    tests: [
      { name: 'Listar cierres de caja', endpoint: '/cash-closings', method: 'GET' },
      { name: 'Crear cierre de caja', endpoint: '/cash-closings', method: 'POST' },
      { name: 'Obtener cierre por ID', endpoint: '/cash-closings/:id', method: 'GET' },
      { name: 'Actualizar cierre', endpoint: '/cash-closings/:id', method: 'PUT' },
      { name: 'Cerrar caja', endpoint: '/cash-closings/:id/close', method: 'PATCH' },
    ]
  },
];
