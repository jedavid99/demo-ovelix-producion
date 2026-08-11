import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {
      empresa_id: currentUser.empresa_id,
    };

    if (filters?.categoria) {
      where.categoria = filters.categoria;
    }
    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.metodo_pago) {
      where.metodo_pago = filters.metodo_pago;
    }
    if (filters?.search) {
      where.OR = [
        { descripcion: { contains: filters.search, mode: 'insensitive' as const } },
        { proveedor: { contains: filters.search, mode: 'insensitive' as const } },
      ];
    }
    if (filters?.fecha_desde) {
      where.fecha = { gte: new Date(filters.fecha_desde) };
    }
    if (filters?.fecha_hasta) {
      where.fecha = { ...where.fecha, lte: new Date(filters.fecha_hasta) };
    }

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
            },
          },
        },
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      data: expenses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Validar permisos (multi-tenant)
    if (currentUser.rol !== 'DESARROLLADOR' && expense.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este gasto');
    }

    return expense;
  }

  async create(data: CreateExpenseDto, currentUser: any) {
    const { fecha, ...rest } = data;

    const expense = await this.prisma.expense.create({
      data: {
        ...rest,
        empresa_id: currentUser.empresa_id,
        usuario_id: currentUser.id,
        fecha: fecha ? new Date(fecha) : new Date(),
      } as any,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    return expense;
  }

  async update(id: string, data: UpdateExpenseDto, currentUser: any) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && expense.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para editar este gasto');
    }

    const { fecha, ...rest } = data;

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...rest,
        fecha: fecha ? new Date(fecha) : undefined,
      } as any,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });
  }

  async delete(id: string, currentUser: any) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && expense.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para eliminar este gasto');
    }

    await this.prisma.expense.delete({
      where: { id },
    });

    return { message: 'Gasto eliminado exitosamente' };
  }

  async summary(currentUser: any) {
    const where: any = {
      empresa_id: currentUser.empresa_id,
      estado: { not: 'anulada' },
    };

    const [expenses, totalMonth, pendingCount, totalAnulado] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        select: {
          categoria: true,
          monto: true,
          estado: true,
          fecha: true,
        },
      }),
      this.prisma.expense.aggregate({
        where: {
          ...where,
          fecha: { gte: new Date(new Date().setDate(1)) },
        },
        _sum: { monto: true },
      }),
      this.prisma.expense.count({
        where: {
          ...where,
          estado: 'pendiente',
        },
      }),
      this.prisma.expense.count({
        where: {
          empresa_id: currentUser.empresa_id,
          estado: 'anulada',
        },
      }),
    ]);

    const categoryTotals: Record<string, number> = {};
    let totalSpent = 0;
    for (const e of expenses) {
      const monto = Number(e.monto) || 0;
      categoryTotals[e.categoria] = (categoryTotals[e.categoria] || 0) + monto;
      totalSpent += monto;
    }

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      totalMonth: Number(totalMonth._sum.monto) || 0,
      pendingCount,
      totalAnulado,
      totalSpent,
      categoryTotals,
      topCategory: topCategory ? { categoria: topCategory[0], monto: topCategory[1] } : null,
    };
  }

  async getCategories(currentUser: any) {
    const categories = await this.prisma.expense.findMany({
      where: {
        empresa_id: currentUser.empresa_id,
        categoria: { not: null },
      },
      select: {
        categoria: true,
      },
      distinct: ['categoria'],
    });

    return categories.map((c) => c.categoria).filter(Boolean);
  }
}
