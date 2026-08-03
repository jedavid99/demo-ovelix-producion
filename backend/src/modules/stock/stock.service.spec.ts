import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { PrismaService } from '../../database/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';

describe('StockService', () => {
  let service: StockService;
  let prisma: any;
  let tx: any;

  const currentUser = { id: 'user-1', empresa_id: 'emp-1', rol: 'OPERADOR' };

  const item = {
    id: 'item-1',
    codigo: 'ABC-123',
    nombre: 'Pantalla iPhone',
    stock_actual: 10,
    stock_minimo: 5,
    stock_maximo: 20,
    estado: 'activo',
    empresa_id: 'emp-1',
    proveedor_id: 'sup-1',
  };

  const createDto = {
    codigo: 'ABC-123',
    nombre: 'Pantalla iPhone',
    costo_unitario: 30,
    precio_venta: 60,
    proveedor_id: 'sup-1',
  };

  const adjustDto: AdjustStockDto = {
    item_id: 'item-1',
    cantidad: 2,
    tipo: 'salida',
    motivo: 'Ajuste manual',
  };

  beforeEach(async () => {
    tx = {
      stockItem: { update: jest.fn() },
      stockMovement: { create: jest.fn() },
    };

    prisma = {
      $transaction: jest.fn((cb: any) => cb(tx)),
      $queryRaw: jest.fn(),
      stockItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      stockMovement: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      supplier: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StockService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  describe('findAll', () => {
    it('should return paginated items with meta', async () => {
      prisma.stockItem.findMany.mockResolvedValue([item]);
      prisma.stockItem.count.mockResolvedValue(1);

      const result = await service.findAll(currentUser, 1, 10, {
        categoria: 'Repuestos',
      });

      expect(result.data).toEqual([item]);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
      expect(prisma.stockItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            empresa_id: 'emp-1',
            categoria: 'Repuestos',
          }),
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.stockItem.count).toHaveBeenCalledWith({
        where: expect.objectContaining({ empresa_id: 'emp-1' }),
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when item does not exist', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(null);

      await expect(service.findOne('item-1', currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when item belongs to another company', async () => {
      prisma.stockItem.findUnique.mockResolvedValue({
        ...item,
        empresa_id: 'other-emp',
      });

      await expect(service.findOne('item-1', currentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should return the item', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);

      const result = await service.findOne('item-1', currentUser);

      expect(result).toEqual(item);
      expect(prisma.stockItem.findUnique).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        include: {
          proveedor: true,
          movements: { orderBy: { fecha: 'desc' }, take: 10 },
        },
      });
    });
  });

  describe('create', () => {
    it('should throw ConflictException when codigo already exists', async () => {
      prisma.stockItem.findFirst.mockResolvedValue(item);

      await expect(service.create(createDto, currentUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when proveedor does not exist', async () => {
      prisma.stockItem.findFirst.mockResolvedValue(null);
      prisma.supplier.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto, currentUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.supplier.findUnique).toHaveBeenCalledWith({
        where: { id: 'sup-1' },
      });
    });

    it('should create the item with the company id', async () => {
      prisma.stockItem.findFirst.mockResolvedValue(null);
      prisma.supplier.findUnique.mockResolvedValue({
        id: 'sup-1',
        nombre: 'Proveedor A',
      });
      const created = { ...item, proveedor: { id: 'sup-1', nombre: 'Proveedor A' } };
      prisma.stockItem.create.mockResolvedValue(created);

      const result = await service.create(createDto, currentUser);

      expect(prisma.stockItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            codigo: 'ABC-123',
            empresa_id: 'emp-1',
            fecha_ingreso: expect.any(Date),
          }),
          include: { proveedor: true },
        }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when item does not exist', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(null);

      await expect(
        service.update('item-1', { stock_actual: 5 }, currentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when item belongs to another company', async () => {
      prisma.stockItem.findUnique.mockResolvedValue({
        ...item,
        empresa_id: 'other-emp',
      });

      await expect(
        service.update('item-1', { stock_actual: 5 }, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException when changing codigo to an existing one', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      prisma.stockItem.findFirst.mockResolvedValue({ id: 'item-2' });

      await expect(
        service.update('item-1', { codigo: 'NEW-CODE' }, currentUser),
      ).rejects.toThrow(ConflictException);
      expect(prisma.stockItem.findFirst).toHaveBeenCalledWith({
        where: {
          codigo: 'NEW-CODE',
          empresa_id: 'emp-1',
          id: { not: 'item-1' },
        },
      });
    });

    it('should throw BadRequestException when stock_actual is negative', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);

      await expect(
        service.update('item-1', { stock_actual: -5 }, currentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update the item', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      const updated = { ...item, stock_actual: 15 };
      prisma.stockItem.update.mockResolvedValue(updated);

      const result = await service.update('item-1', { stock_actual: 15 }, currentUser);

      expect(prisma.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { stock_actual: 15, fecha_actualizacion: expect.any(Date) },
        include: { proveedor: true },
      });
      expect(result.stock_actual).toBe(15);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when item does not exist', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(null);

      await expect(service.delete('item-1', currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when item belongs to another company', async () => {
      prisma.stockItem.findUnique.mockResolvedValue({
        ...item,
        empresa_id: 'other-emp',
      });

      await expect(service.delete('item-1', currentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should delete the item', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      prisma.stockItem.delete.mockResolvedValue(item);

      const result = await service.delete('item-1', currentUser);

      expect(prisma.stockItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
      expect(result).toEqual({ message: 'Item eliminado exitosamente' });
    });
  });

  describe('adjust', () => {
    it('should throw NotFoundException when item does not exist', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(null);

      await expect(service.adjust(adjustDto, currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when item belongs to another company', async () => {
      prisma.stockItem.findUnique.mockResolvedValue({
        ...item,
        empresa_id: 'other-emp',
      });

      await expect(service.adjust(adjustDto, currentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when resulting stock is negative', async () => {
      prisma.stockItem.findUnique.mockResolvedValue({ ...item, stock_actual: 1 });

      const overQtyDto: AdjustStockDto = {
        ...adjustDto,
        tipo: 'salida',
        cantidad: 5,
      };
      await expect(service.adjust(overQtyDto, currentUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update stock and create a movement in a transaction', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      tx.stockItem.update.mockResolvedValue({ ...item, stock_actual: 8 });
      tx.stockMovement.create.mockResolvedValue({ id: 'mov-1' });

      const result = await service.adjust(adjustDto, currentUser);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(tx.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: {
          stock_actual: 8,
          fecha_actualizacion: expect.any(Date),
        },
      });
      expect(tx.stockMovement.create).toHaveBeenCalledWith({
        data: {
          item_id: 'item-1',
          item_nombre: 'Pantalla iPhone',
          cantidad: 2,
          tipo: 'salida',
          motivo: 'Ajuste manual',
          usuario_id: 'user-1',
        },
      });
      expect(result.stock_actual).toBe(8);
    });

    it('should add stock for entrada adjustments', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      tx.stockItem.update.mockResolvedValue({ ...item, stock_actual: 12 });
      tx.stockMovement.create.mockResolvedValue({ id: 'mov-2' });

      const entradaDto: AdjustStockDto = { ...adjustDto, tipo: 'entrada' };
      await service.adjust(entradaDto, currentUser);

      expect(tx.stockItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ stock_actual: 12 }),
        }),
      );
    });
  });

  describe('getLowStock', () => {
    it('should map proveedor from raw query rows', async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          id: 'item-1',
          nombre: 'Pantalla',
          stock_actual: 3,
          stock_minimo: 5,
          estado: 'activo',
          proveedor_id: 'sup-1',
          proveedor_nombre: 'Proveedor A',
        },
      ]);

      const result = await service.getLowStock(currentUser);

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'item-1',
        nombre: 'Pantalla',
        stock_actual: 3,
        stock_minimo: 5,
        estado: 'activo',
        proveedor: { id: 'sup-1', nombre: 'Proveedor A' },
      });
      expect(result[0].proveedor_id).toBeUndefined();
      expect(result[0].proveedor_nombre).toBeUndefined();
    });

    it('should set proveedor to null when there is no supplier', async () => {
      prisma.$queryRaw.mockResolvedValue([
        {
          id: 'item-2',
          nombre: 'Batería',
          stock_actual: 1,
          stock_minimo: 3,
          estado: 'activo',
          proveedor_id: null,
          proveedor_nombre: null,
        },
      ]);

      const result = await service.getLowStock(currentUser);

      expect(result[0].proveedor).toBeNull();
    });
  });

  describe('getMovements', () => {
    it('should return paginated movements with meta', async () => {
      const movements = [{ id: 'mov-1' }];
      prisma.stockMovement.findMany.mockResolvedValue(movements);
      prisma.stockMovement.count.mockResolvedValue(1);

      const result = await service.getMovements(currentUser, 1, 10, {
        tipo: 'entrada',
      });

      expect(result).toEqual({
        data: movements,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            item: { empresa_id: 'emp-1' },
            tipo: 'entrada',
          }),
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe('activate/deactivate', () => {
    it('should activate the item via update', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      prisma.stockItem.update.mockResolvedValue({ ...item, estado: 'activo' });

      const result = await service.activate('item-1', currentUser);

      expect(prisma.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { estado: 'activo', fecha_actualizacion: expect.any(Date) },
        include: { proveedor: true },
      });
      expect(result.estado).toBe('activo');
    });

    it('should deactivate the item via update', async () => {
      prisma.stockItem.findUnique.mockResolvedValue(item);
      prisma.stockItem.update.mockResolvedValue({ ...item, estado: 'inactivo' });

      const result = await service.deactivate('item-1', currentUser);

      expect(prisma.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { estado: 'inactivo', fecha_actualizacion: expect.any(Date) },
        include: { proveedor: true },
      });
      expect(result.estado).toBe('inactivo');
    });
  });
});
