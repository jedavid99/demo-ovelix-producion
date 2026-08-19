import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { AddPartDto } from './dto/add-part.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { GenerateConfigPdfDto } from './dto/generate-config-pdf.dto';
import { Prisma } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { EstadoReparacion } from './enums/estado-reparacion.enum';
import { normalizeWarranty } from '../tenant-pages/tenant-pages.service';

@Injectable()
export class RepairsService {
  constructor(private prisma: PrismaService) {}

  private readonly allowedTransitions: Record<EstadoReparacion, EstadoReparacion[]> = {
    [EstadoReparacion.INGRESADO]: [
      EstadoReparacion.EN_COLA_DIAGNOSTICO,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.EN_COLA_DIAGNOSTICO]: [
      EstadoReparacion.EN_DIAGNOSTICO,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.EN_DIAGNOSTICO]: [
      EstadoReparacion.PRESUPUESTADO_ESPERANDO_OK,
      EstadoReparacion.IRREPARABLE_PARA_RETIRAR,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.PRESUPUESTADO_ESPERANDO_OK]: [
      EstadoReparacion.RESPALDO_DE_DATOS,
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.PRESUPUESTO_RECHAZADO,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.PRESUPUESTO_RECHAZADO]: [
      EstadoReparacion.ENTREGADO_AL_CLIENTE,
      EstadoReparacion.ABANDONADO_POR_CLIENTE,
    ],
    [EstadoReparacion.RESPALDO_DE_DATOS]: [
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.EN_REPARACION]: [
      EstadoReparacion.EN_PRUEBAS_CONTROL_CALIDAD,
      EstadoReparacion.ESPERANDO_REPUESTO_LOCAL,
      EstadoReparacion.ESPERANDO_REPUESTO_IMPORTACION,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.ESPERANDO_REPUESTO_LOCAL]: [
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.ESPERANDO_REPUESTO_IMPORTACION]: [
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.EN_PRUEBAS_CONTROL_CALIDAD]: [
      EstadoReparacion.REPARADO_PENDIENTE_PAGO,
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.REPARADO_PENDIENTE_PAGO]: [
      EstadoReparacion.LISTO_PARA_RETIRAR,
      EstadoReparacion.CANCELADO_POR_CLIENTE,
    ],
    [EstadoReparacion.LISTO_PARA_RETIRAR]: [
      EstadoReparacion.ENTREGADO_AL_CLIENTE,
      EstadoReparacion.ABANDONADO_POR_CLIENTE,
    ],
    [EstadoReparacion.ENTREGADO_AL_CLIENTE]: [
      EstadoReparacion.CERRADO_FACTURADO,
    ],
    [EstadoReparacion.CERRADO_FACTURADO]: [],
    [EstadoReparacion.IRREPARABLE_PARA_RETIRAR]: [
      EstadoReparacion.IRREPARABLE_ENTREGADO,
      EstadoReparacion.ABANDONADO_POR_CLIENTE,
    ],
    [EstadoReparacion.IRREPARABLE_ENTREGADO]: [],
    [EstadoReparacion.EN_GARANTIA_REINGRESO]: [
      EstadoReparacion.EN_REPARACION,
      EstadoReparacion.GARANTIA_ENTREGADO,
      EstadoReparacion.IRREPARABLE_PARA_RETIRAR,
    ],
    [EstadoReparacion.GARANTIA_ENTREGADO]: [],
    [EstadoReparacion.ABANDONADO_POR_CLIENTE]: [],
    [EstadoReparacion.CANCELADO_POR_CLIENTE]: [],
  };

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {
      ...(currentUser.empresa_id && { empresa_id: currentUser.empresa_id }),
    };

    // Filtrar por rol
    if (currentUser.rol === 'TECNICO') {
      where.tecnico_asignado_id = currentUser.id;
    }

