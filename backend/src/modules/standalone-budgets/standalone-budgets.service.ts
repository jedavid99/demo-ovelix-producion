import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateStandaloneBudgetDto } from './dto/create-standalone-budget.dto';
import { UpdateStandaloneBudgetDto } from './dto/update-standalone-budget.dto';

const DEFAULT_VIGENCIA_DIAS = 7;

@Injectable()
export class StandaloneBudgetsService {
  constructor(private prisma: PrismaService) {}

  /** Marca como EXPIRED los presupuestos PENDING cuya vigencia ya venció. */
  private async expireOverdue(empresaId?: string): Promise<void> {
    const where: Prisma.StandaloneBudgetWhereInput = {
      estado: 'PENDING',
      fecha_vencimiento: { lte: new Date() },
      ...(empresaId ? { empresa_id: empresaId } : {}),
    };
    await this.prisma.standaloneBudget.updateMany({ where, data: { estado: 'EXPIRED' } });
  }

  private isOverdue(budget: any): boolean {
    return Boolean(budget.fecha_vencimiento && budget.fecha_vencimiento <= new Date());
  }

  /** Calcula base y total respetando el porcentaje por ítem y el modo "sin suma" (opciones). */
  private computeTotals(
    items: Array<{ price?: number; aplica_porcentaje?: boolean }> | undefined,
    taxRatePorct: number,
    sumaTotal: boolean,
  ): { base_total: number; total: number } {
    const list = items ?? [];
    const baseTotal = list.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
    if (!sumaTotal) {
      return { base_total: baseTotal, total: 0 };
    }
    const pct = Number(taxRatePorct) || 0;
    const total = list.reduce(
      (sum, it) => {
        const price = Number(it.price) || 0;
        return sum + price * (it.aplica_porcentaje && pct > 0 ? 1 + pct / 100 : 1);
      },
      0,
    );
    return { base_total: baseTotal, total };
  }

  private assertEditable(budget: any): void {
    if (budget.estado !== 'PENDING') {
      throw new BadRequestException(
        budget.estado === 'EXPIRED'
          ? 'Este presupuesto venció. Ya no se puede modificar ni aprobar, creá uno nuevo.'
          : 'Solo se pueden modificar presupuestos en estado PENDIENTE',
      );
    }
    if (this.isOverdue(budget)) {
      throw new BadRequestException('Este presupuesto venció. Ya no se puede modificar ni aprobar, creá uno nuevo.');
    }
  }

