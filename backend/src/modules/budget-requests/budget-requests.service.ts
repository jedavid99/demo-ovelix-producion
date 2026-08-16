import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBudgetRequestDto } from './dto/create-budget-request.dto';
import { UpdateBudgetRequestDto } from './dto/update-budget-request.dto';
import { BudgetRequestEstado } from './enums/budget-request-estado.enum';

@Injectable()
export class BudgetRequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /** Resuelve la empresa por slug/codigo_empresa (mismo criterio que bookings/tenant-pages). */
  private async resolveCompany(slug: string) {
    const normalized = slug.toLowerCase();
    const company =
      (await this.prisma.company.findUnique({ where: { slug: normalized } })) ??
      (await this.prisma.company.findUnique({ where: { codigo_empresa: normalized } })) ??
      (await this.prisma.company.findFirst({
        where: { slug: { equals: normalized, mode: 'insensitive' }, activo: true },
      })) ??
      (await this.prisma.company.findFirst({
        where: { codigo_empresa: { equals: normalized, mode: 'insensitive' }, activo: true },
      }));

    if (!company || !company.activo) {
      throw new NotFoundException('Empresa no encontrada');
    }
    return company;
  }

  /** Endpoint público: guarda la reserva de presupuesto sin autenticación. */
  async createPublic(data: CreateBudgetRequestDto) {
    const company = await this.resolveCompany(data.slug);

    const numero = await this.generateRequestNumber(company.id);

    const request = await this.prisma.budgetRequest.create({
      data: {
        empresa_id: company.id,
        numero,
        estado: BudgetRequestEstado.PENDIENTE,
        nombre: data.nombre,
        whatsapp: data.whatsapp,
        email: data.email || null,
        categoria: data.categoria || null,
        dispositivo: data.dispositivo,
        modelo: data.modelo || null,
        problema: data.problema || null,
        descripcion: data.descripcion || null,
        tiempo_estimado: data.tiempo_estimado || null,
        precio_ofertado: data.precio_ofertado != null ? new Prisma.Decimal(data.precio_ofertado) : null,
        plan_pago: data.plan_pago || null,
        sena_monto: data.sena_monto != null ? new Prisma.Decimal(data.sena_monto) : null,
        sena_metodo: data.sena_metodo || null,
        comprobante: data.comprobante || null,
        resto_metodo: data.resto_metodo || null,
        delivery_metodo: data.delivery_metodo || null,
        delivery_direccion: data.delivery_direccion || null,
        delivery_costo: data.delivery_costo != null ? new Prisma.Decimal(data.delivery_costo) : null,
        turno_fecha: data.turno_fecha || null,
        turno_horario: data.turno_horario || null,
      },
    });

    // Avisar a los administradores/recepcionistas de la empresa
    await this.notifyStaff(company.id, {
      numero: request.numero,
      nombre: request.nombre,
      dispositivo: request.dispositivo,
    });

    return request;
  }

  /** Crea una notificación por cada usuario del staff (ADMIN/RECEPCIONISTA) de la empresa y a los DESARROLLADOR. */
  private async notifyStaff(
    empresaId: string,
    request: { numero: string; nombre: string; dispositivo: string },
  ) {
    const staff = await this.prisma.user.findMany({
      where: { activo: true },
      include: { rol: { select: { name: true } } },
    });

    const recipients = staff.filter(
      (u) =>
        (u.empresa_id === empresaId && ['ADMIN', 'RECEPCIONISTA'].includes(u.rol?.name ?? '')) ||
        u.rol?.name === 'DESARROLLADOR',
    );

    await Promise.all(
      recipients.map((u) => this.notificationsService.notifyNuevoPresupuesto(u.id, request)),
    );
  }

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: { estado?: string }) {
    const where: any = {};
    if (currentUser.rol !== 'DESARROLLADOR') {
      where.empresa_id = currentUser.empresa_id;
    }
    if (filters?.estado) {
      where.estado = filters.estado;
    }

    const [requests, total] = await Promise.all([
      this.prisma.budgetRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          repair: {
            select: { id: true, numero_reparacion: true, estado: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.budgetRequest.count({ where }),
    ]);

    return {
      data: requests,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, currentUser: any) {
    const request = await this.prisma.budgetRequest.findUnique({
      where: { id },
      include: {
        repair: {
          select: { id: true, numero_reparacion: true, estado: true },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud de presupuesto no encontrada');
    }

    if (currentUser.rol !== 'DESARROLLADOR' && request.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver esta solicitud');
    }

    return request;
  }

  async update(id: string, data: UpdateBudgetRequestDto, currentUser: any) {
    const request = await this.findOne(id, currentUser);

    return this.prisma.budgetRequest.update({
      where: { id },
      data: {
        ...(data.precio_ajustado !== undefined
          ? { precio_ajustado: data.precio_ajustado != null ? new Prisma.Decimal(data.precio_ajustado) : null }
          : {}),
        ...(data.notas_admin !== undefined ? { notas_admin: data.notas_admin || null } : {}),
        ...(data.estado ? { estado: data.estado as BudgetRequestEstado } : {}),
      },
      include: { repair: { select: { id: true, numero_reparacion: true, estado: true } } },
    });
  }

  /** Convierte la solicitud confirmada en una reparación real (la agrega a la lista de reparaciones). */
  async convertToRepair(id: string, currentUser: any) {
    const request = await this.findOne(id, currentUser);

    if (request.estado === BudgetRequestEstado.CONVERTIDO) {
      throw new BadRequestException('Esta solicitud ya fue convertida en reparación');
    }
    if (request.estado === BudgetRequestEstado.RECHAZADO) {
      throw new BadRequestException('Una solicitud rechazada no puede convertirse en reparación');
    }

    return this.prisma.$transaction(async (tx) => {
      // Buscar o crear el cliente por su WhatsApp
      let client = await tx.client.findFirst({
        where: { telefono: request.whatsapp, empresa_id: request.empresa_id },
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            nombre_completo: request.nombre,
            telefono: request.whatsapp,
            email: request.email || null,
            empresa_id: request.empresa_id,
          },
        });
      }

      const precioFinal = request.precio_ajustado ?? request.precio_ofertado;

      const repair = await tx.repair.create({
        data: {
          cliente_id: client.id,
          empresa_id: request.empresa_id,
          numero_reparacion: request.numero,
          categoria_dispositivo: request.categoria || null,
          dispositivo: request.dispositivo,
          modelo: request.modelo || null,
          problema_reportado:
            request.problema || request.descripcion || `Solicitud de presupuesto: ${request.dispositivo}`,
          estado: 'INGRESADO',
          fecha_ingreso: new Date(),
          hora_ingreso: new Date().toTimeString().slice(0, 5),
          costo_estimado: request.precio_ofertado ?? null,
          total_reparacion: precioFinal ?? null,
          abono: request.sena_monto ?? null,
          forma_pago: request.plan_pago === 'half' ? '50% + 50%' : request.plan_pago === 'full' ? 'Pago completo' : null,
          notas: [
            request.descripcion || null,
            request.sena_monto != null ? `Seña (${request.sena_metodo || '—'}): ${request.sena_monto} ${request.comprobante ? `(comprobante ${request.comprobante})` : ''}` : null,
            request.resto_metodo ? `Resto: ${request.resto_metodo}` : null,
            request.delivery_metodo === 'llevar'
              ? 'Entrega: lo lleva al local'
              : request.delivery_metodo === 'retirar'
                ? `Entrega: lo retiran (${request.delivery_direccion || 'dirección pendiente'})`
                : null,
            request.turno_fecha && request.turno_horario ? `Turno: ${request.turno_fecha} ${request.turno_horario}` : null,
            request.notas_admin ? `Notas admin: ${request.notas_admin}` : null,
          ]
            .filter(Boolean)
            .join('\n') || null,
        },
        include: { cliente: true },
      });

      await tx.budgetRequest.update({
        where: { id },
        data: {
          estado: BudgetRequestEstado.CONVERTIDO,
          repair_id: repair.id,
          precio_ajustado: request.precio_ajustado ?? request.precio_ofertado,
        },
      });

      return {
        request: { ...request, estado: BudgetRequestEstado.CONVERTIDO, repair_id: repair.id },
        repair,
      };
    });
  }

  async remove(id: string, currentUser: any) {
    const request = await this.findOne(id, currentUser);
    await this.prisma.budgetRequest.delete({ where: { id: request.id } });
    return { message: 'Solicitud eliminada correctamente' };
  }

  /** Endpoint público: consultar el estado de una solicitud por número de orden (antes o después de convertirse). */
  async findByOrderNumber(numero: string) {
    const request = await this.prisma.budgetRequest.findUnique({
      where: { numero },
      include: {
        repair: {
          select: {
            numero_reparacion: true,
            estado: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return {
      numero: request.numero,
      estado: request.estado,
      categoria: request.categoria,
      dispositivo: request.dispositivo,
      modelo: request.modelo,
      problema: request.problema,
      tiempo_estimado: request.tiempo_estimado,
      precio_ofertado: request.precio_ofertado,
      precio_ajustado: request.precio_ajustado,
      created_at: request.created_at,
      repair: request.repair
        ? {
            numero_reparacion: request.repair.numero_reparacion,
            estado: request.repair.estado,
          }
        : null,
    };
  }

  private async generateRequestNumber(empresaId: string): Promise<string> {
    const today = new Date();
    const prefix = `REQ-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate()
      .toString()
      .padStart(2, '0')}`;

    const lastRequest = await this.prisma.budgetRequest.findFirst({
      where: {
        numero: { startsWith: prefix },
        empresa_id: empresaId,
      },
      orderBy: { numero: 'desc' },
    });

    let sequence = 1;
    if (lastRequest) {
      const lastSequence = parseInt(lastRequest.numero.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }
}