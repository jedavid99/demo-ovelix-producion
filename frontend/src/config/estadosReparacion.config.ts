export interface EstadoConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  fase: string;
  orden: number;
  esFinal: boolean;
}

export const ESTADOS_CONFIG: Record<string, EstadoConfig> = {
  INGRESADO: {
    label: 'Ingresado',
    color: '#3498DB',
    bgColor: '#EBF5FB',
    textColor: '#1A5276',
    fase: 'Ingreso',
    orden: 1,
    esFinal: false,
  },
  EN_COLA_DIAGNOSTICO: {
    label: 'En Cola de Diagnóstico',
    color: '#5DADE2',
    bgColor: '#D6EAF8',
    textColor: '#1B4F72',
    fase: 'Diagnóstico',
    orden: 2,
    esFinal: false,
  },
  EN_DIAGNOSTICO: {
    label: 'En Diagnóstico',
    color: '#2E86C1',
    bgColor: '#AED6F1',
    textColor: '#154360',
    fase: 'Diagnóstico',
    orden: 3,
    esFinal: false,
  },
  PRESUPUESTADO_ESPERANDO_OK: {
    label: 'Presupuestado - Esperando OK',
    color: '#F39C12',
    bgColor: '#FEF9E7',
    textColor: '#9A7D0A',
    fase: 'Presupuesto',
    orden: 4,
    esFinal: false,
  },
  PRESUPUESTO_RECHAZADO: {
    label: 'Presupuesto Rechazado',
    color: '#E67E22',
    bgColor: '#FDEBD0',
    textColor: '#A04000',
    fase: 'Presupuesto',
    orden: 5,
    esFinal: false,
  },
  RESPALDO_DE_DATOS: {
    label: 'Respaldo de Datos',
    color: '#9B59B6',
    bgColor: '#F4ECF7',
    textColor: '#6C3483',
    fase: 'Reparación',
    orden: 6,
    esFinal: false,
  },
  EN_REPARACION: {
    label: 'En Reparación',
    color: '#E74C3C',
    bgColor: '#FADBD8',
    textColor: '#922B21',
    fase: 'Reparación',
    orden: 7,
    esFinal: false,
  },
  ESPERANDO_REPUESTO_LOCAL: {
    label: 'Esperando Repuesto Local',
    color: '#F1C40F',
    bgColor: '#FCF3CF',
    textColor: '#7D6608',
    fase: 'Reparación',
    orden: 8,
    esFinal: false,
  },
  ESPERANDO_REPUESTO_IMPORTACION: {
    label: 'Esperando Repuesto Importación',
    color: '#D4AC0D',
    bgColor: '#F9E79F',
    textColor: '#7D6608',
    fase: 'Reparación',
    orden: 9,
    esFinal: false,
  },
  EN_PRUEBAS_CONTROL_CALIDAD: {
    label: 'En Pruebas Control Calidad',
    color: '#1ABC9C',
    bgColor: '#D1F2EB',
    textColor: '#0E6251',
    fase: 'Control Calidad',
    orden: 10,
    esFinal: false,
  },
  REPARADO_PENDIENTE_PAGO: {
    label: 'Reparado - Pendiente Pago',
    color: '#2ECC71',
    bgColor: '#D5F5E3',
    textColor: '#196F3D',
    fase: 'Pago',
    orden: 11,
    esFinal: false,
  },
  LISTO_PARA_RETIRAR: {
    label: 'Listo para Retirar',
    color: '#27AE60',
    bgColor: '#ABEBC6',
    textColor: '#145A32',
    fase: 'Entrega',
    orden: 12,
    esFinal: false,
  },
  ENTREGADO_AL_CLIENTE: {
    label: 'Entregado al Cliente',
    color: '#95A5A6',
    bgColor: '#EAEDED',
    textColor: '#566573',
    fase: 'Entrega',
    orden: 13,
    esFinal: false,
  },
  CERRADO_FACTURADO: {
    label: 'Cerrado Facturado',
    color: '#7F8C8D',
    bgColor: '#D5D8DC',
    textColor: '#424949',
    fase: 'Cierre',
    orden: 14,
    esFinal: true,
  },
  IRREPARABLE_PARA_RETIRAR: {
    label: 'Irreparable - Para Retirar',
    color: '#2C3E50',
    bgColor: '#D4E6F1',
    textColor: '#1A252F',
    fase: 'Irreparable',
    orden: 15,
    esFinal: false,
  },
  IRREPARABLE_ENTREGADO: {
    label: 'Irreparable Entregado',
    color: '#BDC3C7',
    bgColor: '#F2F3F4',
    textColor: '#5F6A6A',
    fase: 'Irreparable',
    orden: 16,
    esFinal: true,
  },
  EN_GARANTIA_REINGRESO: {
    label: 'En Garantía - Reingreso',
    color: '#FF5733',
    bgColor: '#FADBD8',
    textColor: '#922B21',
    fase: 'Garantía',
    orden: 17,
    esFinal: false,
  },
  GARANTIA_ENTREGADO: {
    label: 'Garantía Entregado',
    color: '#FFC300',
    bgColor: '#FCF3CF',
    textColor: '#7D6608',
    fase: 'Garantía',
    orden: 18,
    esFinal: true,
  },
  ABANDONADO_POR_CLIENTE: {
    label: 'Abandonado por el Cliente',
    color: '#C0392B',
    bgColor: '#F5B7B1',
    textColor: '#922B21',
    fase: 'Cierre',
    orden: 19,
    esFinal: true,
  },
  CANCELADO_POR_CLIENTE: {
    label: 'Cancelado por el Cliente',
    color: '#A6ACAF',
    bgColor: '#EAEDED',
    textColor: '#566573',
    fase: 'Cierre',
    orden: 20,
    esFinal: true,
  },
};