    // Filtros adicionales
    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.cliente_id) {
      where.cliente_id = filters.cliente_id;
    }
    if (filters?.tecnico_id) {
      where.tecnico_asignado_id = filters.tecnico_id;
    }
    if (filters?.fecha_desde) {
      where.fecha_ingreso = { gte: new Date(filters.fecha_desde) };
    }
    if (filters?.fecha_hasta) {
      where.fecha_ingreso = { ...where.fecha_ingreso, lte: new Date(filters.fecha_hasta) };
    }

    const [repairs, total] = await Promise.all([
      this.prisma.repair.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          cliente: {
            select: {
              id: true,
              nombre_completo: true,
              telefono: true,
              dni: true,
            },
          },
          tecnico_asignado: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
            },
          },
        },
        orderBy: { fecha_ingreso: 'desc' },
      }),
      this.prisma.repair.count({ where }),
    ]);

    return {
      data: repairs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const repair = await this.prisma.repair.findUnique({
      where: { id },
      include: {
        cliente: true,
        tecnico_asignado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        budgets: true,
        partsUsed: true,
      },
    });

    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Validar permisos
    // Desarrolladores pueden ver cualquier reparación
    if (currentUser.rol !== 'DESARROLLADOR') {
      if (!currentUser.empresa_id || repair.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('No tienes permiso para ver esta reparación');
      }
    }

    if (currentUser.rol === 'TECNICO' && repair.tecnico_asignado_id !== currentUser.id) {
      throw new ForbiddenException('No tienes permiso para ver esta reparación');
    }

    return repair;
  }

  async create(data: CreateRepairDto, currentUser: any) {
    const validatedData = data;

    // Para desarrolladores, usar la empresa_id proporcionada en el request o permitir null
    let empresaId = currentUser.empresa_id;
    
    // Si es desarrollador y no tiene empresa_id, permitir que se especifique en el request
    if (currentUser.rol === 'DESARROLLADOR' && !empresaId && validatedData.empresa_id) {
      empresaId = validatedData.empresa_id;
    }

    if (!empresaId) {
      throw new ForbiddenException('Se requiere una empresa para crear una reparación');
    }

    // Verificar que el cliente existe y pertenece a la empresa
    const client = await this.prisma.client.findUnique({
      where: { id: validatedData.cliente_id },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (currentUser.rol !== 'DESARROLLADOR' && client.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('El cliente no pertenece a tu empresa');
    }

    // Generar número de reparación
    const numeroReparacion = await this.generateRepairNumber(empresaId);

    // Convertir fecha_estimada_entrega a DateTime si es solo fecha
    let fechaEstimadaEntrega = validatedData.fecha_estimada_entrega;
    if (fechaEstimadaEntrega && !fechaEstimadaEntrega.includes('T')) {
      fechaEstimadaEntrega = `${fechaEstimadaEntrega}T00:00:00.000Z`;
    }

    // Excluir campos que no deben ir directo a Prisma
    const { fecha_estimada_entrega, empresa_id: _, ...repairData } = validatedData;

    // Convertir valores numéricos a Decimal
    const decimalFields = ['costo_estimado', 'total_reparacion', 'abono'];
    const processedRepairData = { ...repairData };
    decimalFields.forEach(field => {
      if (processedRepairData[field] !== undefined) {
        processedRepairData[field] = new Prisma.Decimal(processedRepairData[field]);
      }
    });

    // Asegurar que los arrays de seguridad sean válidos
    if (processedRepairData.patron_puntos && !Array.isArray(processedRepairData.patron_puntos)) {
      processedRepairData.patron_puntos = [];
    }
    if (processedRepairData.secuencia_patron && !Array.isArray(processedRepairData.secuencia_patron)) {
      processedRepairData.secuencia_patron = [];
    }

    // Calcular garantía
    if (processedRepairData.tiene_garantia) {
      // Validaciones
      if (!processedRepairData.garantia_duracion || processedRepairData.garantia_duracion <= 0) {
        throw new BadRequestException('La duración de la garantía debe ser mayor a 0');
      }
      if (!processedRepairData.garantia_unidad || !['DIAS', 'MESES'].includes(processedRepairData.garantia_unidad)) {
        throw new BadRequestException('La unidad de garantía debe ser DIAS o MESES');
      }

      // Calcular fecha inicio (usar fecha_entrega o fecha actual)
      let fechaInicio: Date;
      if (!processedRepairData.fecha_inicio_garantia) {
        fechaInicio = new Date();
      } else {
        fechaInicio = new Date(processedRepairData.fecha_inicio_garantia);
      }

      // Calcular fecha fin
      const fechaFin = new Date(fechaInicio);
      if (processedRepairData.garantia_unidad === 'DIAS') {
        fechaFin.setDate(fechaFin.getDate() + processedRepairData.garantia_duracion);
      } else {
        fechaFin.setMonth(fechaFin.getMonth() + processedRepairData.garantia_duracion);
      }

      processedRepairData.fecha_inicio_garantia = fechaInicio.toISOString();
      processedRepairData.fecha_fin_garantia = fechaFin.toISOString();
    } else {
      // Limpiar campos de garantía si no tiene garantía
      processedRepairData.garantia_duracion = null;
      processedRepairData.garantia_unidad = null;
      processedRepairData.fecha_inicio_garantia = null;
      processedRepairData.fecha_fin_garantia = null;
    }

    const repair = await this.prisma.repair.create({
      data: {
        ...processedRepairData,
        numero_reparacion: numeroReparacion,
        empresa_id: empresaId,
        fecha_ingreso: new Date(),
        hora_ingreso: new Date().toTimeString().slice(0, 5),
        fecha_estimada_entrega: fechaEstimadaEntrega ? new Date(fechaEstimadaEntrega) : null,
        forma_pago: validatedData.forma_pago || null,
      } as any,
      include: {
        cliente: true,
      },
    });

    return repair;
  }

  async update(id: string, data: UpdateRepairDto, currentUser: any) {
    const validatedData = data;

    const repair = await this.prisma.repair.findUnique({
      where: { id },
    });

    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && repair.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para editar esta reparación');
    }

    // Una vez marcada como pagada, el estado de pago no se puede revertir
    if (repair.pagado && validatedData.pagado === false) {
      throw new BadRequestException('No se puede modificar el estado de pago de una reparación ya pagada');
    }

    // Si se asigna un técnico, verificar que exista y pertenezca a la empresa
    if (validatedData.tecnico_asignado_id) {
      const technician = await this.prisma.user.findUnique({
        where: { id: validatedData.tecnico_asignado_id },
        include: { rol: true },
      });

      if (!technician || technician.rol.name !== 'TECNICO') {
        throw new BadRequestException('El usuario no es un técnico válido');
      }

      if (currentUser.rol !== 'DESARROLLADOR' && technician.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('El técnico no pertenece a tu empresa');
      }
    }

    // Calcular garantía si se actualiza
    if (validatedData.tiene_garantia !== undefined) {
      if (validatedData.tiene_garantia) {
        // Validaciones
        if (!validatedData.garantia_duracion || validatedData.garantia_duracion <= 0) {
          throw new BadRequestException('La duración de la garantía debe ser mayor a 0');
        }
        if (!validatedData.garantia_unidad || !['DIAS', 'MESES'].includes(validatedData.garantia_unidad)) {
          throw new BadRequestException('La unidad de garantía debe ser DIAS o MESES');
        }

        // Calcular fecha inicio
        let fechaInicio: Date;
        if (!validatedData.fecha_inicio_garantia) {
          fechaInicio = (repair as any).fecha_entrega || new Date();
        } else {
          fechaInicio = new Date(validatedData.fecha_inicio_garantia);
        }

        // Calcular fecha fin
        const fechaFin = new Date(fechaInicio);
        if (validatedData.garantia_unidad === 'DIAS') {
          fechaFin.setDate(fechaFin.getDate() + validatedData.garantia_duracion);
        } else {
          fechaFin.setMonth(fechaFin.getMonth() + validatedData.garantia_duracion);
        }

        validatedData.fecha_inicio_garantia = fechaInicio.toISOString();
        validatedData.fecha_fin_garantia = fechaFin.toISOString();
      } else {
        // Limpiar campos de garantía si se desactiva
        validatedData.garantia_duracion = null;
        validatedData.garantia_unidad = null;
        validatedData.fecha_inicio_garantia = null;
        validatedData.fecha_fin_garantia = null;
      }
    } else if (validatedData.fecha_entrega && (repair as any).tiene_garantia) {
      // Recalcular garantía si cambia la fecha de entrega y tiene garantía
      const fechaInicio = new Date(validatedData.fecha_entrega);
      const fechaFin = new Date(fechaInicio);
      if ((repair as any).garantia_unidad === 'DIAS') {
        fechaFin.setDate(fechaFin.getDate() + ((repair as any).garantia_duracion || 0));
      } else {
        fechaFin.setMonth(fechaFin.getMonth() + ((repair as any).garantia_duracion || 0));
      }
      validatedData.fecha_inicio_garantia = fechaInicio.toISOString();
      validatedData.fecha_fin_garantia = fechaFin.toISOString();
    }

    const updatedRepair = await this.prisma.repair.update({
      where: { id },
      data: validatedData,
      include: {
        cliente: true,
        tecnico_asignado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    return updatedRepair;
  }

  async delete(id: string, currentUser: any) {
    const repair = await this.prisma.repair.findUnique({
      where: { id },
    });

    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && repair.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para eliminar esta reparación');
    }

    // Solo se puede eliminar si está en estado INGRESADO o EN_COLA_DIAGNOSTICO
    if (repair.estado !== EstadoReparacion.INGRESADO && repair.estado !== EstadoReparacion.EN_COLA_DIAGNOSTICO) {
      throw new ForbiddenException('Solo se pueden eliminar reparaciones en estado INGRESADO o EN_COLA_DIAGNOSTICO');
    }

    await this.prisma.repair.delete({
      where: { id },
    });

    return { message: 'Reparación eliminada exitosamente' };
  }

  async updateStatus(id: string, dto: UpdateStatusDto, usuario: any) {
    const { estado: nuevoEstado, nota } = dto;

    // 1. Obtener la reparación actual
    const repair = await this.prisma.repair.findUnique({ where: { id } });
    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Validar permisos (empresa)
    if (usuario.rol !== 'DESARROLLADOR' && repair.empresa_id !== usuario.empresa_id) {
      throw new ForbiddenException('No tienes permiso para modificar esta reparación');
    }

    const estadoActual = repair.estado;
    const allowed = this.allowedTransitions[estadoActual] || [];

    // 2. Validar transición
    if (!allowed.includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede cambiar de "${estadoActual}" a "${nuevoEstado}". Transición no permitida.`
      );
    }

    // 3. Preparar datos de actualización
    const updateData: any = { estado: nuevoEstado };

    // Si el nuevo estado es "entregado" o similar, registrar fecha de entrega
    const ESTADOS_ENTREGA = [
      EstadoReparacion.ENTREGADO_AL_CLIENTE,
      EstadoReparacion.IRREPARABLE_ENTREGADO,
      EstadoReparacion.GARANTIA_ENTREGADO,
    ];
    if (ESTADOS_ENTREGA.includes(nuevoEstado)) {
      updateData.fecha_entrega = new Date();
    }

    // Al entregar un equipo que no tiene garantía, activar la garantía configurada por la empresa
    if (ESTADOS_ENTREGA.includes(nuevoEstado) && !repair.tiene_garantia) {
      const tenantPage = await this.prisma.tenantPage.findUnique({
        where: { empresa_id: repair.empresa_id },
        select: { config: true },
      });
      const warranty = normalizeWarranty((tenantPage?.config as any)?.warranty);
      if (warranty.enabled && warranty.duration > 0) {
        const fechaInicio = new Date(updateData.fecha_entrega);
        const fechaFin = new Date(fechaInicio);
        if (warranty.unit === 'DIAS') {
          fechaFin.setDate(fechaFin.getDate() + warranty.duration);
        } else {
          fechaFin.setMonth(fechaFin.getMonth() + warranty.duration);
        }
        updateData.tiene_garantia = true;
        updateData.garantia_duracion = warranty.duration;
        updateData.garantia_unidad = warranty.unit;
        updateData.garantia_meses = warranty.unit === 'MESES' ? warranty.duration : null;
        updateData.fecha_inicio_garantia = fechaInicio;
        updateData.fecha_fin_garantia = fechaFin;
      }
    }

    // 4. Actualizar la reparación + crear historial en una transacción
    return this.prisma.$transaction(async (tx) => {
      const updatedRepair = await tx.repair.update({
        where: { id },
        data: updateData,
      });

      await tx.repairStateHistory.create({
        data: {
          repair_id: id,
          estado: nuevoEstado,
          usuario_id: usuario?.id || null,
          nota: nota || null,
        },
      });

      return updatedRepair;
    });
  }

  async getHistory(id: string, currentUser: any) {
    const repair = await this.prisma.repair.findFirst({
      where: { id, ...(currentUser.rol !== 'DESARROLLADOR' ? { empresa_id: currentUser.empresa_id } : {}) },
      select: { id: true },
    });
    if (!repair) throw new NotFoundException('Reparación no encontrada');

    const history = await this.prisma.repairStateHistory.findMany({
      where: { repair_id: id },
      orderBy: { createdAt: 'asc' },
      include: {
        usuario: {
          select: { nombre: true, email: true },
        },
      },
    });

    return history;
  }

  async getPermittedStates(id: string, currentUser: any) {
    const repair = await this.prisma.repair.findFirst({
      where: { id, ...(currentUser.rol !== 'DESARROLLADOR' ? { empresa_id: currentUser.empresa_id } : {}) },
    });
    if (!repair) throw new NotFoundException('Reparación no encontrada');

    const permitted = this.allowedTransitions[repair.estado] || [];
    
    return { permitted };
  }

  async assignTechnician(id: string, tecnico_id: string, currentUser: any) {
    return this.update(id, { tecnico_asignado_id: tecnico_id }, currentUser);
  }

  async addPart(id: string, data: AddPartDto, currentUser: any) {
    const validatedData = data;

    return await this.prisma.$transaction(async (tx) => {
      const repair = await tx.repair.findUnique({
        where: { id },
      });

      if (!repair) {
        throw new NotFoundException('Reparación no encontrada');
      }

      // Validar permisos (empresa) dentro de la transacción
      if (currentUser.rol !== 'DESARROLLADOR' && repair.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('La reparación no pertenece a tu empresa');
      }

      // Verificar que el repuesto exista en stock
      const stockItem = await tx.stockItem.findUnique({
        where: { id: validatedData.repuesto_id },
      });

      if (!stockItem) {
        throw new NotFoundException('Repuesto no encontrado en inventario');
      }

      if (stockItem.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('El repuesto no pertenece a tu empresa');
      }

      // Verificar stock suficiente
      if (stockItem.stock_actual < validatedData.cantidad) {
        throw new BadRequestException('Stock insuficiente');
      }

      // Crear registro de parte usada
      const part = await tx.repairPart.create({
        data: {
          reparacion_id: id,
          repuesto_id: validatedData.repuesto_id,
          nombre: validatedData.nombre,
          cantidad: validatedData.cantidad,
          costo_unitario: validatedData.costo_unitario,
        },
      });

      // Descontar stock
      await tx.stockItem.update({
        where: { id: validatedData.repuesto_id },
        data: {
          stock_actual: { decrement: validatedData.cantidad },
        },
      });

      // Registrar movimiento de stock
      await tx.stockMovement.create({
        data: {
          item_id: validatedData.repuesto_id,
          item_nombre: stockItem.nombre,
          cantidad: validatedData.cantidad,
          tipo: 'salida',
          motivo: 'Uso en reparación',
          referencia_id: id,
          usuario_id: currentUser.id,
        },
      });

      return part;
    });
  }

  async complete(id: string, data: { total_reparacion: number; metodo_pago?: string }, currentUser: any) {
    const repair = await this.findOne(id, currentUser);

    if (repair.estado !== EstadoReparacion.EN_REPARACION && repair.estado !== EstadoReparacion.EN_PRUEBAS_CONTROL_CALIDAD) {
      throw new BadRequestException('Solo se pueden completar reparaciones en EN_REPARACION o EN_PRUEBAS_CONTROL_CALIDAD');
    }

    return this.update(id, {
      estado: EstadoReparacion.REPARADO_PENDIENTE_PAGO,
      total_reparacion: data.total_reparacion,
      metodo_pago_id: data.metodo_pago,
    } as any, currentUser);
  }

  async getByClient(clienteId: string, currentUser: any) {
    const client = await this.prisma.client.findUnique({
      where: { id: clienteId },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (currentUser.rol !== 'DESARROLLADOR' && client.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver las reparaciones de este cliente');
    }

    return this.findAll(currentUser, 1, 100, { cliente_id: clienteId });
  }

  async getByTechnician(tecnicoId: string, currentUser: any) {
    return this.findAll(currentUser, 1, 100, { tecnico_id: tecnicoId });
  }

  private async generateRepairNumber(empresaId: string): Promise<string> {
    const today = new Date();
    const prefix = `REP-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

    const lastRepair = await this.prisma.repair.findFirst({
      where: {
        numero_reparacion: { startsWith: prefix },
        empresa_id: empresaId,
      },
      orderBy: { numero_reparacion: 'desc' },
    });

    let sequence = 1;
    if (lastRepair) {
      const lastSequence = parseInt(lastRepair.numero_reparacion.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }

  async generatePdf(id: string, currentUser: any): Promise<Buffer> {
    const repair = await this.findOne(id, currentUser);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colores
      const primaryColor = '#003fb1';
      const textColor = '#191c1d';
      const grayColor = '#434654';
      const lightGray = '#f3f4f5';
      const borderColor = '#c3c5d7';

      // HEADER - Nombre de empresa y número de orden
      doc.fontSize(20).font('Helvetica-Bold').fillColor(primaryColor).text('TECH SERVE PRO', { align: 'left' });
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text('CENTRO DE SERVICIO TÉCNICO AUTORIZADO', { align: 'left' });
      
      // Número de orden y fecha a la derecha
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('ORDEN DE SERVICIO', { align: 'right' });
      doc.fontSize(20).font('Helvetica-Bold').fillColor(textColor).text(repair.numero_reparacion || '#SO-2024-0001', { align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`Fecha: ${new Date(repair.fecha_ingreso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}`, { align: 'right' });
      doc.moveDown();

      // INFORMACIÓN DEL CLIENTE Y DISPOSITIVO - Grid de 2 columnas
      const boxY = doc.y;
      
      // Caja de información del cliente
      doc.rect(50, boxY, 245, 70).stroke();
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('INFORMACIÓN DEL CLIENTE', 55, boxY + 5);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(textColor).text(repair.cliente.nombre_completo, 55, boxY + 20, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(repair.cliente.email || '', 55, boxY + 40, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(repair.cliente.telefono, 55, boxY + 55, { width: 235 });

      // Caja de información del dispositivo
      doc.rect(300, boxY, 245, 70).stroke();
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('INFORMACIÓN DEL DISPOSITIVO', 305, boxY + 5);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(textColor).text(repair.dispositivo || 'No especificado', 305, boxY + 20, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`N/S: ${repair.numero_serie || '—'}`, 305, boxY + 40, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`IMEI: ${repair.numero_serie || '—'}`, 305, boxY + 55, { width: 235 });

      doc.moveDown(4);

      // DESCRIPCIÓN DEL PROBLEMA
      const problemY = doc.y;
      doc.rect(50, problemY, 495, 60).stroke();
      doc.rect(50, problemY, 495, 20).fill(lightGray);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor).text('DESCRIPCIÓN DEL PROBLEMA', 55, problemY + 6);
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(repair.problema_reportado || 'No especificado', 55, problemY + 25, { width: 485 });

      doc.moveDown(3);

      // GARANTÍA (si aplica)
      if (repair.garantia_meses) {
        const warrantyY = doc.y;
        doc.rect(50, warrantyY, 495, 50).stroke();
        doc.rect(50, warrantyY, 495, 20).fill(lightGray);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor).text(`GARANTÍA - ${repair.garantia_meses} MESES`, 55, warrantyY + 6);
        doc.fontSize(9).font('Helvetica').fillColor(grayColor).text('La reparación incluye garantía por el período especificado contra defectos de fabricación.', 55, warrantyY + 25, { width: 485 });
        doc.moveDown(3);
      }

      // AUTORIZACIÓN Y TOTAL
      const authY = doc.y;
      
      // Firma del cliente
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('AUTORIZACIÓN DEL CLIENTE', 50, authY);
      doc.moveTo(50, authY + 25).lineTo(270, authY + 25).stroke();
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text(`${repair.cliente.nombre_completo} - Firma Digital/Manual`, 50, authY + 30);

      // Total estimado
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('TOTAL ESTIMADO', 300, authY, { align: 'right' });
      doc.fontSize(24).font('Helvetica-Bold').fillColor(primaryColor).text(`$${repair.total_reparacion?.toString() || '0.00'}`, 300, authY + 10, { align: 'right' });
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text('Excl. impuestos aplicables', 300, authY + 35, { align: 'right' });

      doc.moveDown(4);

      // Pie de página
      doc.fontSize(8).font('Helvetica').fillColor('#737686').text(
        `Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')} | Formulario SO-CLIENT-2024-V1`,
        { align: 'center' }
      );

      doc.end();
    });
  }

  async generateConfigPdf(config: GenerateConfigPdfDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Colores
      const primaryColor = '#003fb1';
      const textColor = '#191c1d';
      const grayColor = '#434654';
      const lightGray = '#f3f4f5';

      // HEADER
      doc.fontSize(20).font('Helvetica-Bold').fillColor(primaryColor).text(config.companyName || 'TECH SERVE PRO', { align: 'left' });
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text('CENTRO DE SERVICIO TÉCNICO AUTORIZADO', { align: 'left' });
      
      // Número de orden y fecha
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('ORDEN DE SERVICIO', { align: 'right' });
      doc.fontSize(20).font('Helvetica-Bold').fillColor(textColor).text(config.orderNumber || '#SO-2024-0001', { align: 'right' });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`Fecha: ${config.orderDate || new Date().toLocaleDateString('es-AR')}`, { align: 'right' });
      doc.moveDown();

      // INFORMACIÓN DEL CLIENTE Y DISPOSITIVO
      const boxY = doc.y;
      
      // Caja de información del cliente
      doc.rect(50, boxY, 245, 70).stroke();
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('INFORMACIÓN DEL CLIENTE', 55, boxY + 5);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(textColor).text(config.clientName || 'No especificado', 55, boxY + 20, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(config.clientEmail || '', 55, boxY + 40, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(config.clientPhone || '', 55, boxY + 55, { width: 235 });

      // Caja de información del dispositivo
      doc.rect(300, boxY, 245, 70).stroke();
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('INFORMACIÓN DEL DISPOSITIVO', 305, boxY + 5);
      doc.fontSize(14).font('Helvetica-Bold').fillColor(textColor).text(config.deviceModel || 'No especificado', 305, boxY + 20, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`N/S: ${config.deviceSerial || '—'}`, 305, boxY + 40, { width: 235 });
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(`IMEI: ${config.deviceImei || '—'}`, 305, boxY + 55, { width: 235 });

      doc.moveDown(4);

      // DESCRIPCIÓN DEL PROBLEMA
      const problemY = doc.y;
      doc.rect(50, problemY, 495, 60).stroke();
      doc.rect(50, problemY, 495, 20).fill(lightGray);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor).text('DESCRIPCIÓN DEL PROBLEMA', 55, problemY + 6);
      doc.fontSize(10).font('Helvetica').fillColor(grayColor).text(config.repairDescription || 'No especificado', 55, problemY + 25, { width: 485 });

      doc.moveDown(3);

      // GARANTÍA (si aplica)
      if (config.warrantyMonths) {
        const warrantyY = doc.y;
        doc.rect(50, warrantyY, 495, 50).stroke();
        doc.rect(50, warrantyY, 495, 20).fill(lightGray);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor).text(`GARANTÍA - ${config.warrantyMonths} MESES`, 55, warrantyY + 6);
        doc.fontSize(9).font('Helvetica').fillColor(grayColor).text(config.warrantyTerms || 'La reparación incluye garantía por el período especificado contra defectos de fabricación.', 55, warrantyY + 25, { width: 485 });
        doc.moveDown(3);
      }

      // AUTORIZACIÓN Y TOTAL
      const authY = doc.y;
      
      // Firma del cliente
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('AUTORIZACIÓN DEL CLIENTE', 50, authY);
      doc.moveTo(50, authY + 25).lineTo(270, authY + 25).stroke();
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text(`${config.clientName || 'Cliente'} - Firma Digital/Manual`, 50, authY + 30);

      // Total estimado
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#555f6d').text('TOTAL ESTIMADO', 300, authY, { align: 'right' });
      doc.fontSize(24).font('Helvetica-Bold').fillColor(primaryColor).text(`$${config.totalPrice || '0.00'}`, 300, authY + 10, { align: 'right' });
      doc.fontSize(9).font('Helvetica').fillColor(grayColor).text('Excl. impuestos aplicables', 300, authY + 35, { align: 'right' });

      doc.moveDown(4);

      // Pie de página
      doc.fontSize(8).font('Helvetica').fillColor('#737686').text(
        `Generado el ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')} | Formulario SO-CLIENT-2024-V1`,
        { align: 'center' }
      );

      doc.end();
    });
  }

  async findByOrderNumber(numeroReparacion: string) {
    const repair = await this.prisma.repair.findUnique({
      where: { numero_reparacion: numeroReparacion },
      include: {
        tecnico_asignado: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Endpoint público: solo exponer información no sensible (sin datos del cliente)
    return {
      numero_reparacion: repair.numero_reparacion,
      estado: repair.estado,
      dispositivo: repair.dispositivo,
      marca: repair.marca,
      modelo: repair.modelo,
      problema_reportado: repair.problema_reportado,
      diagnosis: repair.diagnosis,
      reparacion_realizada: repair.reparacion_realizada,
      fecha_ingreso: repair.fecha_ingreso,
      fecha_estimada_entrega: repair.fecha_estimada_entrega,
      fecha_entrega: repair.fecha_entrega,
      total_reparacion: repair.total_reparacion,
      garantia_meses: repair.garantia_meses,
      tecnico_asignado: repair.tecnico_asignado,
    };
  }
}
