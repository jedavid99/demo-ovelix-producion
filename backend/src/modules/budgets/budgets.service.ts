import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { EstadoReparacion } from '../repairs/enums/estado-reparacion.enum';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {};

    // Filtrar por rol
    if (currentUser.rol !== 'DESARROLLADOR') {
      where.reparacion = {
        empresa_id: currentUser.empresa_id,
      };
    }

    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.reparacion_id) {
      where.reparacion_id = filters.reparacion_id;
    }

    const [budgets, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reparacion: {
            include: {
              cliente: {
                select: {
                  id: true,
                  nombre_completo: true,
                  telefono: true,
                },
              },
            },
          },
        },
        orderBy: { fecha_envio: 'desc' },
      }),
      this.prisma.budget.count({ where }),
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
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: {
        reparacion: {
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
        },
      },
    });

    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && budget.reparacion.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este presupuesto');
    }

    return budget;
  }

  async create(data: CreateBudgetDto, currentUser: any) {
    const validatedData = data;

    // Verificar que la reparación existe
    const repair = await this.prisma.repair.findUnique({
      where: { id: validatedData.reparacion_id },
    });

    if (!repair) {
      throw new NotFoundException('Reparación no encontrada');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && repair.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para crear presupuestos para esta reparación');
    }

    // Verificar que no exista un presupuesto pendiente para esta reparación
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        reparacion_id: validatedData.reparacion_id,
        estado: 'PENDING',
      },
    });

    if (existingBudget) {
      throw new BadRequestException('Ya existe un presupuesto pendiente para esta reparación');
    }

    // Generar número de presupuesto
    const numero = await this.generateBudgetNumber(currentUser.empresa_id);

    const budget = await this.prisma.budget.create({
      data: {
        ...validatedData,
        numero,
        estado: 'PENDING',
      } as any,
      include: {
        reparacion: true,
      },
    });

    return budget;
  }

  async update(id: string, data: UpdateBudgetDto, currentUser: any) {
    const validatedData = data;

    const budget = await this.findOne(id, currentUser);

    // Solo se puede editar si está en estado PENDING
    if (budget.estado !== 'PENDING') {
      throw new BadRequestException('Solo se pueden editar presupuestos en estado PENDIENTE');
    }

    const updatedBudget = await this.prisma.budget.update({
      where: { id },
      data: validatedData,
      include: {
        reparacion: true,
      },
    });

    return updatedBudget;
  }

  async approve(id: string, currentUser: any) {
    const budget = await this.findOne(id, currentUser);

    if (budget.estado !== 'PENDING') {
      throw new BadRequestException('Solo se pueden aprobar presupuestos en estado PENDIENTE');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedBudget = await tx.budget.update({
        where: { id },
        data: {
          estado: 'APPROVED',
          fecha_respuesta: new Date(),
        },
      });

      // Actualizar estado de la reparación a EN_REPARACION si estaba en EN_DIAGNOSTICO
      if (budget.reparacion.estado === EstadoReparacion.EN_DIAGNOSTICO) {
        await tx.repair.update({
          where: { id: budget.reparacion_id },
          data: { estado: EstadoReparacion.EN_REPARACION },
        });
      }

      return updatedBudget;
    });
  }

  async reject(id: string, currentUser: any, notas?: string) {
    const budget = await this.findOne(id, currentUser);

    if (budget.estado !== 'PENDING') {
      throw new BadRequestException('Solo se pueden rechazar presupuestos en estado PENDIENTE');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedBudget = await tx.budget.update({
        where: { id },
        data: {
          estado: 'REJECTED',
          fecha_respuesta: new Date(),
          notas: notas || budget.notas,
        },
      });

      // Actualizar estado de la reparación a PRESUPUESTO_RECHAZADO
      await tx.repair.update({
        where: { id: budget.reparacion_id },
        data: { estado: EstadoReparacion.PRESUPUESTO_RECHAZADO },
      });

      return updatedBudget;
    });
  }

  async delete(id: string, currentUser: any) {
    const budget = await this.findOne(id, currentUser);

    // Solo se puede eliminar si está en estado PENDING
    if (budget.estado !== 'PENDING') {
      throw new BadRequestException('Solo se pueden eliminar presupuestos en estado PENDIENTE');
    }

    await this.prisma.budget.delete({
      where: { id },
    });

    return { message: 'Presupuesto eliminado exitosamente' };
  }

  async getByRepair(reparacionId: string, currentUser: any) {
    return this.findAll(currentUser, 1, 100, { reparacion_id: reparacionId });
  }

  private async generateBudgetNumber(empresaId: string): Promise<string> {
    const today = new Date();
    const prefix = `PRES-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    const lastBudget = await this.prisma.budget.findFirst({
      where: {
        numero: { startsWith: prefix },
        reparacion: {
          empresa_id: empresaId,
        },
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
}
