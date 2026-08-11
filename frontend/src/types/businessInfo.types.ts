// Tipos para el módulo de Información de la Empresa

export interface BusinessInfo {
  id: string;
  empresa_id: string;
  nombre_negocio: string;
  propietario_nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  sitio_web: string;
  logo_url?: string;
  descripcion: string;
  horarios: {
    lunes: string;
    martes: string;
    miercoles: string;
    jueves: string;
    viernes: string;
    sabado: string;
    domingo: string;
  };
  moneda: string;
  formato_fecha: string;
  zona_horaria: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface BusinessInfoUpdate extends Partial<Omit<BusinessInfo, 'id' | 'empresa_id' | 'fecha_creacion' | 'fecha_actualizacion'>> {}
