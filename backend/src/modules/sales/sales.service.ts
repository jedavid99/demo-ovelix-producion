import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {
      empresa_id: currentUser.empresa_id,
    };

    if (filters?.cliente_id) {
      where.cliente_id = filters.cliente_id;
    }
    if (filters?.vendedor_id) {
      where.vendedor_id = filters.vendedor_id;
    }
    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.fecha_desde) {
      where.fecha = { gte: new Date(filters.fecha_desde) };
    }
    if (filters?.fecha_hasta) {
      where.fecha = { ...where.fecha, lte: new Date(filters.fecha_hasta) };
    }
    if (filters?.metodo_pago) {
      where.metodo_pago = filters.metodo_pago;
    }

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          cliente: {
            select: {
              id: true,
              nombre_completo: true,
              telefono: true,
            },
          },
          vendedor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
            },
          },
          items: true,
        },
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.sale.count({ where }),
    ]);

    return {
      data: sales,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        cliente: true,
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        items: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && sale.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver esta venta');
    }

    return sale;
  }

  async create(data: CreateSaleDto, currentUser: any) {
    const validatedData = data;

    return await this.prisma.$transaction(async (tx) => {
      // Verificar cliente si se especifica
      if (validatedData.cliente_id) {
        const client = await tx.client.findUnique({
          where: { id: validatedData.cliente_id },
        });

        if (!client) {
          throw new NotFoundException('Cliente no encontrado');
        }

        if (currentUser.rol !== 'DESARROLLADOR' && client.empresa_id !== currentUser.empresa_id) {
          throw new ForbiddenException('El cliente no pertenece a tu empresa');
        }
      }

      // Verificar stock para cada item y descontar
      const itemIds = validatedData.items.map((item) => item.producto_id);
      const stockItems = await tx.stockItem.findMany({
        where: { id: { in: itemIds } },
      });
      const stockByItem = new Map(stockItems.map((s) => [s.id, s]));

      for (const item of validatedData.items) {
        const stockItem = stockByItem.get(item.producto_id);

        if (!stockItem) {
          throw new NotFoundException(`Producto ${item.producto_nombre} no encontrado`);
        }

        if (currentUser.rol !== 'DESARROLLADOR' && stockItem.empresa_id !== currentUser.empresa_id) {
          throw new ForbiddenException(`El producto ${item.producto_nombre} no pertenece a tu empresa`);
        }

        if (stockItem.stock_actual < item.cantidad) {
          throw new BadRequestException(`Stock insuficiente para ${item.producto_nombre}`);
        }
      }

      // Descontar stock de forma atómica (falla si el stock cambió entre medio)
      await Promise.all(
        validatedData.items.map(async (item) => {
          const result = await tx.stockItem.updateMany({
            where: { id: item.producto_id, stock_actual: { gte: item.cantidad } },
            data: {
              stock_actual: { decrement: item.cantidad },
              fecha_actualizacion: new Date(),
            },
          });

          if (result.count === 0) {
            throw new BadRequestException(`Stock insuficiente para ${item.producto_nombre}`);
          }
        }),
      );

      // Registrar movimientos de stock en un solo insert
      if (validatedData.items.length > 0) {
        await tx.stockMovement.createMany({
          data: validatedData.items.map((item) => {
            const stockItem = stockByItem.get(item.producto_id);
            return {
              item_id: item.producto_id,
              item_nombre: stockItem!.nombre,
              cantidad: item.cantidad,
              tipo: 'salida',
              motivo: 'Venta directa',
              usuario_id: currentUser.id,
            };
          }),
        });
      }

      // Generar número de comprobante si no se proporciona
      const numeroComprobante = validatedData.numero_comprobante || await this.generateSaleNumber(currentUser.empresa_id, tx);

      // Crear venta
      const sale = await tx.sale.create({
        data: {
          ...validatedData,
          empresa_id: currentUser.empresa_id,
          vendedor_id: currentUser.id,
          numero_comprobante: numeroComprobante,
          estado: 'completada',
        } as any,
        include: {
          cliente: true,
          items: true,
        },
      });

      return sale;
    });
  }

  async update(id: string, data: UpdateSaleDto, currentUser: any) {
    const validatedData = data;

    const sale = await this.findOne(id, currentUser);

    // Solo se puede editar si está en estado completada
    if (sale.estado !== 'completada') {
      throw new BadRequestException('Solo se pueden editar ventas en estado completada');
    }

    const updatedSale = await this.prisma.sale.update({
      where: { id },
      data: validatedData,
      include: {
        cliente: true,
        items: true,
      },
    });

    return updatedSale;
  }

  async anular(id: string, currentUser: any) {
    return await this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!sale) {
        throw new NotFoundException('Venta no encontrada');
      }

      // Validar permisos (empresa) dentro de la transacción
      if (currentUser.rol !== 'DESARROLLADOR' && sale.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('La venta no pertenece a tu empresa');
      }

      if (sale.estado === 'anulada') {
        throw new BadRequestException('La venta ya está anulada');
      }

      // Devolver stock de los items (en paralelo)
      await Promise.all(
        sale.items.map((item) =>
          tx.stockItem.update({
            where: { id: item.producto_id },
            data: {
              stock_actual: { increment: item.cantidad },
              fecha_actualizacion: new Date(),
            },
          }),
        ),
      );

      // Registrar movimientos de stock en un solo insert
      if (sale.items.length > 0) {
        await tx.stockMovement.createMany({
          data: sale.items.map((item) => ({
            item_id: item.producto_id,
            item_nombre: item.producto_nombre,
            cantidad: item.cantidad,
            tipo: 'entrada',
            motivo: 'Anulación de venta',
            referencia_id: id,
            usuario_id: currentUser.id,
          })),
        });
      }

      // Actualizar estado de la venta
      const updatedSale = await tx.sale.update({
        where: { id },
        data: { estado: 'anulada' },
      });

      return updatedSale;
    });
  }

  async getByDate(date: string, currentUser: any, page?: number, limit?: number) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const where = {
      empresa_id: currentUser.empresa_id,
      fecha: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    const include = {
      cliente: true,
      items: true,
    } as const;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.prisma.sale.findMany({
          where,
          include,
          orderBy: { fecha: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.sale.count({ where }),
      ]);
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include,
      orderBy: { fecha: 'desc' },
    });

    return sales;
  }

  private async generateSaleNumber(empresaId: string, prismaClient: Prisma.TransactionClient = this.prisma as any): Promise<string> {
    const today = new Date();
    const prefix = `VTA-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    
    const lastSale = await prismaClient.sale.findFirst({
      where: {
        numero_comprobante: { startsWith: prefix },
        empresa_id: empresaId,
      },
      orderBy: { numero_comprobante: 'desc' },
    });

    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.numero_comprobante.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }
}
