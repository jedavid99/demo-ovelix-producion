import type { TutorialSection } from './types'

export const STORAGE_KEY = 'ovelix_tutorial_seen'

export const TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'dashboard',
    title: 'Panel de control',
    description: 'Resumen general del negocio: métricas, reparaciones recientes y accesos rápidos.',
    route: '/dashboard',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Bienvenido al panel',
        content: 'Este es el panel principal. Desde acá ves la actividad del negocio de un vistazo: métricas clave, reparaciones recientes y atajos a las secciones más usadas.',
      },
      {
        selector: '[data-tour="topbar"]',
        position: 'bottom',
        title: 'Barra superior',
        content: 'Acá encontrás el buscador global (Ctrl+K), notificaciones, escáner QR de reparaciones, verificaciones rápidas y tu perfil.',
      },
      {
        selector: '[data-tour="sidebar"]',
        position: 'right',
        title: 'Menú de navegación',
        content: 'Desde el menú lateral accedés a todas las secciones: clientes, ventas, stock, reparaciones, proveedores, gastos y más.',
      },
    ],
  },
  {
    id: 'clients',
    title: 'Clientes',
    description: 'Registro y consulta de clientes del taller.',
    route: '/clients',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Gestión de clientes',
        content: 'Acá se administran todos los clientes. Podés buscar, ver el detalle de cada uno (ficha + historial de reparaciones) y agregar nuevos.',
      },
      {
        selector: '[data-tour="content"]',
        position: 'bottom',
        title: 'Agregar cliente',
        content: 'Usá el botón "Nuevo cliente" para cargar un cliente con sus datos de contacto. Después podés asignarle reparaciones y ventas.',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Ventas',
    description: 'Venta de productos, facturación y caja.',
    route: '/sales',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Registro de ventas',
        content: 'En esta sección cargás y consultás las ventas del negocio, tanto de reparaciones como de productos del stock.',
      },
      {
        selector: '[data-tour="content"]',
        position: 'bottom',
        title: 'Nueva venta',
        content: 'Con "Nueva venta" armás el carrito: elegís el cliente, los productos, aplicás el medio de pago y confirmás.',
      },
    ],
  },
  {
    id: 'stock',
    title: 'Stock / Productos',
    description: 'Inventario de productos, repuestos e iPhones.',
    route: '/stock',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Inventario',
        content: 'Acá se controla todo el stock: productos a la venta, repuestos, inventario de iPhone y ajustes de existencias.',
      },
      {
        selector: '[data-tour="content"]',
        position: 'bottom',
        title: 'Movimientos de stock',
        content: 'Cada entrada o salida queda registrada como movimiento. El sistema avisa cuando un producto queda con stock bajo.',
      },
    ],
  },
  {
    id: 'repairs',
    title: 'Reparaciones',
    description: 'Flujo técnico completo de reparaciones.',
    route: '/reparaciones/list',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Reparaciones',
        content: 'Esta es la sección central del taller. Registrás el ingreso de equipos, movés su estado (recibido, en reparación, listo, entregado) y gestionás presupuestos.',
      },
      {
        selector: '[data-tour="content"]',
        position: 'bottom',
        title: 'Nueva reparación',
        content: 'Cargás el cliente y el equipo, describís el problema y asumís un técnico. La reparación queda con un número de orden para el seguimiento.',
      },
      {
        selector: '[data-tour="topbar"]',
        position: 'bottom',
        title: 'Escáner QR',
        content: 'Con el botón de QR podés escanear el código de una orden existente para abrirla al instante.',
      },
    ],
  },
  {
    id: 'providers',
    title: 'Proveedores y envíos',
    description: 'Órdenes de compra a proveedores y seguimiento de envíos.',
    route: '/providers',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Proveedores',
        content: 'Administrás los proveedores de insumos, las órdenes de compra y los envíos asociados.',
      },
    ],
  },
  {
    id: 'expenses',
    title: 'Gastos',
    description: 'Registro de gastos operativos del negocio.',
    route: '/expenses',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Gastos',
        content: 'Registrás cada gasto operativo (alquiler, servicios, insumos) con su categoría y medio de pago para tener el costo del negocio claro.',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reportes',
    description: 'Informes de ventas, stock, financiero y reparaciones.',
    route: '/reports',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Reportes',
        content: 'Consultás informes de ventas, stock, estado financiero y reparaciones. Acá se toman las decisiones con datos.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Configuración',
    description: 'Ajustes generales del sistema y del negocio.',
    route: '/settings',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Configuración',
        content: 'Acá personalizás estados de reparación, métodos de pago, impuestos, cuentas bancarias y las preferencias del sistema.',
      },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Mensajería integrada a clientes.',
    route: '/whatsapp',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'WhatsApp',
        content: 'Mantenés una conexión de WhatsApp integrada para enviar mensajes y avisos a los clientes directamente desde el sistema.',
      },
    ],
  },
  {
    id: 'cash',
    title: 'Caja diaria',
    description: 'Control de ingresos y egresos del día.',
    route: '/caja-diaria',
    steps: [
      {
        selector: '[data-tour="content"]',
        position: 'center',
        title: 'Caja diaria',
        content: 'Llevás el control del cierre de caja del día: ingresos por ventas y reparaciones, egresos y el cierre final.',
      },
    ],
  },
]

export const DEFAULT_TOUR_STEPS = TUTORIAL_SECTIONS[0].steps

export const getTutorialByRoute = (pathname: string): TutorialSection | undefined => {
  const normalized = pathname.split('?')[0]
  return TUTORIAL_SECTIONS.find((section) => {
    if (section.route === '/reports') {
      return normalized.startsWith('/reports')
    }
    if (section.route === '/reparaciones/list') {
      return normalized.startsWith('/reparaciones')
    }
    return normalized.startsWith(section.route)
  })
}