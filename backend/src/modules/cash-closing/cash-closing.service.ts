import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCashClosingDto } from './dto/create-cash-closing.dto';
import { UpdateCashClosingDto } from './dto/update-cash-closing.dto';

@Injectable()
export class CashClosingService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {
      store_id: currentUser.empresa_id,
    };

    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.fecha_desde) {
      where.date = { gte: new Date(filters.fecha_desde) };
    }
    if (filters?.fecha_hasta) {
      where.date = { ...where.date, lte: new Date(filters.fecha_hasta) };
    }

    const [closings, total] = await Promise.all([
      this.prisma.cashClosing.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.cashClosing.count({ where }),
    ]);

    return {
      data: closings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const closing = await this.prisma.cashClosing.findUnique({
      where: { id },
    });

    if (!closing) {
      throw new NotFoundException('Cierre de caja no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && closing.store_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este cierre de caja');
    }

    return closing;
  }

  async create(data: CreateCashClosingDto, currentUser: any) {
    const validatedData = data;

    // Calcular ventas del día
    const targetDate = validatedData.date ? new Date(validatedData.date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sales = await this.prisma.sale.findMany({
      where: {
        empresa_id: currentUser.empresa_id,
        fecha: {
          gte: startOfDay,
          lte: endOfDay,
        },
        estado: 'completada',
      },
    });

    // Calcular totales por método de pago
    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalTransferencia = 0;

    sales.forEach((sale) => {
      if (sale.metodo_pago === 'efectivo') {
        totalEfectivo += Number(sale.total);
      } else if (sale.metodo_pago === 'tarjeta') {
        totalTarjeta += Number(sale.total);
      } else if (sale.metodo_pago === 'transferencia') {
        totalTransferencia += Number(sale.total);
      }
    });

    // Calcular discrepancia
    const discrepancy = validatedData.actual_balance - validatedData.expected_balance;

    const closing = await this.prisma.cashClosing.create({
      data: {
        date: startOfDay,
        store_id: currentUser.empresa_id,
        cashier: currentUser.id,
        expected_balance: validatedData.expected_balance,
        actual_balance: validatedData.actual_balance,
        discrepancy,
        transactions_count: sales.length,
        bills_count: validatedData.bills_count || {},
        notes: validatedData.notes,
        estado: 'abierto',
      },
    });

    return closing;
  }

  async update(id: string, data: UpdateCashClosingDto, currentUser: any) {
    const validatedData = data;

    const closing = await this.findOne(id, currentUser);

    // Recalcular discrepancia si se actualizan los balances
    let discrepancy = closing.discrepancy as any;
    if (validatedData.expected_balance !== undefined || validatedData.actual_balance !== undefined) {
      const expected = validatedData.expected_balance ?? Number(closing.expected_balance);
      const actual = validatedData.actual_balance ?? Number(closing.actual_balance);
      discrepancy = actual - expected;
    }

    const updatedClosing = await this.prisma.cashClosing.update({
      where: { id },
      data: {
        ...validatedData,
        discrepancy: discrepancy as any,
        updated_at: new Date(),
      } as any,
    });

    return updatedClosing;
  }

  async delete(id: string, currentUser: any) {
    const closing = await this.findOne(id, currentUser);

    // Solo se puede eliminar si está en estado abierto
    if (closing.estado === 'cerrado') {
      throw new BadRequestException('No se puede eliminar un cierre de caja cerrado');
    }

    await this.prisma.cashClosing.delete({
      where: { id },
    });

    return { message: 'Cierre de caja eliminado exitosamente' };
  }

  async getByDate(date: string, currentUser: any) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const closing = await this.prisma.cashClosing.findFirst({
      where: {
        store_id: currentUser.empresa_id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return closing;
  }

  async close(id: string, currentUser: any) {
    const closing = await this.findOne(id, currentUser);

    if (closing.estado === 'cerrado') {
      throw new BadRequestException('El cierre de caja ya está cerrado');
    }

    const updatedClosing = await this.prisma.cashClosing.update({
      where: { id },
      data: {
        estado: 'cerrado',
        updated_at: new Date(),
      },
    });

    return updatedClosing;
  }

  async getDailySummary(date: string, currentUser: any) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sales = await this.prisma.sale.findMany({
      where: {
        empresa_id: currentUser.empresa_id,
        fecha: { gte: startOfDay, lte: endOfDay },
        estado: 'completada',
      },
    });

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalTransferencia = 0;

    sales.forEach((sale) => {
      if (sale.metodo_pago === 'efectivo') {
        totalEfectivo += Number(sale.total);
      } else if (sale.metodo_pago === 'tarjeta') {
        totalTarjeta += Number(sale.total);
      } else if (sale.metodo_pago === 'transferencia') {
        totalTransferencia += Number(sale.total);
      }
    });

    return {
      date: startOfDay.toISOString().split('T')[0],
      total_efectivo: totalEfectivo,
      total_tarjeta: totalTarjeta,
      total_transferencia: totalTransferencia,
      total_ventas: totalEfectivo + totalTarjeta + totalTransferencia,
      transactions_count: sales.length,
    };
  }

  async checkClosingTime(currentUser: any) {
    const businessInfo = await this.prisma.businessInfo.findUnique({
      where: { empresa_id: currentUser.empresa_id },
      select: { hora_cierre_caja: true },
    });

    const horaCierre = businessInfo?.hora_cierre_caja || '18:00';
    const [h, m] = horaCierre.split(':').map(Number);
    const now = new Date();
    const closingMinutes = h * 60 + m;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const diffMinutes = closingMinutes - currentMinutes;

    return {
      hora_cierre: horaCierre,
      is_closing_time: diffMinutes <= 0 && diffMinutes > -60,
      is_past: diffMinutes <= -60,
      diff_minutes: diffMinutes,
    };
  }
}
