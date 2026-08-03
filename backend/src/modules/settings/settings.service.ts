import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { EstadoReparacion } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

const PLAN_OPTIONS = ['DEMO', 'BASICO', 'PRO', 'PLATINO'];

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
  ) {}

  // ---------- Reparación: estados existentes ----------

  async getRepairStates() {
    return Object.values(EstadoReparacion);
  }

  // ---------- Reparación: solicitudes de nuevos estados (mensajes al desarrollador) ----------

  async getRepairStateRequests(empresaId: string) {
    return this.prisma.repairStateRequest.findMany({
      where: { empresa_id: empresaId },
      orderBy: { created_at: 'desc' },
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, email: true },
        },
      },
    });
  }

  async createRepairStateRequest(empresaId: string, usuarioId: string | null, data: { estado_nombre: string; mensaje?: string }) {
    return this.prisma.repairStateRequest.create({
      data: {
        empresa_id: empresaId,
        usuario_id: usuarioId,
        estado_nombre: data.estado_nombre,
        mensaje: data.mensaje,
        estado: 'pendiente',
      },
    });
  }

  async updateRepairStateRequest(id: string, empresaId: string, estado: string) {
    const request = await this.prisma.repairStateRequest.findUnique({ where: { id } });
    if (!request || request.empresa_id !== empresaId) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return this.prisma.repairStateRequest.update({
      where: { id },
      data: { estado },
    });
  }

  // ---------- Auto-seed de defaults para empresas existentes ----------

  private readonly seededEmpresas = new Set<string>();

  private async ensureDefaults(empresaId: string) {
    // Evitar re-verificar defaults ya sembrados en el mismo proceso
    if (this.seededEmpresas.has(empresaId)) {
      return;
    }

    const [paymentMethods, prefs, integrations, plan] = await Promise.all([
      this.prisma.paymentMethod.count({ where: { empresa_id: empresaId } }),
      this.prisma.notificationPreference.count({ where: { empresa_id: empresaId } }),
      this.prisma.integration.count({ where: { empresa_id: empresaId } }),
      this.prisma.planSubscription.findUnique({ where: { empresa_id: empresaId } }),
    ]);

    if (paymentMethods === 0) {
      const defaults = [
        { nombre: 'Efectivo', descripcion: 'Pagos estándar en mostrador' },
        { nombre: 'Tarjeta de crédito/débito', descripcion: 'Visa, Mastercard, AMEX vía terminal integrada' },
        { nombre: 'Transferencia bancaria', descripcion: 'Pagos facturados para clientes corporativos' },
      ];
      await Promise.all(
        defaults.map((m) =>
          this.prisma.paymentMethod.create({ data: { ...m, empresa_id: empresaId, activo: true } }),
        ),
      );
    }

    if (prefs === 0) {
      const defaults = [
        { evento: 'NUEVO_TICKET', titulo: 'Nuevo ticket creado', descripcion: 'Se envía cuando se abre una nueva orden de reparación' },
        { evento: 'REPARACION_FINALIZADA', titulo: 'Reparación finalizada', descripcion: 'Se envía cuando el estado cambia a "Listo para recoger"' },
        { evento: 'PAGO_VENCIDO', titulo: 'Pago vencido', descripcion: 'Se envía cuando una factura permanece impagada después de la fecha de vencimiento' },
      ];
      await Promise.all(
        defaults.map((e) =>
          this.prisma.notificationPreference.create({ data: { ...e, empresa_id: empresaId, activo: true } }),
        ),
      );
    }

    if (integrations === 0) {
      const defaults = [
        { nombre: 'whatsapp', descripcion: 'Envía notificaciones de estado y chatea con clientes desde el panel.', conectado: false },
        { nombre: 'arca', descripcion: 'Facturación electrónica y comprobantes fiscales de ARCA (AFIP).', conectado: false },
        { nombre: 'mobbex', descripcion: 'Plataforma de pagos para cobrar online por Mercado Pago, tarjetas y más.', conectado: false },
      ];
      await Promise.all(
        defaults.map((i) =>
          this.prisma.integration.create({ data: { ...i, empresa_id: empresaId } }),
        ),
      );
    }

    if (!plan) {
      const now = new Date();
      await this.prisma.planSubscription.create({
        data: {
          empresa_id: empresaId,
          plan: 'DEMO',
          meses: 1,
          fecha_inicio: now,
          fecha_vencimiento: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          activo: true,
        },
      });
    }

    this.seededEmpresas.add(empresaId);
  }

  // ---------- Métodos de pago ----------

  async getPaymentMethods(empresaId: string) {
    await this.ensureDefaults(empresaId);
    return this.prisma.paymentMethod.findMany({
      where: { empresa_id: empresaId },
      orderBy: [{ activo: 'desc' }, { created_at: 'asc' }],
    });
  }

  async createPaymentMethod(empresaId: string, data: { nombre: string; descripcion?: string; activo?: boolean }) {
    return this.prisma.paymentMethod.create({
      data: {
        empresa_id: empresaId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: data.activo ?? true,
      },
    });
  }

  async updatePaymentMethod(id: string, empresaId: string, data: { nombre?: string; descripcion?: string; activo?: boolean }) {
    const method = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!method || method.empresa_id !== empresaId) {
      throw new NotFoundException('Método de pago no encontrado');
    }
    return this.prisma.paymentMethod.update({
      where: { id },
      data,
    });
  }

  async deletePaymentMethod(id: string, empresaId: string) {
    const method = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!method || method.empresa_id !== empresaId) {
      throw new NotFoundException('Método de pago no encontrado');
    }
    await this.prisma.paymentMethod.delete({ where: { id } });
    return { message: 'Método de pago eliminado correctamente' };
  }

  // ---------- Porcentajes / impuestos ----------

  async getTaxRates(empresaId: string) {
    return this.prisma.taxRate.findMany({
      where: { empresa_id: empresaId },
      orderBy: [{ activo: 'desc' }, { created_at: 'asc' }],
    });
  }

  async createTaxRate(empresaId: string, data: { nombre: string; porcentaje: number; seccion?: string; descripcion?: string; activo?: boolean }) {
    return this.prisma.taxRate.create({
      data: {
        empresa_id: empresaId,
        nombre: data.nombre,
        porcentaje: data.porcentaje,
        seccion: data.seccion,
        descripcion: data.descripcion,
        activo: data.activo ?? true,
      },
    });
  }

  async updateTaxRate(id: string, empresaId: string, data: Partial<{ nombre: string; porcentaje: number; seccion: string; descripcion: string; activo: boolean }>) {
    const rate = await this.prisma.taxRate.findUnique({ where: { id } });
    if (!rate || rate.empresa_id !== empresaId) {
      throw new NotFoundException('Porcentaje no encontrado');
    }
    return this.prisma.taxRate.update({
      where: { id },
      data,
    });
  }

  async deleteTaxRate(id: string, empresaId: string) {
    const rate = await this.prisma.taxRate.findUnique({ where: { id } });
    if (!rate || rate.empresa_id !== empresaId) {
      throw new NotFoundException('Porcentaje no encontrado');
    }
    await this.prisma.taxRate.delete({ where: { id } });
    return { message: 'Porcentaje eliminado correctamente' };
  }

  // ---------- Cuentas bancarias ----------

  async getBankAccounts(empresaId: string) {
    return this.prisma.bankAccount.findMany({
      where: { empresa_id: empresaId },
      orderBy: { created_at: 'asc' },
    });
  }

  async createBankAccount(empresaId: string, data: { alias?: string; cbu?: string; numero_cuenta?: string; banco?: string; titular?: string }) {
    return this.prisma.bankAccount.create({
      data: { ...data, empresa_id: empresaId, activo: true },
    });
  }

  async updateBankAccount(id: string, empresaId: string, data: Partial<{ alias: string; cbu: string; numero_cuenta: string; banco: string; titular: string; activo: boolean }>) {
    const account = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!account || account.empresa_id !== empresaId) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }
    return this.prisma.bankAccount.update({
      where: { id },
      data,
    });
  }

  async deleteBankAccount(id: string, empresaId: string) {
    const account = await this.prisma.bankAccount.findUnique({ where: { id } });
    if (!account || account.empresa_id !== empresaId) {
      throw new NotFoundException('Cuenta bancaria no encontrada');
    }
    await this.prisma.bankAccount.delete({ where: { id } });
    return { message: 'Cuenta bancaria eliminada correctamente' };
  }

  // ---------- Preferencias de notificación ----------

  async getNotificationPreferences(empresaId: string) {
    await this.ensureDefaults(empresaId);
    return this.prisma.notificationPreference.findMany({
      where: { empresa_id: empresaId },
      orderBy: { created_at: 'asc' },
    });
  }

  async updateNotificationPreference(id: string, empresaId: string, data: { activo: boolean }) {
    const pref = await this.prisma.notificationPreference.findUnique({ where: { id } });
    if (!pref || pref.empresa_id !== empresaId) {
      throw new NotFoundException('Preferencia de notificación no encontrada');
    }
    return this.prisma.notificationPreference.update({
      where: { id },
      data: { activo: data.activo },
    });
  }

  // ---------- Integraciones ----------

  async getIntegrations(empresaId: string) {
    await this.ensureDefaults(empresaId);
    const integrations = await this.prisma.integration.findMany({
      where: { empresa_id: empresaId },
      orderBy: { created_at: 'asc' },
    });

    const whatsappSession = await this.prisma.whatsAppSession.findUnique({
      where: { empresa_id: empresaId },
    });

    return integrations.map((integration) => {
      if (integration.nombre === 'whatsapp') {
        const connected = this.whatsappService.isConnected(empresaId) || whatsappSession?.estado === 'connected';
        return {
          ...integration,
          conectado: connected,
          estado_real: whatsappSession?.estado || 'disconnected',
        };
      }
      return integration;
    });
  }

  async updateIntegration(id: string, empresaId: string, data: { conectado: boolean }) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration || integration.empresa_id !== empresaId) {
      throw new NotFoundException('Integración no encontrada');
    }
    // WhatsApp refleja el estado real de la sesión, no se puede forzar desde aquí
    if (integration.nombre === 'whatsapp') {
      throw new ForbiddenException('El estado de WhatsApp se controla desde la conexión de la sesión');
    }
    return this.prisma.integration.update({
      where: { id },
      data: { conectado: data.conectado },
    });
  }

  // ---------- Plan ----------

  async getPlan(empresaId: string) {
    await this.ensureDefaults(empresaId);
    const plan = await this.prisma.planSubscription.findUnique({
      where: { empresa_id: empresaId },
    });
    if (!plan) {
      throw new NotFoundException('No se encontró un plan para esta empresa');
    }
    return plan;
  }

  async updatePlan(empresaId: string, data: { plan?: string; meses?: number; activo?: boolean }) {
    const current = await this.prisma.planSubscription.findUnique({
      where: { empresa_id: empresaId },
    });

    if (!current) {
      throw new NotFoundException('No se encontró un plan para esta empresa');
    }

    const plan = data.plan || current.plan;
    const meses = data.meses || current.meses;

    if (!PLAN_OPTIONS.includes(plan)) {
      throw new ConflictException('Plan inválido. Opciones: ' + PLAN_OPTIONS.join(', '));
    }

    const fechaInicio = new Date();
    const fechaVencimiento = new Date(fechaInicio.getTime() + meses * 30 * 24 * 60 * 60 * 1000);

    return this.prisma.planSubscription.update({
      where: { empresa_id: empresaId },
      data: {
        plan,
        meses,
        fecha_inicio: fechaInicio,
        fecha_vencimiento: fechaVencimiento,
        activo: data.activo ?? current.activo,
      },
    });
  }

  // ---------- Categorías de stock ----------

  async getCategories(empresaId: string) {
    return this.prisma.category.findMany({
      where: { empresa_id: empresaId },
      orderBy: { nombre: 'asc' },
    });
  }

  async createCategory(empresaId: string, data: { nombre: string; descripcion?: string }) {
    const existing = await this.prisma.category.findFirst({
      where: { nombre: data.nombre, empresa_id: empresaId },
    });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }
    return this.prisma.category.create({
      data: { ...data, empresa_id: empresaId },
    });
  }

  async updateCategory(id: string, empresaId: string, data: { nombre?: string; descripcion?: string }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.empresa_id !== empresaId) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string, empresaId: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.empresa_id !== empresaId) {
      throw new NotFoundException('Categoría no encontrada');
    }
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Categoría eliminada correctamente' };
  }
}
