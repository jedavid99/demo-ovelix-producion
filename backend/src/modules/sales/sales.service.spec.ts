import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { PrismaService } from '../../database/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

describe('SalesService', () => {
  let service: SalesService;
  let prisma: any;
  let tx: any;

  const currentUser = { id: 'user-1', empresa_id: 'emp-1', rol: 'OPERADOR' };

  const createSaleDto: CreateSaleDto = {
    cliente_id: 'cliente-1',
    items: [
      {
        producto_id: 'prod-1',
        producto_nombre: 'Pantalla iPhone',
        cantidad: 2,
        precio_unitario: 50,
        subtotal: 100,
      },
    ],
    total: 100,
    metodo_pago: 'efectivo',
    monto_recibido: 100,
    cambio: 0,
    numero_comprobante: 'VTA-20260802-0001',
  };

  const stockItem = {
    id: 'prod-1',
    nombre: 'Pantalla iPhone',
    stock_actual: 10,
    empresa_id: 'emp-1',
  };

  const saleResult = {
    id: 'sale-1',
    empresa_id: 'emp-1',
    vendedor_id: 'user-1',
    estado: 'completada',
    numero_comprobante: 'VTA-20260802-0001',
    items: createSaleDto.items,
    cliente: { id: 'cliente-1', empresa_id: 'emp-1' },
  };

  beforeEach(async () => {
    tx = {
      client: { findUnique: jest.fn() },
      stockItem: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
      stockMovement: {
        createMany: jest.fn(),
        create: jest.fn(),
      },
      sale: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
    };

    prisma = {
      $transaction: jest.fn((cb: any) => cb(tx)),
      sale: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      stockItem: {},
      stockMovement: {},
      client: {},
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  describe('create', () => {
    it('should throw NotFoundException when cliente does not exist', async () => {
      tx.client.findUnique.mockResolvedValue(null);
      tx.stockItem.findMany.mockResolvedValue([stockItem]);
      tx.stockItem.updateMany.mockResolvedValue({ count: 1 });
      tx.stockMovement.createMany.mockResolvedValue({ count: 1 });
      tx.sale.create.mockResolvedValue(saleResult);

      await expect(service.create(createSaleDto, currentUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(tx.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'cliente-1' },
      });
    });

    it('should throw ForbiddenException when cliente belongs to another company', async () => {
      tx.client.findUnique.mockResolvedValue({
        id: 'cliente-1',
        empresa_id: 'other-emp',
      });

      await expect(service.create(createSaleDto, currentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when a producto does not exist in stock', async () => {
      tx.client.findUnique.mockResolvedValue({
        id: 'cliente-1',
        empresa_id: 'emp-1',
      });
      tx.stockItem.findMany.mockResolvedValue([]);

      await expect(service.create(createSaleDto, currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when stock is insufficient', async () => {
      tx.client.findUnique.mockResolvedValue({
        id: 'cliente-1',
        empresa_id: 'emp-1',
      });
      tx.stockItem.findMany.mockResolvedValue([{ ...stockItem, stock_actual: 1 }]);

      await expect(service.create(createSaleDto, currentUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create sale and decrement stock atomically within a transaction', async () => {
      tx.client.findUnique.mockResolvedValue({
        id: 'cliente-1',
        empresa_id: 'emp-1',
      });
      tx.stockItem.findMany.mockResolvedValue([stockItem]);
      tx.stockItem.updateMany.mockResolvedValue({ count: 1 });
      tx.stockMovement.createMany.mockResolvedValue({ count: 1 });
      tx.sale.create.mockResolvedValue(saleResult);

      const result = await service.create(createSaleDto, currentUser);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(tx.stockItem.updateMany).toHaveBeenCalledWith({
        where: { id: 'prod-1', stock_actual: { gte: 2 } },
        data: {
          stock_actual: { decrement: 2 },
          fecha_actualizacion: expect.any(Date),
        },
      });
      expect(tx.stockMovement.createMany).toHaveBeenCalledWith({
        data: [
          {
            item_id: 'prod-1',
            item_nombre: 'Pantalla iPhone',
            cantidad: 2,
            tipo: 'salida',
            motivo: 'Venta directa',
            usuario_id: 'user-1',
          },
        ],
      });
      expect(tx.sale.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'emp-1',
            vendedor_id: 'user-1',
            numero_comprobante: 'VTA-20260802-0001',
            estado: 'completada',
          }),
        }),
      );
      expect(result).toEqual(saleResult);
    });

    it('should generate sale number when numero_comprobante is not provided', async () => {
      const generateSpy = jest
        .spyOn(service as any, 'generateSaleNumber')
        .mockResolvedValue('VTA-20260802-0007');
      const dto: CreateSaleDto = {
        ...createSaleDto,
        numero_comprobante: undefined,
      };

      tx.client.findUnique.mockResolvedValue({
        id: 'cliente-1',
        empresa_id: 'emp-1',
      });
      tx.stockItem.findMany.mockResolvedValue([stockItem]);
      tx.stockItem.updateMany.mockResolvedValue({ count: 1 });
      tx.stockMovement.createMany.mockResolvedValue({ count: 1 });
      tx.sale.create.mockResolvedValue({
        ...saleResult,
        numero_comprobante: 'VTA-20260802-0007',
      });

      await service.create(dto, currentUser);

      expect(generateSpy).toHaveBeenCalledWith('emp-1', tx);
      expect(tx.sale.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            numero_comprobante: 'VTA-20260802-0007',
          }),
        }),
      );
    });
  });

  describe('anular', () => {
    const sale = {
      id: 'sale-1',
      empresa_id: 'emp-1',
      estado: 'completada',
      items: [
        { producto_id: 'prod-1', producto_nombre: 'Pantalla iPhone', cantidad: 2 },
      ],
    };

    it('should throw NotFoundException when sale does not exist', async () => {
      tx.sale.findUnique.mockResolvedValue(null);

      await expect(service.anular('sale-1', currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when sale belongs to another company', async () => {
      tx.sale.findUnique.mockResolvedValue({ ...sale, empresa_id: 'other-emp' });

      await expect(service.anular('sale-1', currentUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException when sale is already anulada', async () => {
      tx.sale.findUnique.mockResolvedValue({ ...sale, estado: 'anulada' });

      await expect(service.anular('sale-1', currentUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should restore stock and mark sale as anulada', async () => {
      tx.sale.findUnique.mockResolvedValue(sale);
      tx.stockItem.update.mockResolvedValue({ id: 'prod-1', stock_actual: 12 });
      tx.stockMovement.createMany.mockResolvedValue({ count: 1 });
      tx.sale.update.mockResolvedValue({ ...sale, estado: 'anulada' });

      const result = await service.anular('sale-1', currentUser);

      expect(tx.stockItem.update).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: {
          stock_actual: { increment: 2 },
          fecha_actualizacion: expect.any(Date),
        },
      });
      expect(tx.stockMovement.createMany).toHaveBeenCalledWith({
        data: [
          {
            item_id: 'prod-1',
            item_nombre: 'Pantalla iPhone',
            cantidad: 2,
            tipo: 'entrada',
            motivo: 'Anulación de venta',
            referencia_id: 'sale-1',
            usuario_id: 'user-1',
          },
        ],
      });
      expect(tx.sale.update).toHaveBeenCalledWith({
        where: { id: 'sale-1' },
        data: { estado: 'anulada' },
      });
      expect(result.estado).toBe('anulada');
    });
  });

  describe('findAll', () => {
    it('should return paginated data with meta', async () => {
      const sales = [{ id: 'sale-1' }, { id: 'sale-2' }];
      prisma.sale.findMany.mockResolvedValue(sales);
      prisma.sale.count.mockResolvedValue(2);

      const result = await service.findAll(currentUser, 1, 10, {
        estado: 'completada',
      });

      expect(result).toEqual({
        data: sales,
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      });
      expect(prisma.sale.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            empresa_id: 'emp-1',
            estado: 'completada',
          }),
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.sale.count).toHaveBeenCalledWith({
        where: expect.objectContaining({ empresa_id: 'emp-1' }),
      });
    });
  });
});