  async findAll(
    currentUser: any,
    page: number = 1,
    limit: number = 10,
    filters?: { estado?: string; search?: string },
  ) {
    const scope = currentUser.rol !== 'DESARROLLADOR' ? currentUser.empresa_id : undefined;
    await this.expireOverdue(scope);

    const where: any = {};

    if (scope) {
      where.empresa_id = scope;
    }

    if (filters?.estado) {
      where.estado = filters.estado;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      if (q) {
        where.OR = [
          { cliente_nombre: { contains: q, mode: 'insensitive' } },
          { dispositivo: { contains: q, mode: 'insensitive' } },
          { numero: { contains: q, mode: 'insensitive' } },
        ];
      }
    }

    const [budgets, total] = await Promise.all([
      this.prisma.standaloneBudget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha_envio: 'desc' },
        include: { repair: { select: { id: true, numero_reparacion: true, estado: true } } },
      }),
      this.prisma.standaloneBudget.count({ where }),
    ]);

    return {
      data: budgets,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    await this.expireOverdue(currentUser.rol !== 'DESARROLLADOR' ? currentUser.empresa_id : undefined);

    const budget = await this.prisma.standaloneBudget.findUnique({
      where: { id },
      include: { repair: { select: { id: true, numero_reparacion: true, estado: true } } },
    });

    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }

    if (currentUser.rol !== 'DESARROLLADOR' && budget.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este presupuesto');
    }

    return budget;
  }

  async create(data: CreateStandaloneBudgetDto, currentUser: any) {
    if (!currentUser.empresa_id) {
      throw new BadRequestException(
        'Tu usuario no pertenece a ninguna empresa. Iniciá sesión con un usuario de tu empresa para crear presupuestos.',
      );
    }

    const numero = await this.generateBudgetNumber(currentUser.empresa_id);
    const vigenciaDias = data.vigencia_dias ?? DEFAULT_VIGENCIA_DIAS;
    const fechaVencimiento = this.calculateExpiration(vigenciaDias);
    const itemsList = data.items ?? [];
    const sumaTotal = data.suma_total !== false;
    const totals = this.computeTotals(itemsList, data.tax_rate_porct ?? 0, sumaTotal);

    const budget = await this.prisma.standaloneBudget.create({
      data: {
        ...data,
        base_total: totals.base_total,
        total: totals.total,
        suma_total: sumaTotal,
        numero,
        empresa_id: currentUser.empresa_id,
        estado: 'PENDING',
        vigencia_dias: vigenciaDias,
        fecha_vencimiento: fechaVencimiento,
        tecnico: data.tecnico ?? '',
        items: itemsList,
      } as any,
    });

    return budget;
  }

  async update(id: string, data: UpdateStandaloneBudgetDto, currentUser: any) {
    const budget = await this.findOne(id, currentUser);
    this.assertEditable(budget);

    const updateData: any = { ...data };

    if (data.vigencia_dias !== undefined && data.vigencia_dias !== budget.vigencia_dias) {
      updateData.fecha_vencimiento = this.calculateExpiration(data.vigencia_dias);
    }

    if (data.items !== undefined || data.tax_rate_porct !== undefined || data.suma_total !== undefined) {
      const itemsList: Array<{ price?: number; aplica_porcentaje?: boolean }> =
        data.items !== undefined ? data.items : Array.isArray(budget.items) ? (budget.items as any) : [];
      const pct = data.tax_rate_porct !== undefined ? data.tax_rate_porct : Number(budget.tax_rate_porct) || 0;
      const sumaTotal = data.suma_total !== undefined ? data.suma_total : (budget.suma_total ?? true);
      const totals = this.computeTotals(itemsList, pct, sumaTotal);
      updateData.base_total = totals.base_total;
      updateData.total = totals.total;
    }

    return this.prisma.standaloneBudget.update({
      where: { id },
      data: updateData,
    });
  }

  /** Aprueba el presupuesto y crea automáticamente la reparación asociada con el total fijado. */
  async approve(id: string, currentUser: any) {
    const budget = await this.findOne(id, currentUser);
    this.assertEditable(budget);

    if (budget.suma_total === false) {
      throw new BadRequestException(
        'Este presupuesto es una cotización con varias opciones. Elegí la opción que se realizará y sumá el total antes de aprobar.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Buscar o crear el cliente por teléfono dentro de la misma empresa
      let client = await tx.client.findFirst({
        where: { telefono: budget.cliente_telefono, empresa_id: budget.empresa_id },
      });

      if (!client) {
        client = await tx.client.create({
          data: {
            nombre_completo: budget.cliente_nombre,
            telefono: budget.cliente_telefono,
            dni: budget.cliente_dni || null,
            empresa_id: budget.empresa_id,
          },
        });
      } else if (budget.cliente_dni && !client.dni) {
        client = await tx.client.update({
          where: { id: client.id },
          data: { dni: budget.cliente_dni },
        });
      }

      const numeroReparacion = await this.generateRepairNumber(tx, budget.empresa_id);

      const itemsList = (Array.isArray(budget.items) ? budget.items : []) as {
        device?: string;
        price?: number;
      }[];

      const itemsText = itemsList
        .map((it, i) => `${i + 1}. ${it.device || 'Servicio'} — $${it.price ?? 0}`)
        .join('\n');

      const repair = await tx.repair.create({
        data: {
          cliente_id: client.id,
          empresa_id: budget.empresa_id,
          numero_reparacion: numeroReparacion,
          categoria_dispositivo: budget.categoria || null,
          dispositivo: budget.dispositivo,
          problema_reportado: budget.problema || `Presupuesto aprobado ${budget.numero}: ${budget.dispositivo}`,
          estado: 'INGRESADO',
          prioridad: 'medium',
          fecha_ingreso: new Date(),
          hora_ingreso: new Date().toTimeString().slice(0, 5),
          costo_estimado: budget.base_total ?? null,
          total_reparacion: budget.total,
          notas: itemsText ? `Presupuesto ${budget.numero} aprobado.\nItems:\n${itemsText}` : `Presupuesto ${budget.numero} aprobado.`,
        } as any,
      });

      const approved = await tx.standaloneBudget.update({
        where: { id },
        data: {
          estado: 'APPROVED',
          fecha_respuesta: new Date(),
          repair_id: repair.id,
        },
        include: { repair: { select: { id: true, numero_reparacion: true, estado: true } } },
      });

      return approved;
    });
  }

  async reject(id: string, currentUser: any, notas?: string) {
    const budget = await this.findOne(id, currentUser);
    this.assertEditable(budget);

    return this.prisma.standaloneBudget.update({
      where: { id },
      data: { estado: 'REJECTED', fecha_respuesta: new Date(), notas: notas ?? budget.notas },
    });
  }

  async delete(id: string, currentUser: any) {
    const budget = await this.findOne(id, currentUser);
    this.assertEditable(budget);

    await this.prisma.standaloneBudget.delete({
      where: { id },
    });

    return { message: 'Presupuesto eliminado exitosamente' };
  }

  private calculateExpiration(vigenciaDias: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + vigenciaDias);
    return date;
  }

  private async generateBudgetNumber(empresaId: string): Promise<string> {
    const today = new Date();
    const prefix = `PRES-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

    const lastBudget = await this.prisma.standaloneBudget.findFirst({
      where: {
        numero: { startsWith: prefix },
        empresa_id: empresaId,
      },
      orderBy: { numero: 'desc' },
    });

    let sequence = 1;
    if (lastBudget) {
      const lastSequence = parseInt(lastBudget.numero.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }

  private async generateRepairNumber(
    tx: Prisma.TransactionClient,
    empresaId: string,
  ): Promise<string> {
    const today = new Date();
    const prefix = `REP-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

    const lastRepair = await tx.repair.findFirst({
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
}