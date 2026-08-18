import type { TutorialSection } from './types'

export const STORAGE_KEY = 'ovelix_tutorial_seen'

// Selectores estructurales disponibles en todas las páginas administradas
const CONTENT = '[data-tour="content"]'
const TOPBAR = '[data-tour="topbar"]'
const SIDEBAR = '[data-tour="sidebar"]'
const TABLE = '[data-tour="table"]'
const HELP = '[data-tour="help-button"]'
const DEV_HEADER = '[data-tour="dev-header"]'
const DEV_CONTENT = '[data-tour="dev-content"]'

/* ============================================================
   Tours por página. Cada sección describe un recorrido guiado
   concretamente sobre la pantalla a la que pertenece.
   ============================================================ */

export const TUTORIAL_SECTIONS: TutorialSection[] = [
  /* ---------------- PRINCIPAL ---------------- */
  {
    id: 'dashboard',
    title: 'Panel de control',
    description: 'Resumen general del negocio: métricas, reparaciones recientes y accesos rápidos.',
    route: '/dashboard',
    steps: [
      { selector: CONTENT, position: 'top', title: 'Bienvenido al panel', content: 'Este es el panel principal. Desde acá ves la actividad del negocio de un vistazo: métricas clave, reparaciones recientes y atajos a las secciones más usadas.' },
      { selector: TOPBAR, position: 'bottom', title: 'Barra superior', content: 'Acá encontrás el buscador global (Ctrl+K), notificaciones, el escáner QR de reparaciones y tu perfil.' },
      { selector: SIDEBAR, position: 'right', title: 'Menú de navegación', content: 'Desde el menú lateral accedés a todas las secciones: clientes, ventas, stock, reparaciones, proveedores, gastos y más.' },
    ],
  },

  /* ---------------- VENTAS Y CLIENTES ---------------- */
  {
    id: 'clients-list',
    title: 'Clientes',
    description: 'Registro y consulta de clientes del taller.',
    route: '/clients',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Gestión de clientes', content: 'Acá se administran todos los clientes. Podés buscarlos, ver el detalle de cada uno (ficha + historial de reparaciones) y cargar nuevos.' },
      { selector: TABLE, position: 'center', title: 'Listado de clientes', content: 'La tabla muestra nombre, contacto y acciones. Tocá una fila para abrir la ficha del cliente con su historial completo.' },
      { selector: TOPBAR, position: 'bottom', title: 'Búsqueda', content: 'Usá el buscador global para encontrar un cliente al instante por nombre o teléfono.' },
    ],
  },
  {
    id: 'clients-add',
    title: 'Alta de cliente',
    description: 'Cómo cargar un cliente nuevo.',
    route: '/clients/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nuevo cliente', content: 'Completá el formulario con los datos del cliente: nombre, teléfono, email y dirección.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar cliente', content: 'Confirmá el alta para que el cliente quede disponible en ventas, reparaciones y WhatsApp.' },
    ],
  },
  {
    id: 'sales-list',
    title: 'Ventas',
    description: 'Consulta de ventas y facturación.',
    route: '/sales',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Registro de ventas', content: 'En esta sección cargás y consultás las ventas del negocio, tanto de reparaciones como de productos del stock.' },
      { selector: SIDEBAR, position: 'right', title: 'Accesos de venta', content: 'Desde el menú podés ir a nueva venta, facturación en línea y caja diaria.' },
      { selector: TABLE, position: 'center', title: 'Listado de ventas', content: 'Cada venta muestra cliente, productos, método de pago y total. Podés generar la factura asociada.' },
    ],
  },
  {
    id: 'sales-add',
    title: 'Nueva venta',
    description: 'Armar el carrito y confirmar una venta.',
    route: '/sales/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Carrito de venta', content: 'Elegís el cliente, agregás productos del stock, aplicás el medio de pago y confirmás la venta.' },
      { selector: CONTENT, position: 'bottom', title: 'Confirmación', content: 'Al confirmar se descuenta stock automáticamente y podés imprimir el comprobante.' },
    ],
  },
  {
    id: 'billing-list',
    title: 'Facturas',
    description: 'Comprobantes electrónicos emitidos.',
    route: '/billing',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Facturación', content: 'Acá encontrás todas las facturas electrónicas emitidas. Podés ver su estado y consultar el detalle.' },
      { selector: CONTENT, position: 'bottom', title: 'Crear factura', content: 'Usá el botón "Crear factura" para emitir un comprobante nuevo (FC A/B/C) vinculado a una venta o reparación.' },
    ],
  },
  {
    id: 'billing-create',
    title: 'Crear factura',
    description: 'Emisión de un comprobante electrónico.',
    route: '/billing/create',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nueva factura', content: 'Completá los datos del comprobante: tipo, cliente, punto de venta y conceptos a facturar.' },
      { selector: CONTENT, position: 'bottom', title: 'Emisión', content: 'Al confirmar, el sistema se comunica con ARCA y queda registrado el comprobante electrónico.' },
    ],
  },
  {
    id: 'arca-settings',
    title: 'ARCA · Facturación electrónica',
    description: 'Configuración de la integración con ARCA.',
    route: '/billing/ARCA',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Integración ARCA', content: 'Acá configurás los datos fiscales: CUIT, puntos de venta, certificados y ambiente de la facturación electrónica.' },
      { selector: CONTENT, position: 'bottom', title: 'Estado del servicio', content: 'Verificá que el certificado esté vigente y que la conexión con ARCA funcione antes de emitir comprobantes.' },
    ],
  },
  {
    id: 'arca-iva',
    title: 'ARCA · Libro de IVA',
    description: 'Resumen mensual de compras y ventas.',
    route: '/billing/ARCA/iva',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Libro de IVA', content: 'Consultá el resumen mensual de IVA compras y ventas para la presentación de impuestos.' },
      { selector: CONTENT, position: 'bottom', title: 'Exportar', content: 'Podés exportar los registros del período para tu contador o para la carga en AFIP.' },
    ],
  },
  {
    id: 'cash-register',
    title: 'Caja diaria',
    description: 'Control de ingresos y egresos del día.',
    route: '/caja-diaria',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Cierre de caja', content: 'Llevás el control del cierre de caja del día: ingresos por ventas y reparaciones, egresos y el cierre final.' },
      { selector: CONTENT, position: 'bottom', title: 'Diferencias', content: 'El sistema te avisa si hay diferencias entre lo declarado y lo registrado para que cuadres la caja.' },
    ],
  },
  {
    id: 'iphone-sales',
    title: 'iPhone · Ventas',
    description: 'Ventas de equipos iPhone.',
    route: '/iphone/sales',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Ventas iPhone', content: 'Registrás la venta de equipos iPhone vinculada al inventario. Cada venta actualiza el listado de stock de iPhones.' },
      { selector: TABLE, position: 'center', title: 'Historial', content: 'La tabla resume cada venta: equipo, imei, cliente y precio.' },
    ],
  },
  {
    id: 'iphone-records',
    title: 'iPhone · Registros',
    description: 'Registro de compras y stock de dispositivos.',
    route: '/iphone/records',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Registro de dispositivos', content: 'Acá se registran los equipos que ingresan (comprados o canjeados) con su imei, estado y valor.' },
    ],
  },
  {
    id: 'iphone-insurance',
    title: 'iPhone · Seguros',
    description: 'Equipos vendidos con seguro.',
    route: '/iphone/insurance',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Dispositivos asegurados', content: 'Consultá los equipos vendidos con seguro, su fecha de vencimiento y el estado de cada póliza.' },
    ],
  },
  {
    id: 'iphone-canje',
    title: 'iPhone · Programa de canje',
    description: 'Canje de equipos usados.',
    route: '/iphone-canje',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Canje iPhone', content: 'Acá gestionás el programa de canje: un cliente entrega su equipo usado a cuenta de uno nuevo.' },
      { selector: CONTENT, position: 'bottom', title: 'Nuevo canje', content: 'Cargá un canje nuevo definiendo el equipo entrante, su valoración y el equipo que se lleva el cliente.' },
    ],
  },
  {
    id: 'iphone-canje-new',
    title: 'iPhone · Nuevo canje',
    description: 'Formulario para registrar un canje.',
    route: '/iphone-canje/new',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Identificación del dispositivo', content: 'Completá los datos del equipo que ingresa: modelo, imei y estado físico para calcular su valor de canje.' },
      { selector: CONTENT, position: 'bottom', title: 'Valoración', content: 'Según el estado del equipo el sistema sugiere el monto a descontar del equipo nuevo.' },
    ],
  },

  /* ---------------- SERVICIOS ---------------- */
  {
    id: 'repairs-list',
    title: 'Reparaciones',
    description: 'Flujo técnico completo de reparaciones.',
    route: '/reparaciones/list',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Reparaciones', content: 'Esta es la sección central del taller. Registrás el ingreso de equipos, movés su estado (recibido, en reparación, listo, entregado) y gestionás presupuestos.' },
      { selector: TABLE, position: 'center', title: 'Listado de órdenes', content: 'Cada orden muestra cliente, equipo, estado y técnico. Podés filtrar por estado y buscarlas por número.' },
      { selector: TOPBAR, position: 'bottom', title: 'Escáner QR', content: 'Con el botón de QR podés escanear el código de una orden existente para abrirla al instante.' },
    ],
  },
  {
    id: 'repairs-add',
    title: 'Nueva reparación',
    description: 'Cargar el ingreso de una reparación.',
    route: '/reparaciones/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nueva reparación', content: 'Cargás el cliente y el equipo, describís el problema y asignás un técnico. La reparación queda con un número de orden para el seguimiento.' },
      { selector: CONTENT, position: 'bottom', title: 'Diagnóstico y presupuesto', content: 'Podés registrar el diagnóstico y generar el presupuesto con repuestos y mano de obra para que el cliente lo apruebe.' },
    ],
  },
  {
    id: 'repairs-quick-add',
    title: 'Reparación rápida',
    description: 'Alta exprés de reparaciones.',
    route: '/reparaciones/quick-add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Alta rápida', content: 'Un asistente breve para cargar reparaciones en pasos: cliente, dispositivo, problema y confirmación.' },
    ],
  },
  {
    id: 'repairs-add-simple',
    title: 'Reparación simple',
    description: 'Alta simplificada de reparaciones.',
    route: '/reparaciones/add-simple',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Alta simple', content: 'Formulario simplificado para registrar el ingreso de un equipo sin pasos intermedios: cliente, equipo, problema y estado inicial.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar', content: 'Al confirmar se genera la orden de servicio y queda disponible en el listado de reparaciones.' },
    ],
  },
  {
    id: 'repairs-edit',
    title: 'Detalle / edición de reparación',
    description: 'Seguimiento de una orden existente.',
    route: '/reparaciones/edit',
    routes: ['/reparaciones/qr-details'],
    steps: [
      { selector: CONTENT, position: 'center', title: 'Ficha de la reparación', content: 'Acá ves la información completa de la orden: estado, técnico, tiempo transcurrido, comentarios y repuestos utilizados.' },
      { selector: CONTENT, position: 'bottom', title: 'Cambiar estado', content: 'Avanzás el estado de la reparación (en reparación → listo → entregado). Cada cambio queda registrado en la línea de tiempo.' },
    ],
  },
  {
    id: 'repairs-budgets',
    title: 'Presupuestos',
    description: 'Presupuestos de reparaciones.',
    route: '/reparaciones/budgets',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Presupuestos', content: 'Acá se administran los presupuestos generados: aprobados, rechazados y pendientes de respuesta del cliente.' },
      { selector: CONTENT, position: 'bottom', title: 'Aprobación', content: 'Cuando el cliente aprueba, el presupuesto pasa a reparación y los repuestos se descuentan del stock.' },
    ],
  },
  {
    id: 'repairs-qr-scanner',
    title: 'Escáner QR',
    description: 'Abrir órdenes con el lector de QR.',
    route: '/reparaciones/qr-scanner',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Escanear QR', content: 'Apunta la cámara al código QR impreso en la orden de servicio. Al detectarlo se abre la reparación directamente.' },
    ],
  },
  {
    id: 'repairs-qr-details',
    title: 'Detalle por QR',
    description: 'Ficha abierta desde un QR.',
    route: '/reparaciones/qr-details',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Orden desde QR', content: 'Esta es la ficha de la reparación abierta desde el código QR. Podés consultar su estado y avanzar el flujo.' },
    ],
  },
  {
    id: 'envios-tracking',
    title: 'Envíos · Seguimiento',
    description: 'Seguimiento de envíos de proveedores.',
    route: '/envios/tracking',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Seguimiento de envíos', content: 'Acá ves el estado de los envíos de los proveedores: pendientes, en tránsito y entregados.' },
      { selector: TABLE, position: 'center', title: 'Estado de cada envío', content: 'Cada envío muestra proveedor, items y estado del tracking actualizado.' },
    ],
  },
  {
    id: 'envios-remises',
    title: 'Envíos · Remises',
    description: 'Remitos de salidas y traslados.',
    route: '/envios/remises',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Remises', content: 'Administrás los remitos: salidas de mercadería a depósito o clientes con su numeración correlativa.' },
    ],
  },

  /* ---------------- COMUNICACIÓN ---------------- */
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Mensajería integrada a clientes.',
    route: '/whatsapp',
    steps: [
      { selector: CONTENT, position: 'center', title: 'WhatsApp', content: 'Mantenés una conexión de WhatsApp integrada para enviar mensajes y avisos a los clientes directamente desde el sistema.' },
      { selector: CONTENT, position: 'bottom', title: 'Conectar usuario', content: 'Vinculá un número de WhatsApp escaneando el QR. Después podés avisar a clientes de estados de reparación y ofertas.' },
    ],
  },

  /* ---------------- INVENTARIO ---------------- */
  {
    id: 'stock-list',
    title: 'Stock',
    description: 'Inventario de productos.',
    route: '/stock',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Inventario', content: 'Acá se controla todo el stock de productos para la venta: cantidades, precios y estados.' },
      { selector: TABLE, position: 'center', title: 'Listado de productos', content: 'La tabla muestra el stock disponible y avisa cuándo un producto queda con stock bajo.' },
      { selector: SIDEBAR, position: 'right', title: 'Movimientos', content: 'Desde Stock podés ir a agregar producto, repuestos y ajustes de existencias.' },
    ],
  },
  {
    id: 'stock-add',
    title: 'Alta de producto',
    description: 'Cargar un producto nuevo al stock.',
    route: '/stock/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nuevo producto', content: 'Completá nombre, categoría, precio de compra y venta, y stock inicial del producto.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar', content: 'Al guardar, el producto queda disponible para la venta y sus movimientos quedan registrados.' },
    ],
  },
  {
    id: 'stock-repuestos',
    title: 'Stock · Repuestos',
    description: 'Inventario de repuestos de reparación.',
    route: '/stock/repuestos',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Repuestos', content: 'Acá se gestiona el inventario de repuestos técnicos usados en las reparaciones.' },
      { selector: TABLE, position: 'center', title: 'Listado de repuestos', content: 'Cada repuesto muestra unidad, costo y stock. Se descuentan automáticamente al usarlos en una reparación.' },
    ],
  },
  {
    id: 'stock-iphone',
    title: 'Stock · iPhone',
    description: 'Inventario de equipos iPhone.',
    route: '/stock/iphone',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Inventario de iPhone', content: 'Listado de todos los equipos iPhone en stock con su modelo, imei, color y estado.' },
      { selector: TABLE, position: 'center', title: 'Detalle por equipo', content: 'Cada equipo tiene su ficha con identificación, especificaciones, proveniencia y datos de venta.' },
    ],
  },
  {
    id: 'stock-iphone-add',
    title: 'Stock · Alta de iPhone',
    description: 'Incorporar un iPhone al inventario.',
    route: '/stock/iphone-add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Alta de equipo', content: 'Completás el formulario completo del equipo: identificación (imei), especificaciones, estado físico y costo.' },
      { selector: CONTENT, position: 'bottom', title: 'Multimedia', content: 'Podés cargar fotos del equipo para mostrarlo en la venta.' },
    ],
  },
  {
    id: 'stock-iphone-insurance',
    title: 'Stock · Seguro iPhone',
    description: 'Registrar un seguro de equipo.',
    route: '/stock/iphone-insurance',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Seguro de iPhone', content: 'Registrás el seguro asociado a un equipo vendido: vigencia, cobertura y costo.' },
    ],
  },
  {
    id: 'stock-adjustments',
    title: 'Stock · Ajustes',
    description: 'Correcciones de existencias.',
    route: '/stock/adjustments',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Ajustes de stock', content: 'Acá corregís inventarios: sobrantes, faltantes o mermas. Cada ajuste queda asentado como movimiento.' },
      { selector: TABLE, position: 'center', title: 'Historial de ajustes', content: 'Podés revisar todos los ajustes realizados y su motivo.' },
    ],
  },
  {
    id: 'providers-list',
    title: 'Proveedores',
    description: 'Proveedores de insumos.',
    route: '/providers',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Proveedores', content: 'Administrás los proveedores de insumos y repuestos del negocio.' },
      { selector: TABLE, position: 'center', title: 'Listado de proveedores', content: 'Cada proveedor muestra contacto, categorías que provee y acciones disponibles.' },
    ],
  },
  {
    id: 'providers-add',
    title: 'Alta de proveedor',
    description: 'Cargar un proveedor nuevo.',
    route: '/providers/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nuevo proveedor', content: 'Completá la información básica del proveedor, sus datos de contacto y las categorías de insumos que suministra.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar', content: 'Al confirmar, el proveedor queda disponible para crear órdenes de compra.' },
    ],
  },
  {
    id: 'providers-orders',
    title: 'Órdenes de compra',
    description: 'Compras a proveedores y su detalle.',
    route: '/providers/orders',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Órdenes de compra', content: 'Acá están todas las compras a proveedores. Podés crearlas, ver su estado y recibir la mercadería.' },
      { selector: CONTENT, position: 'bottom', title: 'Nueva orden', content: 'Armás la orden con proveedor, productos e ítems. Al recibirla, el stock se actualiza automáticamente.' },
    ],
  },
  {
    id: 'providers-order-form',
    title: 'Orden de compra · Formulario',
    description: 'Armar una orden de compra.',
    route: '/providers/orders/add',
    routes: ['/providers/orders/edit'],
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nueva orden', content: 'Elegís el proveedor y vas agregando los productos a comprar con sus precios.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar la orden', content: 'La orden queda en estado pendiente hasta que recibas la mercadería.' },
    ],
  },

  /* ---------------- FINANZAS ---------------- */
  {
    id: 'expenses-list',
    title: 'Gastos',
    description: 'Gastos operativos del negocio.',
    route: '/expenses',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Gastos', content: 'Registrás cada gasto operativo (alquiler, servicios, insumos) con su categoría y medio de pago para tener el costo del negocio claro.' },
      { selector: TABLE, position: 'center', title: 'Listado de gastos', content: 'La tabla resume cada gasto con su monto y categoría. Podés filtrar por período.' },
    ],
  },
  {
    id: 'expenses-add',
    title: 'Nuevo gasto',
    description: 'Registrar un gasto del negocio.',
    route: '/expenses/add',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Nuevo gasto', content: 'Cargás el concepto, la categoría, el monto y el medio de pago del gasto.' },
      { selector: CONTENT, position: 'bottom', title: 'Guardar', content: 'Al confirmar, el gasto se refleja en caja y en los reportes financieros.' },
    ],
  },
  {
    id: 'expenses-categories',
    title: 'Gastos · Categorías',
    description: 'Administración de categorías de gastos.',
    route: '/expenses/categories',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Categorías de gastos', content: 'Acá definís y ordenás las categorías para clasificar los gastos del negocio.' },
    ],
  },
  {
    id: 'reports-sales',
    title: 'Reporte de ventas',
    description: 'Informe de ventas del período.',
    route: '/reports/sales',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Reporte de ventas', content: 'Consultás el resumen de ventas por período, método de pago y producto.' },
      { selector: CONTENT, position: 'bottom', title: 'Filtros y exportación', content: 'Ajustás fechas y filtros, y podés exportar el reporte para análisis.' },
    ],
  },
  {
    id: 'reports-stock',
    title: 'Reporte de stock',
    description: 'Informe del inventario.',
    route: '/reports/stock',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Reporte de stock', content: 'Ves la valorización del inventario, productos con stock bajo y movimientos del período.' },
    ],
  },
  {
    id: 'reports-financial',
    title: 'Reporte financiero',
    description: 'Resultados y cuentas del negocio.',
    route: '/reports/financial',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Reporte financiero', content: 'Resumen de ingresos, egresos y resultado neto del negocio por período.' },
    ],
  },
  {
    id: 'reports-repairs',
    title: 'Reporte de reparaciones',
    description: 'Informe de actividad del taller.',
    route: '/reports/repairs',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Reporte de reparaciones', content: 'Analizás la actividad del taller: cantidad de reparaciones, tiempos promedio, técnicos y facturación.' },
    ],
  },
  {
    id: 'settings',
    title: 'Configuración',
    description: 'Ajustes generales del sistema y del negocio.',
    route: '/settings',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Configuración', content: 'Acá personalizás estados de reparación, métodos de pago, impuestos, cuentas bancarias y preferencias del sistema.' },
      { selector: CONTENT, position: 'bottom', title: 'Aplicar cambios', content: 'Recordá guardar los cambios en cada apartado para que se apliquen.' },
    ],
  },
  {
    id: 'profile',
    title: 'Mi perfil',
    description: 'Datos de la cuenta del usuario.',
    route: '/profile',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Mi perfil', content: 'Acá ves y editás tus datos de usuario, contraseña y preferencias personales.' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Centro de notificaciones.',
    route: '/notifications',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Notificaciones', content: 'Recibís avisos importantes: stock bajo, reparaciones listas, vencimientos y novedades del sistema.' },
    ],
  },
  {
    id: 'docs',
    title: 'Documentación',
    description: 'Manual y ayuda del sistema.',
    route: '/docs',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Documentación', content: 'Manual de uso del sistema: guías, videos y referencia de cada módulo.' },
    ],
  },
  {
    id: 'help',
    title: 'Tutoriales',
    description: 'Centro de ayuda interactivo.',
    route: '/help',
    steps: [
      { selector: CONTENT, position: 'center', title: 'Centro de ayuda', content: 'Acá tenés todos los tutoriales interactivos del sistema. Elegí una sección para ver el recorrido guiado.' },
      { selector: HELP, position: 'top', title: 'Botón flotante de ayuda', content: 'En cualquier pantalla podés pulsar este botón para repetir el tutorial de la sección en la que estés.' },
    ],
  },

  /* ---------------- DESARROLLADOR ---------------- */
  {
    id: 'developer-dashboard',
    title: 'Developer · Panel',
    description: 'Panel de administración de la plataforma.',
    route: '/developer/dashboard',
    steps: [
      { selector: DEV_HEADER, position: 'bottom', title: 'Panel desarrollador', content: 'Consola de administración de la plataforma: empresas, usuarios, seguridad y monitoreo.' },
      { selector: DEV_CONTENT, position: 'center', title: 'Indicadores', content: 'Acá vés métricas globales de la plataforma y su estado general.' },
    ],
  },
  {
    id: 'developer-companies',
    title: 'Developer · Empresas',
    description: 'Gestión de empresas de la plataforma.',
    route: '/developer/companies',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Gestionar empresas', content: 'Alta, edición y suspensión de las empresas que usan el sistema.' },
      { selector: DEV_CONTENT, position: 'bottom', title: 'Datos de la empresa', content: 'Cada empresa tiene su plan, estado de suscripción y usuarios asociados.' },
    ],
  },
  {
    id: 'developer-users',
    title: 'Developer · Usuarios',
    description: 'Usuarios de la plataforma.',
    route: '/developer/users',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Usuarios', content: 'Administración de los usuarios de la plataforma: alta, roles y accesos.' },
    ],
  },
  {
    id: 'developer-tests',
    title: 'Developer · Pruebas',
    description: 'Pruebas del sistema.',
    route: '/developer/tests',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Pruebas del sistema', content: 'Herramientas para probar funcionalidades y validar el estado de los servicios internos.' },
    ],
  },
  {
    id: 'developer-roles',
    title: 'Developer · Roles y permisos',
    description: 'Control de roles de la plataforma.',
    route: '/developer/security/roles',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Roles y permisos', content: 'Definís los roles globales y los permisos que otorga cada uno dentro de la plataforma.' },
    ],
  },
  {
    id: 'developer-audit',
    title: 'Developer · Auditoría',
    description: 'Registro de accesos.',
    route: '/developer/security/audit',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Auditoría de acceso', content: 'Registro de los accesos y acciones sensibles realizadas en la plataforma.' },
    ],
  },
  {
    id: 'developer-health',
    title: 'Developer · Estado del sistema',
    description: 'Health check de servicios.',
    route: '/developer/monitoring/health',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Estado del sistema', content: 'Estado de cada servicio: base de datos, API, integraciones y tiempos de respuesta.' },
    ],
  },
  {
    id: 'developer-cron',
    title: 'Developer · Tareas programadas',
    description: 'Cron jobs del sistema.',
    route: '/developer/monitoring/cron',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Tareas programadas', content: 'Ves las tareas automáticas (cron): copias de seguridad, renovación de tokens y limpieza.' },
    ],
  },
  {
    id: 'developer-logs',
    title: 'Developer · Logs',
    description: 'Logs del servidor.',
    route: '/developer/monitoring/logs',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Logs del servidor', content: 'Consulta de logs de la aplicación para diagnosticar errores y comportamientos.' },
    ],
  },
  {
    id: 'developer-dashboards',
    title: 'Developer · Paneles',
    description: 'Paneles de monitoreo de la plataforma.',
    route: '/developer/analytics/dashboards',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Paneles analíticos', content: 'Paneles visuales con los indicadores clave de la plataforma, editables y segmentados por métrica.' },
    ],
  },
  {
    id: 'developer-stats',
    title: 'Developer · Analítica',
    description: 'Estadísticas de uso.',
    route: '/developer/analytics/stats',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Analítica', content: 'Métricas de uso de la plataforma: empresas activas, ventas y actividad general.' },
    ],
  },
  {
    id: 'developer-backups',
    title: 'Developer · Backups',
    description: 'Copias de seguridad.',
    route: '/developer/backup/backups',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Backups', content: 'Generás y descargás copias de seguridad de la base de datos de la plataforma.' },
    ],
  },
  {
    id: 'developer-restore',
    title: 'Developer · Restauración',
    description: 'Restaurar una copia de seguridad.',
    route: '/developer/backup/restore',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Restauración', content: 'Restaurá una copia de seguridad existente. Es una acción sensible y queda auditada.' },
    ],
  },
  {
    id: 'developer-api-docs',
    title: 'Developer · API Docs',
    description: 'Documentación de la API.',
    route: '/developer/api/docs',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Documentación de API', content: 'Referencia de la API REST de la plataforma: endpoints, autenticación y ejemplos.' },
    ],
  },
  {
    id: 'developer-api-tokens',
    title: 'Developer · Tokens',
    description: 'Tokens de integración.',
    route: '/developer/api/tokens',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Tokens de API', content: 'Generás y revocás tokens para integraciones externas con la API.' },
    ],
  },
  {
    id: 'developer-templates',
    title: 'Developer · Plantillas',
    description: 'Plantillas de notificaciones.',
    route: '/developer/notifications/templates',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Plantillas', content: 'Editás las plantillas de correo y WhatsApp que el sistema envía automáticamente.' },
    ],
  },
  {
    id: 'developer-bulk',
    title: 'Developer · Envíos masivos',
    description: 'Notificaciones masivas.',
    route: '/developer/notifications/bulk',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Envíos masivos', content: 'Armás y enviás notificaciones masivas a usuarios o clientes de la plataforma.' },
    ],
  },
  {
    id: 'developer-database',
    title: 'Developer · Base de datos',
    description: 'Explorador de la base de datos.',
    route: '/developer/database',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Base de datos', content: 'Exploración de las tablas y registros de la base de datos para diagnóstico.' },
    ],
  },
  {
    id: 'developer-settings',
    title: 'Developer · Configuración',
    description: 'Configuración de la plataforma.',
    route: '/developer/settings',
    steps: [
      { selector: DEV_CONTENT, position: 'center', title: 'Configuración de plataforma', content: 'Parámetros globales de la plataforma: dominios, límites de plan y preferencias generales.' },
    ],
  },
]

