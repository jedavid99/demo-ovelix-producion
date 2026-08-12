import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { TenantPageConfigDto, UpdateTenantPageDto } from './dto/tenant-pages.dto';

const PLACEHOLDER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBhqgrFbPNZs2zFtmho7lZ4fcJwHn1we56cCRq9lxJaxws7Wi_CvhbT62c9OD2I1aPkT_6sQWwxC7fHktSGU5fej1TiiwE95l9ekWnmGhNpmb--7nAGSNihSOZY8TWjmmVMGEw_jpPaVf5L411xLyFwUNRXoGeeAmaVIGdxFj_k6_1pKpet1t4nTzAFN-phOUnnUa22zEmOa3_Gi3-jyrVDpnsCG-xTht9kyGyP5ieWrn7SndCSdZAapfuYQV2adUBCe61Hj7MSz3GS';

export function buildDefaultConfig(slug: string, companyName?: string): TenantPageConfigDto {
  const name = companyName || 'Mi negocio';
  return {
    slug,
    enabled: false,
    brand: {
      name,
      logoText: name.toLowerCase(),
      tagline: 'Reparación técnica profesional',
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
    contact: {},
    nav: [
      { label: 'SERVICIOS', to: '/' },
      { label: 'TASAR', to: '/valuation' },
      { label: 'SEGUIMIENTO', to: '/tracking' },
      { label: 'RESERVAR', to: '/atelier' },
    ],
    hero: {
      eyebrow: 'SERVICIO TÉCNICO ESPECIALIZADO',
      headline1: 'TU EQUIPO,',
      headlineAccent: 'COMO NUEVO',
      description:
        'Reparaciones rápidas y garantizadas con repuestos originales. Presupuesto gratis y diagnóstico en el momento.',
      cta1: 'RESERVAR AHORA',
      cta2: 'VER SERVICIOS',
      image: PLACEHOLDER_IMG,
    },
    about: {
      title: 'NUESTRO SELLO',
      description:
        'Cada equipo que recibimos pasa por un riguroso protocolo de diagnóstico y verificación antes de cualquier intervención.',
      features: [
        { title: 'Diagnóstico honesto', desc: 'Te contamos el problema real y el costo exacto antes de empezar.' },
        { title: 'Repuestos originales', desc: 'Solo trabajamos con componentes certificados de fábrica.' },
      ],
      badgeTitle: 'SERVICIO CERTIFICADO',
      badgeText: 'TÉCNICOS ESPECIALIZADOS CON GARANTÍA POR ESCRITO',
      image: PLACEHOLDER_IMG,
    },
    services: {
      eyebrow: 'CATÁLOGO',
      title: 'NUESTROS SERVICIOS',
      description: 'Precios claros, repuestos originales y garantía por escrito en cada trabajo.',
      items: [
        { icon: 'smartphone', title: 'REPARACIÓN DE CELULARES', desc: 'Pantallas, baterías y módulos reemplazados en el día.', price: 'DESDE $80' },
        { icon: 'laptop', title: 'SERVICIO DE NOTEBOOKS', desc: 'Limpieza interna, teclados y reparación de puertos.', price: 'DESDE $120' },
        { icon: 'settings', title: 'SOPORTE Y SOFTWARE', desc: 'Actualizaciones, respaldo de datos y desbloqueos.', price: 'DESDE $40' },
      ],
    },
    cta: {
      title: 'PRESUPUESTO SIN',
      accent: 'CARGO',
      description: 'Traé tu equipo, lo revisamos al instante y te pasamos el costo exacto antes de empezar.',
      button: 'PEDIR PRESUPUESTO',
    },
    footer: {
      legal: ['LEGAL', 'PRIVACIDAD', 'COBERTURA', 'GARANTÍA'],
      rights: `© ${new Date().getFullYear()} ${name}. BUENOS AIRES, ARGENTINA.`,
    },
    valuation: {
      title: 'BUSCÁ TU SERVICIO',
      placeholder: 'INGRESÁ EL MODELO DE TU EQUIPO...',
      suggestions: ['iPhone 15 Pro', 'S24 Ultra', 'iPad Pro M4', 'MacBook Pro M3'],
      resultsTitle: 'Soluciones técnicas',
      resultsSubtitle: 'Servicios especializados encontrados',
      badgeLabel: 'Componentes originales',
      selectLabel: 'SELECCIONAR',
      results: [
        {
          badge: 'Prioridad inmediata',
          title: 'Reemplazo de pantalla',
          desc: 'Reemplazo del panel y calibración de color con componentes originales.',
          label: 'Costo estimado',
          price: 'ARS 425.000',
          img: PLACEHOLDER_IMG,
        },
        {
          badge: 'Especialista maestro',
          title: 'Restauración de placa madre',
          desc: 'Microsoldadura para fallas de circuitos de energía y daño por líquidos.',
          label: 'Desde',
          price: 'ARS 185.000',
          img: PLACEHOLDER_IMG,
        },
      ],
      helpTitle: '¿No encontrás tu problema?',
      helpDescription:
        'Ofrecemos evaluaciones de diagnóstico personalizadas para fallas poco comunes y equipos únicos.',
      helpButtons: ['CONSULTAR POR WHATSAPP', 'RESERVAR DIAGNÓSTICO'],
    },
    tracking: {
      statusLabel: 'Estado de reparación activo',
      orderCode: '#OV-1001',
      deviceName: 'Dispositivo',
      clientName: 'Cliente',
      messageButton: 'ESCRIBIR AL TALLER',
      reportButton: 'VER INFORME COMPLETO',
      steps: [
        { label: 'Paso 01', title: 'Recibido', desc: 'Registro y diagnóstico iniciados.', status: 'done', icon: 'check' },
        { label: 'En progreso', title: 'En reparación', desc: '', status: 'active', icon: 'settings' },
        { label: 'Paso 03', title: 'Control de calidad', desc: 'Pruebas de esfuerzo y verificación.', status: 'pending', icon: 'shield' },
        { label: 'Paso 04', title: 'Listo para retirar', desc: 'Embalaje final en ambiente controlado.', status: 'pending', icon: 'package' },
      ],
      progressTitle: 'Reconstrucción de circuito',
      progressPercent: 60,
      progressNote: 'Intervención en curso bajo control.', 
      labLabel: 'Laboratorio principal',
      labLocation: 'Buenos Aires',
      image: PLACEHOLDER_IMG,
      imageAlt: 'Equipo en laboratorio',
      componentsTitle: 'Integridad de componentes',
      components: [
        { name: 'Pantalla', status: 'Nominal' },
        { name: 'Batería', status: 'Optimizada' },
        { name: 'Placa madre', status: 'Probada' },
      ],
      completionTitle: 'Entrega estimada',
      completionDate: 'En curso',
      completionTime: '—',
      completionNote: 'El equipo pasa una validación final antes de la entrega.',
    },
    booking: {
      title: 'RESERVÁ TU REPARACIÓN',
      description:
        'Elegí tu equipo, contanos qué le pasa y te asignamos el turno. Llegás, entregás y en el momento te pasamos el presupuesto.',
      devices: [
        { id: 'iphone', title: 'IPHONE SERIES', sub: 'SERVICIO DE MICROCOMPONENTES', img: PLACEHOLDER_IMG },
        { id: 'laptop', title: 'NOTEBOOK', sub: 'ESPECIALISTA EN PLACAS', img: PLACEHOLDER_IMG },
      ],
      days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
      monthLabel: 'MES ACTUAL',
      slots: [
        { time: '09:00', avail: true },
        { time: '11:30', avail: true },
        { time: '14:00', avail: true },
        { time: '16:30', avail: false },
      ],
      serviceMap: { iphone: 'Reemplazo de pantalla', laptop: 'Restauración de placa madre' },
      priceMap: { iphone: '$45.000 ARS', laptop: '$185.000 ARS' },
      step1Title: '¿Qué equipo traés?',
      step2Title: 'Datos del cliente',
      step3Title: 'Programá la entrega',
      formLabels: [
        { label: 'NOMBRE COMPLETO', key: 'name', type: 'text', ph: 'NOMBRE Y APELLIDO' },
        { label: 'CORREO ELECTRÓNICO', key: 'email', type: 'email', ph: 'EMAIL@DOMINIO.COM' },
        { label: 'WHATSAPP', key: 'whatsapp', type: 'tel', ph: '+54 11 0000-0000' },
      ],
      slotsLabel: 'Turnos disponibles',
      summaryLabel: 'RESUMEN',
      summaryRows: [
        { label: 'EQUIPO', value: 'iPhone' },
        { label: 'SERVICIO', value: 'Reemplazo de pantalla' },
        { label: 'TIEMPO EST.', value: '3-4 horas' },
      ],
      quoteLabel: 'PRESUPUESTO',
      summerTime: '3-4 horas',
      disclaimer: '* El presupuesto final puede variar tras la inspección técnica. Precio con componentes certificados y garantía escrita.',
      errorInvalid: 'Completá tu nombre y tu correo electrónico.',
      submit: 'RESERVAR TURNO',
      submitting: 'PROCESANDO...',
      confirmed: '¡RESERVA CONFIRMADA!',
      guaranteeTitle: 'GARANTÍA',
      guaranteeText: 'Todos los trabajos incluyen garantía por escrito con repuestos originales.',
    },
  };
}

@Injectable()
export class TenantPagesService {
  constructor(private prisma: PrismaService) {}

  /** Config editable desde el dashboard (por empresa del token) */
  async getForCompany(empresaId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: empresaId } });
    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const page = await this.prisma.tenantPage.findUnique({
      where: { empresa_id: empresaId },
    });

    return {
      company: {
        id: company.id,
        slug: company.codigo_empresa,
        razon_social: company.razon_social,
      },
      enabled: page?.enabled ?? false,
      updated_at: page?.updated_at ?? null,
      config: (page?.config as TenantPageConfigDto) ?? buildDefaultConfig(company.codigo_empresa, company.razon_social),
    };
  }

  /** Persiste la config del dashboard (upsert) */
  async upsert(empresaId: string, body: UpdateTenantPageDto) {
    const existing = await this.prisma.tenantPage.findUnique({
      where: { empresa_id: empresaId },
    });

    if (existing) {
      const updated = await this.prisma.tenantPage.update({
        where: { id: existing.id },
        data: {
          config: body.config as object,
          enabled: body.enabled ?? existing.enabled,
        },
      });
      return this.serialize(updated);
    }

    const created = await this.prisma.tenantPage.create({
      data: {
        empresa_id: empresaId,
        config: body.config as object,
        enabled: body.enabled ?? false,
      },
    });
    return this.serialize(created);
  }

  /** Endpoint público: resuelve por codigo_empresa (slug del subdominio) */
  async getPublicBySlug(slug: string) {
    const normalized = slug.toLowerCase();
    const company = await this.prisma.company.findUnique({
      where: { codigo_empresa: normalized },
      select: { id: true, codigo_empresa: true, razon_social: true, activo: true },
    });

    if (!company || !company.activo) {
      // Fallback por igualdad case-insensitive por si el slug fue creado con mayúsculas
      const fallback = await this.prisma.company.findFirst({
        where: { codigo_empresa: { equals: normalized, mode: 'insensitive' }, activo: true },
        select: { id: true, codigo_empresa: true, razon_social: true, activo: true },
      });
      if (!fallback) {
        throw new NotFoundException('Tenant no encontrado');
      }
      return this.buildPublicResponse(fallback);
    }

    return this.buildPublicResponse(company);
  }

  private async buildPublicResponse(company: { id: string; codigo_empresa: string }) {
    const page = await this.prisma.tenantPage.findUnique({
      where: { empresa_id: company.id },
    });

    if (!page || !page.enabled) {
      throw new NotFoundException('La página no está publicada para este tenant');
    }

    return {
      slug: company.codigo_empresa.toLowerCase(),
      config: page.config as TenantPageConfigDto,
    };
  }

  private serialize(page: { config: unknown; enabled: boolean; updated_at: Date }) {
    return {
      enabled: page.enabled,
      updated_at: page.updated_at,
      config: page.config as TenantPageConfigDto,
    };
  }
}