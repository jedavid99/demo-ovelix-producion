import type { TenantPageConfig } from './tenant.types'

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhqgrFbPNZs2zFtmho7lZ4fcJwHn1we56cCRq9lxJaxws7Wi_CvhbT62c9OD2I1aPkT_6sQWwxC7fHktSGU5fej1TiiwE95l9ekWnmGhNpmb--7nAGSNihSOZY8TWjmmVMGEw_jpPaVf5L411xLyFwUNRXoGeeAmaVIGdxFj_k6_1pKpet1t4nTzAFN-phOUnnUa22zEmOa3_Gi3-jyrVDpnsCG-xTht9kyGyP5ieWrn7SndCSdZAapfuYQV2adUBCe61Hj7MSz3GS'
const ABOUT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdV21SVaQ17ioxube_ZVOsuR9eZZZIS_Fh1G14O7AJTxpgj4cXCBQv-HdzWnjxNKP_xIGxmVkPA9Fl19nGWebFuEvr52acdQdsG0w8XJB5eDBSECc-KYWtTabbQJPHrptqkc8Jza_Pvjrio4knG9RU0PtC3RtJbM38vZ9lUizQMkdnGm2uNLGzQVuR1I_tOKxQNjEk2zvM0p8rq42VCOFDQA3zmHAZB1BIpWDWWITniOJYq3xGPxIpl8_IiW-wA1KQABZ1auVQO-wk'
const TRACK_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCLZsdGEqQniBA_GIwmj8uM9jmkkpNsJm7HSFRT-k7LAGgQbX-WiHOR7Pf0sWe3r7P1Zx0X47H07OntRxfubLRfEQTlIBo1jdjnS_HbeutucfGQlqghhqdTTfNTcwTtDRsxW3pWY8rjLs0jb-kqlLWfXL8FKKHR2GjccpARn_ukrU8PSw8vZ-CJflvhLvQ8boELsAf7cYm05A7Xmaqp5r8e6UyJh96db_wRyzP30v3iRqsw0NanOX43QKG66qE2t_yT7qMc55Rn_7Z'
const RESULT_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEp9WT53gFNnnRLQdmj9ukqzzhNujlLUuL5qSgqCwOr2o0z5kb_mpVuTuy_yEC4fNDnVxhUZfVgVR9kAY21VAwAQ50Ps5MK4zuKV7vgCTW85pf5lv1MAOqZF4jrZLsaqtzrfFSiCrViRD-sVqRiyx-2SOExMSyV_vwTbUd6znefvjFzdmHqcJK7rnkneatY54SkVWx29KFh8xTB6eV7RcAH4NArbWgFU0jyT2t7RwxNK_jqN2yTNXD4aYk679tQ0-5tEyhJvISiYQ0'
const RESULT_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtvY7I1viRqqOSi_6AyjxvSjOekZEskhMRasY_8Zb9R90i53Pk3YwrcZ0X9JIyYFQXrd_hLfJgMS5LQeD704aMngJgXO9yAsr5hSNlaR-DWIO0ju2Nha2MI3Bdk5eXkaVXIHdx38Vhz0Q2xd-bVydCpIZrW-GDnldc3wcWjtuzK03KOQoN3ECJmdTFZ7DWVze_spGkGdDuCpkVNC8djUBlmjQnMcMjuYpx80HB92rBYFO0oIJKGCYCMeZtbcfWchS65Sxm5rXExxg6'
const RESULT_3 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDqALMv0px04o1X0Vdh0S4g9HH1ozf4wfKkCXngDX9AkAxxtH9k_8NZ8w5y0hahmQU19LEUIbhOEO9-FgbzKgHQjgh9soVd__ttqd39rZ1Rsi3HaCejMMxSibB26eI6H0qwnecgpZJHVOllt1SlgmYMdXyiIBIC0e8TbzmrLE8-C_l3Oqm5NF78OwymuSgrEuGPLOza71kPpozyi7LpoAIzLeEm2ELita9fj6T3nS-duxgS6xbENZCcsVcWJRKwj5K3xLUnxb_uFwu'
const RESULT_4 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPv7ivyzFd7QnMHmShx7G9MpEo7XOT1kkiEgKOODJ6XhEQNcFB1De2ef1_awnge5BpGjIOWflWTaTsqjJTq3ap4qe2va7OYS8IxZ-i6WEJYIFKHrSgXASqS7xPR_P7Ip6gxbQAQ5lauc4oFPuKgZcnIxPWYo9vBwF2yc_A6vFjMS4rMDiDrzYxuj46wdAky1Y8k5yvSKoX1Z1N0KggzkAmyqji0nCR3EAB_iqtgPqXEgQB_10BrhoES07PlP8-pvR2BYK5uwf1ptgU'
const DEVICE_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuClAVAW2M0Tvv4EWZRU-x-VSid6kRm7OFCGvsLA-HJtgrX7zuxwhf7q0ZDZQl_XtCwk1KXvxtIjixasi3JTJ8gSB3UDdzbH7EwsmFhxF4rpjGMxS61FTsr6pa0yP3sq2unCj-vzFiu6B3SbLgkAdm_Y64kwpp6uzrM6_0YQpkTyBJeMbyTZpKLkggjxKbBuajJE9vYtN1K2sumvMwf0so7YiIDUo-95Rk_jTBefgSMVJJyl4Ylv33hjUlvTxp5tmVVSW3jrWOay8rsO'
const DEVICE_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMk4e2olnn_ntiwK7qs2ViVdTzA5lTfpwn57Nkjll0oOtyFl3w8LsRs5IG7GZGE_sPsfJ4JO1sZscxHT_UrV7Nl8XcpG4R4g9_TeMCkAXBxHQdOcpKkay8czvBsBWQQStzEcj_xOOKcLItBUoOfMjAwyNd3-J8njkKQrpM97gzMb7HWSFC_wcF7ZF3T_4rPPE32XaIqOmB4WcIK2IC5kXbO7VSd4usUEIx6y345B3heDbHLOkiExZvAgE2UAr3nKVhM9RCxwzQWbFe'