export const DEFAULT_TOUR_STEPS = TUTORIAL_SECTIONS[0].steps

/**
 * Devuelve la sección de tutorial más específica para una ruta dada.
 * Se elige siempre la coincidencia de prefijo más larga para que
 * rutas hijas (p.ej. /reports/sales) no sean capturadas por la raíz (/reports).
 */
export const getTutorialByRoute = (pathname: string): TutorialSection | undefined => {
  const normalized = pathname.split('?')[0]

  // Redirecciones de la app
  if (normalized === '/') return TUTORIAL_SECTIONS.find((s) => s.route === '/dashboard')
  if (normalized === '/envios') return TUTORIAL_SECTIONS.find((s) => s.route === '/envios/tracking')
  if (normalized === '/reports') return TUTORIAL_SECTIONS.find((s) => s.route === '/reports/sales')
  if (normalized === '/developer') return TUTORIAL_SECTIONS.find((s) => s.route === '/developer/dashboard')

  const match = TUTORIAL_SECTIONS.filter(
    (section) =>
      normalized === section.route ||
      normalized.startsWith(section.route + '/') ||
      (section.routes ?? []).some((r) => normalized === r || normalized.startsWith(r + '/')),
  ).sort((a, b) => b.route.length - a.route.length)[0]

  return match
}