import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStockItemDto } from './dto/create-stock-item.dto';
import { UpdateStockItemDto } from './dto/update-stock-item.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class StockService {
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
    if (filters?.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' as const } },
        { codigo: { contains: filters.search, mode: 'insensitive' as const } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.stockItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          proveedor: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: { fecha_ingreso: 'desc' },
      }),
      this.prisma.stockItem.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const item = await this.prisma.stockItem.findUnique({
      where: { id },
      include: {
        proveedor: true,
        movements: {
          orderBy: { fecha: 'desc' },
          take: 10,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Validar permisos (multi-tenant)
    if (currentUser.rol !== 'DESARROLLADOR' && item.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este item');
    }

    return item;
  }

  async create(data: CreateStockItemDto, currentUser: any) {
    const validatedData = data;

    // Verificar que el código no exista en la empresa
    const existingItem = await this.prisma.stockItem.findFirst({
      where: {
        codigo: validatedData.codigo,
        empresa_id: currentUser.empresa_id,
      },
    });

    if (existingItem) {
      throw new ConflictException('Ya existe un item con este código en la empresa');
    }

    // Si se especifica proveedor, verificar que exista
    if (validatedData.proveedor_id) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: validatedData.proveedor_id },
      });

      if (!supplier) {
        throw new NotFoundException('Proveedor no encontrado');
      }
    }

    const item = await this.prisma.stockItem.create({
      data: {
        ...validatedData,
        empresa_id: currentUser.empresa_id,
        fecha_ingreso: new Date(),
      } as any,
      include: {
        proveedor: true,
      },
    });

    return item;
  }

  async update(id: string, data: UpdateStockItemDto, currentUser: any) {
    const validatedData = data;

    const item = await this.prisma.stockItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && item.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para editar este item');
    }

    // Si se cambia el código, verificar que no exista
    if (validatedData.codigo && validatedData.codigo !== item.codigo) {
      const existingItem = await this.prisma.stockItem.findFirst({
        where: {
          codigo: validatedData.codigo,
          empresa_id: item.empresa_id,
          id: { not: id },
        },
      });

      if (existingItem) {
        throw new ConflictException('Ya existe un item con este código en la empresa');
      }
    }

    // Validar que el stock no sea negativo
    if (validatedData.stock_actual !== undefined && validatedData.stock_actual < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    const updatedItem = await this.prisma.stockItem.update({
      where: { id },
      data: {
        ...validatedData,
        fecha_actualizacion: new Date(),
      },
      include: {
        proveedor: true,
      },
    });

    return updatedItem;
  }

  async delete(id: string, currentUser: any) {
    const item = await this.prisma.stockItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && item.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para eliminar este item');
    }

    await this.prisma.stockItem.delete({
      where: { id },
    });

    return { message: 'Item eliminado exitosamente' };
  }

  async adjust(data: AdjustStockDto, currentUser: any) {
    const validatedData = data;

    const item = await this.prisma.stockItem.findUnique({
      where: { id: validatedData.item_id },
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && item.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ajustar este item');
    }

    // Calcular nuevo stock
    let newStock = item.stock_actual;
    if (validatedData.tipo === 'entrada' || validatedData.tipo === 'ajuste') {
      newStock += validatedData.cantidad;
    } else if (validatedData.tipo === 'salida') {
      newStock -= validatedData.cantidad;
    }

    if (newStock < 0) {
      throw new BadRequestException('El stock resultante no puede ser negativo');
    }

    // Actualizar stock + registrar movimiento en una transacción
    return this.prisma.$transaction(async (tx) => {
      const updatedItem = await tx.stockItem.update({
        where: { id: validatedData.item_id },
        data: {
          stock_actual: newStock,
          fecha_actualizacion: new Date(),
        },
      });

      await tx.stockMovement.create({
        data: {
          item_id: validatedData.item_id,
          item_nombre: item.nombre,
          cantidad: validatedData.cantidad,
          tipo: validatedData.tipo,
          motivo: validatedData.motivo,
          usuario_id: currentUser.id,
        },
      });

      return updatedItem;
    });
  }

  async getLowStock(currentUser: any) {
    const rows = await this.prisma.$queryRaw<Array<any>>`
      SELECT si.*, s.id AS proveedor_id, s.nombre AS proveedor_nombre
      FROM "StockItem" si
      LEFT JOIN "Supplier" s ON s.id = si.proveedor_id
      WHERE si.empresa_id = ${currentUser.empresa_id}
        AND si.estado = 'activo'
        AND si.stock_actual <= si.stock_minimo
      ORDER BY si.stock_actual ASC
    `;

    return rows.map((row) => {
      const { proveedor_id, proveedor_nombre, ...rest } = row;
      return {
        ...rest,
        proveedor: proveedor_id
          ? { id: proveedor_id, nombre: proveedor_nombre }
          : null,
      };
    });
  }

  async getMovements(currentUser: any, page: number = 1, limit: number = 10, filters?: any) {
    const where: any = {
      item: {
        empresa_id: currentUser.empresa_id,
      },
    };

    if (filters?.tipo) {
      where.tipo = filters.tipo;
    }
    if (filters?.item_id) {
      where.item_id = filters.item_id;
    }
    if (filters?.fecha_desde) {
      where.fecha = { gte: new Date(filters.fecha_desde) };
    }
    if (filters?.fecha_hasta) {
      where.fecha = { ...where.fecha, lte: new Date(filters.fecha_hasta) };
    }

    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return {
      data: movements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async activate(id: string, currentUser: any) {
    return this.update(id, { estado: 'activo' }, currentUser);
  }

  async deactivate(id: string, currentUser: any) {
    return this.update(id, { estado: 'inactivo' }, currentUser);
  }

  async getCategories(currentUser: any) {
    const categories = await this.prisma.stockItem.findMany({
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