const BASE: TenantPageConfig = {
  slug: 'ovelix',
  enabled: true,
  brand: {
    name: 'ovelix',
    logoText: 'ovelix',
    tagline: 'Taller de reparación de precisión',
  },
  theme: {
    primaryColor: '#0066ff',
    onPrimary: '#ffffff',
    accentText: '#8db8f5',
    accentFill: '#7fc4e0',
    onAccentFill: '#0a2530',
    accentHover: '#5fa0be',
    secondaryFill: '#1e3f57',
    onSecondaryFill: '#cfe4f3',
    secondaryHover: '#3c517d',
  },
  contact: {
    whatsapp: 'https://wa.me/541100000000',
    phone: '+54 11 0000-0000',
    email: 'hola@ovelix.com',
    address: 'Av. del Taller 1234',
    city: 'Recoleta, Buenos Aires',
  },
  schedule: [
    { day: 'Lunes', hours: '09:00 - 18:00' },
    { day: 'Martes', hours: '09:00 - 18:00' },
    { day: 'Miércoles', hours: '09:00 - 18:00' },
    { day: 'Jueves', hours: '09:00 - 18:00' },
    { day: 'Viernes', hours: '09:00 - 18:00' },
    { day: 'Sábado', hours: '09:00 - 13:00' },
    { day: 'Domingo', hours: '—', closed: true },
  ],
  nav: [
    { label: 'SERVICIOS', to: '/' },
    { label: 'PRESUPUESTAR', to: '/valuation' },
    { label: 'SEGUIMIENTO', to: '/tracking' },
    { label: 'Taller', to: '/Taller' },
    { label: 'UBICACIÓN', to: '/ubicacion' },
  ],
  hero: {
    eyebrow: 'PRECISIÓN RELOJERA PARA EQUIPOS MÓVILES',
    headline1: 'EL ARTE DE LO',
    headlineAccent: 'INTERNO VISIBLE',
    description:
      'El Taller exclusivo de Buenos Aires para la restauración quirúrgica de hardware digital de alto valor. No solo reparamos: curamos la longevidad con componentes de grado de precisión.',
    cta1: 'RESERVAR EN EL Taller',
    cta2: 'VER SERVICIOS',
    image: HERO_IMG,
  },
  about: {
    title: 'SELLO Taller',
    description:
      'Cada equipo que ingresa a nuestro taller pasa por un riguroso protocolo de verificación. Nuestros estándares no son solo técnicos: son referencias estéticas y funcionales que garantizan que tu equipo vuelva en estado de fábrica-plus.',
    features: [
      {
        title: 'Precisión quirúrgica',
        desc: 'Entornos de sala limpia para microcirugía de placas y reconstrucción de compuertas lógicas.',
      },
      {
        title: 'Compromiso de originalidad',
        desc: 'Abastecemos exclusivamente a través de cadenas primarias para garantizar la integridad de las piezas originales.',
      },
    ],
    badgeTitle: 'CERTIFICADO ISO 9001',
    badgeText: 'MIEMBRO DEL GREMIO DE MAESTROS ARTESANOS DE BUENOS AIRES',
    image: ABOUT_IMG,
  },
  services: {
    eyebrow: 'PORTAFOLIO',
    title: 'SERVICIOS CURADOS',
    description: 'Intervenciones especializadas para el coleccionista de hardware moderno y el usuario profesional.',
    items: [
      {
        icon: 'microscope',
        title: 'CIRUGÍA DE PLACA MADRE',
        desc: 'Reemplazo de CI, reconstrucción de pistas y diagnóstico de cortocircuitos mediante imágenes térmicas de alta frecuencia.',
        price: 'DESDE $250',
      },
      {
        icon: 'eye',
        title: 'CALIBRACIÓN DE PANTALLA',
        desc: 'Reemplazos originales de OLED con serialización True Tone y calibración de espacio de color según estándares de fábrica.',
        price: 'DESDE $180',
      },
      {
        icon: 'zap',
        title: 'GESTIÓN DE ENERGÍA',
        desc: 'Reemplazo de batería de alta capacidad con verificación de cero ciclos y ajuste del circuito de gestión de energía.',
        price: 'DESDE $95',
      },
    ],
  },
  cta: {
    title: 'ELEVÁ EL VALOR DE',
    accent: 'TU EQUIPO',
    description:
      'Experimentá la diferencia de la reparación artesanal. Nuestros especialistas están listos para hacer una evaluación preliminar de tu equipo.',
    button: 'PROGRAMAR TURNO',
  },
  footer: {
    legalPages: [
      {
        label: 'UBICACIÓN Y HORARIOS',
        slug: 'ubicacion',
        content:
          'El ingreso y retiro de equipos se realiza dentro del horario de atención.\n\nSi necesitás retirar tu equipo fuera de ese horario, escribinos por WhatsApp y coordinamos la entrega.',
      },
      {
        label: 'GARANTÍA',
        slug: 'garantia',
        content:
          'Todas las reparaciones realizadas en el atelier incluyen una garantía de 12 meses sobre los componentes reemplazados y la mano de obra.\n\nLa garantía cubre defectos de fabricación o fallas de instalación. No cubre daños por golpes, líquidos, uso indebido o modificaciones realizadas por terceros luego de la entrega.\n\nPara hacer valer la garantía presentá la orden de reparación o el ticket de entrega. La evaluación de cobertura se realiza en nuestro laboratorio dentro de las 72 horas hábiles de recibido el equipo.\n\nAnte cualquier duda escribinos a hola@ovelix.com o por WhatsApp.',
      },
      {
        label: 'LEGAL',
        slug: 'legal',
        content:
          'ovelix es un atelier de reparación de dispositivos electrónicos con domicilio en Av. del Atelier 1234, Recoleta, Buenos Aires.\n\nLos servicios se prestan previa aceptación de un presupuesto. El cliente declara ser propietario del equipo o contar con autorización del titular para su intervención. Las fotografías y datos registrados al ingreso forman parte del expediente de la orden de reparación y podrán utilizarse para el seguimiento interno del servicio.\n\nLa reparación incluye únicamente los componentes indicados en el presupuesto aprobado. Cualquier modificación del alcance deberá ser aceptada por escrito o por WhatsApp antes de su ejecución.\n\nAnte cualquier controversia, será competente la jurisdicción de la Ciudad Autónoma de Buenos Aires, Argentina.',
      },
      {
        label: 'PRIVACIDAD',
        slug: 'privacidad',
        content:
          'En ovelix respetamos tu privacidad. Los datos personales que nos proporcionás (nombre, teléfono, correo y los datos técnicos de tu equipo) se utilizan exclusivamente para gestionar tu orden de reparación, contactarte con novedades del servicio y emitir el comprobante correspondiente.\n\nNo compartimos tus datos con terceros, salvo los proveedores de logística o pagos estrictamente necesarios para el servicio, o cuando la ley lo requiera.\n\nTenés derecho a solicitar el acceso, rectificación o eliminación de tus datos personales escribiéndonos a hola@ovelix.com.\n\nLos registros de cámaras y el resguardo de tu equipo se conservan únicamente durante la vigencia del servicio y lo que exija la normativa aplicable.',
      },
    ],
    rights: '© 2024 ovelix ATELIER DE REPARACIÓN. BUENOS AIRES, ARGENTINA.',
  },
  valuation: {
    title: 'BÚSQUEDA DE PRECISIÓN',
    placeholder: 'INGRESÁ EL MODELO DE TU EQUIPO...',
    suggestions: ['iPhone 15 Pro', 'S24 Ultra', 'iPad Pro M4', 'MacBook Pro M3'],
    resultsTitle: 'Soluciones técnicas',
    resultsSubtitle: '4 servicios especializados encontrados para iPhone 15 Pro',
    badgeLabel: 'Componentes originales',
    selectLabel: 'SELECCIONAR',
    results: [
      {
        badge: 'Prioridad inmediata',
        title: 'Reemplazo de pantalla',
        desc: 'Reemplazo quirúrgico del panel Super Retina XDR usando componentes originales calibrados para preservar la integridad de True Tone y Face ID.',
        label: 'Costo estimado',
        price: 'ARS 425.000',
        img: RESULT_1,
      },
      {
        badge: 'Especialista maestro',
        title: 'Restauración de placa madre',
        desc: 'Microsoldadura a nivel de componentes para fallas de circuitos de energía y daño por líquidos. Realizado en un entorno libre de estática certificado ISO.',
        label: 'Desde',
        price: 'ARS 185.000',
        img: RESULT_2,
      },
      {
        badge: 'Servicio express',
        title: 'Optimización de batería',
        desc: 'Reemplazo con celdas originales de cero ciclos. Incluye perfilado completo de gestión de energía y juntas adhesivas nuevas para sellado IP68.',
        label: 'Tarifa estándar',
        price: 'ARS 95.000',
        img: RESULT_3,
      },
      {
        badge: 'Precisión óptica',
        title: 'Alineación de módulo de cámara',
        desc: 'Reemplazo completo del módulo por inestabilidad de enfoque o artefactos de sensor. Recalibración de los sensores OIS y LiDAR.',
        label: 'Costo estimado',
        price: 'ARS 215.000',
        img: RESULT_4,
      },
    ],
    helpTitle: '¿No encontrás tu problema?',
    helpDescription:
      'Nuestros técnicos maestros ofrecen evaluaciones de diagnóstico personalizadas para fallas poco comunes y configuraciones de equipo únicas.',
    helpButtons: ['CONCIERGE WHATSAPP', 'RESERVAR DIAGNÓSTICO'],
  },
  tracking: {
    statusLabel: 'Estado de reparación activo',
    orderCode: '#OV-9921',
    deviceName: 'iPhone 15 Pro Max',
    clientName: 'Mariano Acuña',
    messageButton: 'ESCRIBIR AL Taller',
    reportButton: 'VER INFORME COMPLETO',
    steps: [
      { label: 'Paso 01', title: 'Recibido', desc: 'Autenticación y registro de diagnóstico iniciados en nuestro laboratorio.', status: 'done', icon: 'check' },
      { label: 'En progreso', title: 'En reparación', desc: '', status: 'active', icon: 'settings' },
      { label: 'Paso 03', title: 'Control de calidad', desc: 'Pruebas de esfuerzo y verificación con imágenes térmicas.', status: 'pending', icon: 'shield' },
      { label: 'Paso 04', title: 'Listo para retirar', desc: 'Embalaje final en ambiente controlado de polvo.', status: 'pending', icon: 'package' },
    ],
    progressTitle: 'Reconstrucción de circuito',
    progressPercent: 78,
    progressNote: 'Microsoldadura secuencia 4/6 bajo aumento de 40x.',
    labLabel: 'Laboratorio 04 — Ala de micro-reparación',
    labLocation: 'Recoleta, Buenos Aires',
    image: TRACK_IMG,
    imageAlt: 'Equipo en laboratorio',
    componentsTitle: 'Integridad de componentes',
    components: [
      { name: 'Matriz OLED', status: 'Nominal' },
      { name: 'Lógica A17 Pro', status: 'Optimizada' },
      { name: 'Conjunto TrueDepth', status: 'Probada' },
    ],
    completionTitle: 'Entrega estimada',
    completionDate: 'OCT 24',
    completionTime: '17:00 ART',
    completionNote: 'Tu equipo está pasando una estricta validación post-reparación para asegurar que se mantengan los niveles de resistencia al agua.',
  },
  booking: {
    title: 'RESERVÁ TU TURNO EN EL Taller',
    description:
      'Asegurate un lugar en nuestra cola técnica. Nuestros técnicos maestros se especializan en micro-reparaciones de alta precisión para hardware premium.',
    devices: [
      { id: 'iphone', title: 'IPHONE SERIES', sub: 'SERVICIO DE MICROCOMPONENTES', img: DEVICE_1 },
      { id: 'macbook', title: 'MACBOOK PRO', sub: 'ESPECIALISTA EN PLACAS', img: DEVICE_2 },
    ],
    days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
    monthLabel: 'OCTUBRE 2024',
    slots: [
      { time: '09:00', avail: true },
      { time: '11:30', avail: true },
      { time: '14:00', avail: true },
      { time: '16:30', avail: false },
    ],
    serviceMap: { iphone: 'Calibración de pantalla', macbook: 'Restauración de placa madre' },
    priceMap: { iphone: '$45.000 ARS', macbook: '$185.000 ARS' },
    step1Title: 'Seleccioná el equipo',
    step2Title: 'Datos del cliente',
    step3Title: 'Programá la entrega',
    formLabels: [
      { label: 'NOMBRE COMPLETO', key: 'name', type: 'text', ph: 'GABRIEL RODRIGUEZ' },
      { label: 'CORREO ELECTRÓNICO', key: 'email', type: 'email', ph: 'G.RODRIGUEZ@DOMINIO.COM' },
      { label: 'WHATSAPP', key: 'whatsapp', type: 'tel', ph: '+54 11 0000-0000' },
      { label: 'NÚMERO DE SERIE (OPCIONAL)', key: 'serial', type: 'text', ph: 'XXXX-XXXX-XXXX' },
    ],
    slotsLabel: 'Turnos disponibles',
    summaryLabel: 'RESUMEN',
    summaryRows: [
      { label: 'EQUIPO', value: 'iPhone 15 Pro Max' },
      { label: 'SERVICIO', value: 'Calibración de pantalla' },
      { label: 'TIEMPO EST.', value: '3-4 horas' },
    ],
    quoteLabel: 'PRESUPUESTO',
    summerTime: '3-4 horas',
    disclaimer:
      '* El presupuesto final puede variar tras la inspección técnica. El precio incluye componentes certificados y una garantía de 12 meses del Taller.',
    errorInvalid: 'Completá tu nombre y tu correo electrónico.',
    submit: 'CONFIRMAR RESERVA',
    submitting: 'PROCESANDO...',
    confirmed: '¡RESERVA CONFIRMADA!',
    guaranteeTitle: 'GARANTÍA DEL Taller',
    guaranteeText: 'Tu equipo se manipula en un entorno de sala limpia ISO-7 con protección antiestática.',
  },
  checkout: {
    deliveryCost: 5000,
    cbu: '0000003100000000000001',
    alias: 'tu.alias.cbu',
    accountNumber: '0000000000001',
  },
}