export const ESTADOS_LISTA = Object.values(ESTADOS_CONFIG).sort((a, b) => a.orden - b.orden);
export const ESTADOS_KEYS = Object.keys(ESTADOS_CONFIG);
export const ESTADOS_FASES = Array.from(new Set(Object.values(ESTADOS_CONFIG).map(e => e.fase))).sort();

export const getEstadoConfig = (estado: string): EstadoConfig => {
  if (!estado) {
    return {
      label: 'Desconocido',
      color: '#95A5A6',
      bgColor: '#EAEDED',
      textColor: '#566573',
      fase: 'Desconocido',
      orden: 999,
      esFinal: false,
    };
  }

  // Normalize the estado to uppercase for matching
  const normalizedEstado = estado.toUpperCase().replace(/-/g, '_');

  // Fallback for old English states during migration
  const oldStateMapping: Record<string, string> = {
    'PENDING': 'INGRESADO',
    'DIAGNOSTIC': 'EN_DIAGNOSTICO',
    'IN_PROGRESS': 'EN_REPARACION',
    'WAITING_PARTS': 'ESPERANDO_REPUESTO_LOCAL',
    'READY': 'LISTO_PARA_RETIRAR',
    'DELIVERED': 'ENTREGADO_AL_CLIENTE',
    'ENTREGADO': 'ENTREGADO_AL_CLIENTE',
    'CANCELLED': 'CANCELADO_POR_CLIENTE',
    'BUDGET_REJECTED': 'PRESUPUESTO_RECHAZADO',
    'IRREPARABLE': 'IRREPARABLE_PARA_RETIRAR',
  };

  const mappedEstado = oldStateMapping[normalizedEstado] || normalizedEstado;
  return ESTADOS_CONFIG[mappedEstado] || {
    label: estado.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    color: '#95A5A6',
    bgColor: '#EAEDED',
    textColor: '#566573',
    fase: 'Desconocido',
    orden: 999,
    esFinal: false,
  };
};
