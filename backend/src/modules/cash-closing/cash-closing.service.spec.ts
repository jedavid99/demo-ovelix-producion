import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CashClosingService } from './cash-closing.service';
import { PrismaService } from '../../database/prisma.service';

describe('CashClosingService', () => {
  let service: CashClosingService;
  let prisma: any;

  const currentUser = {
    id: 'user-1',
    rol: 'ADMIN',
    empresa_id: 'emp-1',
  };

  const mockClosing = {
    id: 'closing-1',
    date: new Date('2024-01-15T00:00:00.000Z'),
    store_id: 'emp-1',
    cashier: 'user-1',
    expected_balance: 1000,
    actual_balance: 1100,
    discrepancy: 100,
    transactions_count: 2,
    bills_count: {},
    notes: null,
    estado: 'abierto',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      cashClosing: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      sale: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashClosingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CashClosingService>(CashClosingService);
  });

  describe('findAll', () => {
    it('should return paginated closings filtered by store', async () => {
      prisma.cashClosing.findMany.mockResolvedValue([mockClosing]);
      prisma.cashClosing.count.mockResolvedValue(1);

      const result = await service.findAll(currentUser, 1, 10);

      expect(prisma.cashClosing.findMany).toHaveBeenCalledWith({
        where: { store_id: 'emp-1' },
        skip: 0,
        take: 10,
        orderBy: { date: 'desc' },
      });
      expect(result).toEqual({
        data: [mockClosing],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply estado and date filters', async () => {
      prisma.cashClosing.findMany.mockResolvedValue([]);
      prisma.cashClosing.count.mockResolvedValue(0);

      await service.findAll(currentUser, 2, 5, {
        estado: 'cerrado',
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
      });

      expect(prisma.cashClosing.findMany).toHaveBeenCalledWith({
        where: {
          store_id: 'emp-1',
          estado: 'cerrado',
          date: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        },
        skip: 5,
        take: 5,
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return closing when it exists', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(mockClosing);

      const result = await service.findOne('closing-1', currentUser);

      expect(prisma.cashClosing.findUnique).toHaveBeenCalledWith({
        where: { id: 'closing-1' },
      });
      expect(result).toEqual(mockClosing);
    });

    it('should throw NotFoundException when closing not found', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', currentUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for another store', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue({
        ...mockClosing,
        store_id: 'emp-other',
      });

      await expect(service.findOne('closing-1', currentUser)).rejects.toThrow(ForbiddenException);
    });

    it('should allow DESARROLLADOR to view any store', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue({
        ...mockClosing,
        store_id: 'emp-other',
      });

      const result = await service.findOne('closing-1', { ...currentUser, rol: 'DESARROLLADOR' });

      expect(result).toBeDefined();
    });
  });

  describe('create', () => {
    const createDto = {
      expected_balance: 1000,
      actual_balance: 1100,
      bills_count: { '10': 5 },
      notes: 'turno mañana',
    };

    const sales = [
      { id: 's1', total: 500, metodo_pago: 'efectivo' },
      { id: 's2', total: 300, metodo_pago: 'tarjeta' },
      { id: 's3', total: 200, metodo_pago: 'transferencia' },
    ];

    it('should compute totals by payment method and create closing', async () => {
      prisma.sale.findMany.mockResolvedValue(sales);
      prisma.cashClosing.create.mockResolvedValue(mockClosing);

      const result = await service.create(createDto, currentUser);

      expect(prisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          empresa_id: 'emp-1',
          fecha: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
          estado: 'completada',
        },
      });
      expect(prisma.cashClosing.create).toHaveBeenCalledWith({
        data: {
          date: expect.any(Date),
          store_id: 'emp-1',
          cashier: 'user-1',
          expected_balance: 1000,
          actual_balance: 1100,
          discrepancy: 100,
          transactions_count: 3,
          bills_count: { '10': 5 },
          notes: 'turno mañana',
          estado: 'abierto',
        },
      });
      expect(result).toEqual(mockClosing);
    });

    it('should handle sales without payment totals and default bills_count', async () => {
      prisma.sale.findMany.mockResolvedValue([]);
      prisma.cashClosing.create.mockResolvedValue(mockClosing);

      await service.create({ expected_balance: 0, actual_balance: 0 } as any, currentUser);

      expect(prisma.cashClosing.create).toHaveBeenCalledWith({
        data: {
          date: expect.any(Date),
          store_id: 'emp-1',
          cashier: 'user-1',
          expected_balance: 0,
          actual_balance: 0,
          discrepancy: 0,
          transactions_count: 0,
          bills_count: {},
          notes: undefined,
          estado: 'abierto',
        },
      });
    });
  });

  describe('update', () => {
    it('should update fields and recompute discrepancy', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(mockClosing);
      prisma.cashClosing.update.mockResolvedValue({ ...mockClosing, actual_balance: 1200 });

      const result = await service.update('closing-1', { actual_balance: 1200 }, currentUser);

      expect(prisma.cashClosing.update).toHaveBeenCalledWith({
        where: { id: 'closing-1' },
        data: {
          actual_balance: 1200,
          discrepancy: 200,
          updated_at: expect.any(Date),
        },
      });
      expect(result.actual_balance).toBe(1200);
    });

    it('should keep original discrepancy when balances unchanged', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(mockClosing);
      prisma.cashClosing.update.mockResolvedValue(mockClosing);

      await service.update('closing-1', { notes: 'actualizado' }, currentUser);

      expect(prisma.cashClosing.update).toHaveBeenCalledWith({
        where: { id: 'closing-1' },
        data: {
          notes: 'actualizado',
          discrepancy: 100,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when closing does not exist', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { notes: 'x' }, currentUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an open closing', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(mockClosing);
      prisma.cashClosing.delete.mockResolvedValue(mockClosing);

      const result = await service.delete('closing-1', currentUser);

      expect(prisma.cashClosing.delete).toHaveBeenCalledWith({
        where: { id: 'closing-1' },
      });
      expect(result).toEqual({ message: 'Cierre de caja eliminado exitosamente' });
    });

    it('should throw BadRequestException for closed closing', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue({ ...mockClosing, estado: 'cerrado' });

      await expect(service.delete('closing-1', currentUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getByDate', () => {
    it('should return first closing of the day for the store', async () => {
      prisma.cashClosing.findFirst.mockResolvedValue(mockClosing);

      const result = await service.getByDate('2024-01-15', currentUser);

      expect(prisma.cashClosing.findFirst).toHaveBeenCalledWith({
        where: {
          store_id: 'emp-1',
          date: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
        },
      });
      expect(result).toEqual(mockClosing);
    });
  });

  describe('close', () => {
    it('should close an open closing', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue(mockClosing);
      prisma.cashClosing.update.mockResolvedValue({ ...mockClosing, estado: 'cerrado' });

      const result = await service.close('closing-1', currentUser);

      expect(prisma.cashClosing.update).toHaveBeenCalledWith({
        where: { id: 'closing-1' },
        data: {
          estado: 'cerrado',
          updated_at: expect.any(Date),
        },
      });
      expect(result.estado).toBe('cerrado');
    });

    it('should throw BadRequestException when already closed', async () => {
      prisma.cashClosing.findUnique.mockResolvedValue({ ...mockClosing, estado: 'cerrado' });

      await expect(service.close('closing-1', currentUser)).rejects.toThrow(BadRequestException);
    });
  });
});