export const TENANTS: TenantPageConfig[] = [
  { ...BASE },

  {
    ...BASE,
    slug: 'geeksmart',
    enabled: true,
    brand: {
      name: 'GeekSmart',
      logoText: 'geeksmart',
      tagline: 'Reparación técnica para todo público',
    },
    theme: {
      primaryColor: '#34d399',
      onPrimary: '#052e16',
      accentText: '#6ee7b7',
      accentFill: '#5eead4',
      onAccentFill: '#022c22',
      accentHover: '#2dd4bf',
      secondaryFill: '#022c22',
      onSecondaryFill: '#a7f3d0',
      secondaryHover: '#064e3b',
    },
    contact: {
      whatsapp: 'https://wa.me/5491122334455',
      phone: '+54 11 2233-4455',
      email: 'hola@geeksmart.com.ar',
      address: 'Av. Corrientes 2345',
      city: 'San Nicolás, Buenos Aires',
    },
    schedule: [
      { day: 'Lunes', hours: '10:00 - 19:00' },
      { day: 'Martes', hours: '10:00 - 19:00' },
      { day: 'Miércoles', hours: '10:00 - 19:00' },
      { day: 'Jueves', hours: '10:00 - 19:00' },
      { day: 'Viernes', hours: '10:00 - 19:00' },
      { day: 'Sábado', hours: '10:00 - 14:00' },
      { day: 'Domingo', hours: '—', closed: true },
    ],
    nav: [
      { label: 'SERVICIOS', to: '/' },
      { label: 'TASAR', to: '/valuation' },
      { label: 'SEGUIMIENTO', to: '/tracking' },
      { label: 'RESERVAR', to: '/Taller' },
      { label: 'UBICACIÓN', to: '/ubicacion' },
    ],
    hero: {
      ...BASE.hero,
      eyebrow: 'REPARACIÓN RÁPIDA Y GARANTIZADA',
      headline1: 'TU EQUIPO, COMO',
      headlineAccent: 'NUEVO EN 24 HS',
      description:
        'Reparaciones de celulares, tablets y notebooks con repuestos originales y garantía escrita. Presupuesto gratis y diagnóstico en el momento.',
      cta1: 'RESERVAR AHORA',
      cta2: 'VER SERVICIOS',
    },
    services: {
      eyebrow: 'CATÁLOGO',
      title: 'NUESTROS SERVICIOS',
      description: 'Precios claros, repuestos originales y garantía por escrito en cada trabajo.',
      items: [
        { icon: 'smartphone', title: 'REPARACIÓN DE CELULARES', desc: 'Pantallas, baterías, cargadores y módulos de cámara reemplazados en el día.', price: 'DESDE $80' },
        { icon: 'laptop', title: 'SERVICIO DE NOTEBOOKS', desc: 'Limpiado de ventilación, pasta térmica, teclados y reparación de puertos.', price: 'DESDE $120' },
        { icon: 'settings', title: 'SOPORTE Y SOFTWARE', desc: 'Actualizaciones, respaldo de datos y desbloqueos con procedimiento seguro.', price: 'DESDE $40' },
      ],
    },
    cta: {
      ...BASE.cta,
      title: 'PRESUPUESTO SIN',
      accent: 'CARGO',
      description:
        'Traé tu equipo, lo revisamos al instante y te pasamos el costo exacto antes de empezar. Sin sorpresas.',
      button: 'PEDIR PRESUPUESTO',
    },
    footer: {
      legalPages: [
        {
          label: 'UBICACIÓN Y HORARIOS',
          slug: 'ubicacion',
          content:
            'El ingreso y retiro de equipos se realiza dentro del horario de atención.\n\nSi necesitás retirar tu equipo fuera de ese horario, escribinos por WhatsApp y coordinamos la entrega.',
        },
        {
          label: 'GARANTÍA',
          slug: 'garantia',
          content:
            'Todos los trabajos incluyen 90 días de garantía por escrito sobre repuestos y mano de obra.\n\nLa garantía cubre defectos de fabricación o fallas de instalación. No cubre daños por golpes, líquidos, uso indebido o modificaciones de terceros posteriores a la entrega.\n\nPara hacer valer la garantía presentá la orden de reparación o el ticket de entrega.',
        },
        {
          label: 'LEGAL',
          slug: 'legal',
          content:
            'GeekSmart es un servicio técnico de reparación de dispositivos electrónicos con domicilio en Av. Corrientes 2345, San Nicolás, Buenos Aires.\n\nLos servicios se prestan previa aceptación de un presupuesto. El cliente declara ser propietario del equipo o contar con autorización del titular. Los datos y fotografías registrados al ingreso forman parte de la orden de reparación.\n\nLa reparación incluye únicamente los componentes indicados en el presupuesto aprobado. Cualquier cambio de alcance deberá ser aceptado por escrito o por WhatsApp antes de su ejecución.\n\nAnte cualquier controversia, será competente la jurisdicción de la Ciudad Autónoma de Buenos Aires, Argentina.',
        },
        {
          label: 'PRIVACIDAD',
          slug: 'privacidad',
          content:
            'En GeekSmart respetamos tu privacidad. Los datos personales que nos proporcionás (nombre, teléfono, correo y datos técnicos del equipo) se utilizan exclusivamente para gestionar tu reparación y contactarte con novedades del servicio.\n\nNo compartimos tus datos con terceros salvo los proveedores de logística o pagos necesarios para el servicio, o cuando la ley lo requiera.\n\nPodés solicitar acceso, rectificación o eliminación de tus datos escribiéndonos a hola@geeksmart.com.ar.\n\nLos registros se conservan durante la vigencia del servicio y lo que exija la normativa aplicable.',
        },
      ],
      rights: '© 2024 GeekSmart. BUENOS AIRES, ARGENTINA.',
    },
    booking: {
      ...BASE.booking,
      title: 'RESERVÁ TU REPARACIÓN',
      description:
        'Elegí tu equipo, contanos qué le pasa y te asignamos el turno. Llegás, entregás y en el momento te pasamos el presupuesto.',
      step1Title: '¿Qué equipo traés?',
      monthLabel: 'DICIEMBRE 2024',
      submit: 'RESERVAR TURNO',
      guaranteeTitle: 'GARANTÍA GEEKSMART',
      guaranteeText: 'Todos los trabajos incluyen 90 días de garantía por escrito con repuestos originales.',
    },
  },
]

export const DEFAULT_TENANT = BASE