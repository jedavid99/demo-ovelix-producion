import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { StandaloneBudgetsService } from './standalone-budgets.service';
import { PrismaService } from '../../database/prisma.service';

describe('StandaloneBudgetsService', () => {
  let service: StandaloneBudgetsService;
  let prisma: any;

  const devUser = { id: 'dev-1', rol: 'DESARROLLADOR', empresa_id: null };
  const userEmp1 = { id: 'user-1', rol: 'ADMIN', empresa_id: 'emp-1' };
  const userEmp2 = { id: 'user-2', rol: 'ADMIN', empresa_id: 'emp-2' };

  const future = new Date(Date.now() + 7 * 86400000);
  const past = new Date(Date.now() - 86400000);

  const budget = {
    id: 'budget-1',
    numero: 'PRES-20260101-0001',
    empresa_id: 'emp-1',
    cliente_nombre: 'Juan Pérez',
    cliente_dni: null,
    cliente_telefono: '1123456789',
    dispositivo: 'iPhone 12',
    categoria: null,
    problema: 'Pantalla rota',
    base_total: 80,
    total: 100,
    estado: 'PENDING',
    vigencia_dias: 7,
    fecha_vencimiento: future,
    fecha_envio: new Date(),
    fecha_respuesta: null,
    notas: null,
    items: [{ device: 'Pantalla', price: 100 }],
  };

  const repair = {
    id: 'repair-1',
    numero_reparacion: 'REP-20260101-0001',
    estado: 'INGRESADO',
  };

  beforeEach(async () => {
    prisma = {
      standaloneBudget: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      client: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      repair: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn((cb: (tx: any) => Promise<any>) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandaloneBudgetsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<StandaloneBudgetsService>(StandaloneBudgetsService);
  });

  describe('findAll', () => {
    it('should return paginated budgets with meta filtering by company for non-dev users', async () => {
      prisma.standaloneBudget.findMany.mockResolvedValue([budget]);
      prisma.standaloneBudget.count.mockResolvedValue(1);

      const result = await service.findAll(userEmp1, 1, 10);

      expect(prisma.standaloneBudget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1' },
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.standaloneBudget.count).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
      });
      expect(result).toEqual({
        data: [budget],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply estado and search filters', async () => {
      prisma.standaloneBudget.findMany.mockResolvedValue([]);
      prisma.standaloneBudget.count.mockResolvedValue(0);

      const result = await service.findAll(devUser, 1, 10, {
        estado: 'PENDING',
        search: 'iPhone',
      });

      expect(prisma.standaloneBudget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estado: 'PENDING',
            OR: expect.any(Array),
          }),
        }),
      );
      expect(result.meta).toEqual({ total: 0, page: 1, limit: 10, totalPages: 0 });
    });

    it('should not filter by company for DEV users', async () => {
      prisma.standaloneBudget.findMany.mockResolvedValue([]);
      prisma.standaloneBudget.count.mockResolvedValue(0);

      await service.findAll(devUser);

      expect(prisma.standaloneBudget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should expire overdue PENDING budgets scoped to the company', async () => {
      prisma.standaloneBudget.findMany.mockResolvedValue([]);
      prisma.standaloneBudget.count.mockResolvedValue(0);

      await service.findAll(userEmp1);

      expect(prisma.standaloneBudget.updateMany).toHaveBeenCalledWith({
        where: {
          estado: 'PENDING',
          fecha_vencimiento: { lte: expect.any(Date) },
          empresa_id: 'emp-1',
        },
        data: { estado: 'EXPIRED' },
      });
    });

    it('should expire overdue budgets across all companies for DEV users', async () => {
      prisma.standaloneBudget.findMany.mockResolvedValue([]);
      prisma.standaloneBudget.count.mockResolvedValue(0);

      await service.findAll(devUser);

      expect(prisma.standaloneBudget.updateMany).toHaveBeenCalledWith({
        where: {
          estado: 'PENDING',
          fecha_vencimiento: { lte: expect.any(Date) },
        },
        data: { estado: 'EXPIRED' },
      });
    });
  });

  describe('findOne', () => {
    it('should return the budget for the owner company', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);

      const result = await service.findOne('budget-1', userEmp1);

      expect(result).toEqual(budget);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(null);

      await expect(service.findOne('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when budget belongs to another company (non-dev)', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);

      await expect(service.findOne('budget-1', userEmp2)).rejects.toThrow(ForbiddenException);
    });

    it('should allow DEV users to view budgets of any company', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);

      const result = await service.findOne('budget-1', devUser);

      expect(result).toEqual(budget);
    });
  });

  describe('create', () => {
    const createDto = {
      cliente_nombre: 'Juan Pérez',
      cliente_telefono: '1123456789',
      dispositivo: 'iPhone 12',
      tecnico: 'Carlos López',
      base_total: 80,
      total: 100,
      items: [{ device: 'Pantalla', price: 100 }],
    };

    it('should create a pending budget with generated number and default vigencia', async () => {
      prisma.standaloneBudget.findFirst.mockResolvedValue(null);
      prisma.standaloneBudget.create.mockResolvedValue({ ...budget, numero: 'PRES-20260101-0001' });

      const result = await service.create(createDto as any, userEmp1);

      expect(prisma.standaloneBudget.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'emp-1',
            estado: 'PENDING',
            numero: expect.stringMatching(/^PRES-\d{8}-0001$/),
            vigencia_dias: 7,
            fecha_vencimiento: expect.any(Date),
          }),
        }),
      );
      expect(result.estado).toBe('PENDING');
    });

    it('should honor a custom vigencia_dias', async () => {
      prisma.standaloneBudget.findFirst.mockResolvedValue(null);
      prisma.standaloneBudget.create.mockResolvedValue(budget);

      await service.create({ ...createDto, vigencia_dias: 3 } as any, userEmp1);

      const data = prisma.standaloneBudget.create.mock.calls[0][0].data;
      expect(data.vigencia_dias).toBe(3);
      expect(data.fecha_vencimiento.getTime()).toBeGreaterThan(Date.now());
      expect(data.fecha_vencimiento.getTime()).toBeLessThan(Date.now() + 4 * 86400000);
    });

    it('should throw BadRequestException when user has no company', async () => {
      await expect(service.create(createDto as any, devUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateDto = { notas: 'nueva nota' };

    it('should update a pending budget', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, ...updateDto });

      const result = await service.update('budget-1', updateDto as any, userEmp1);

      expect(prisma.standaloneBudget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: updateDto,
      });
      expect(result.notas).toBe('nueva nota');
    });

    it('should recalculate fecha_vencimiento when vigencia_dias changes', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, vigencia_dias: 15 });

      await service.update('budget-1', { vigencia_dias: 15 } as any, userEmp1);

      const data = prisma.standaloneBudget.update.mock.calls[0][0].data;
      expect(data.vigencia_dias).toBe(15);
      expect(data.fecha_vencimiento).toBeInstanceOf(Date);
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.update('budget-1', updateDto as any, userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when budget is expired', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, fecha_vencimiento: past });

      await expect(service.update('budget-1', updateDto as any, userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(null);

      await expect(service.update('budget-x', updateDto as any, userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should approve the budget, create the client and repair, and link them', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);
      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue({ id: 'client-1', empresa_id: 'emp-1' });
      prisma.repair.findFirst.mockResolvedValue(null);
      prisma.repair.create.mockResolvedValue(repair);
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, estado: 'APPROVED', repair_id: 'repair-1' });

      const result = await service.approve('budget-1', userEmp1);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          nombre_completo: 'Juan Pérez',
          telefono: '1123456789',
          dni: null,
          empresa_id: 'emp-1',
        },
      });
      expect(prisma.repair.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cliente_id: 'client-1',
            empresa_id: 'emp-1',
            estado: 'INGRESADO',
            total_reparacion: 100,
            numero_reparacion: expect.stringMatching(/^REP-\d{8}-0001$/),
          }),
        }),
      );
      expect(prisma.standaloneBudget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({
          estado: 'APPROVED',
          fecha_respuesta: expect.any(Date),
          repair_id: 'repair-1',
        }),
        include: { repair: { select: { id: true, numero_reparacion: true, estado: true } } },
      });
      expect(result.estado).toBe('APPROVED');
    });

    it('should reuse an existing client by phone and fill missing dni', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, cliente_dni: '30123456' });
      prisma.client.findFirst.mockResolvedValue({ id: 'client-1', dni: null });
      prisma.client.update.mockResolvedValue({ id: 'client-1', dni: '30123456' });
      prisma.repair.findFirst.mockResolvedValue(null);
      prisma.repair.create.mockResolvedValue(repair);
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await service.approve('budget-1', userEmp1);

      expect(prisma.client.create).not.toHaveBeenCalled();
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { dni: '30123456' },
      });
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.approve('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when budget is expired', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, fecha_vencimiento: past });

      await expect(service.approve('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(null);

      await expect(service.approve('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reject', () => {
    it('should reject the budget with provided notas', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, estado: 'REJECTED' });

      const result = await service.reject('budget-1', userEmp1, 'presupuesto alto');

      expect(prisma.standaloneBudget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({
          estado: 'REJECTED',
          fecha_respuesta: expect.any(Date),
          notas: 'presupuesto alto',
        }),
      });
      expect(result.estado).toBe('REJECTED');
    });

    it('should keep existing notas when none is provided', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, notas: 'nota existente' });
      prisma.standaloneBudget.update.mockResolvedValue({ ...budget, estado: 'REJECTED' });

      await service.reject('budget-1', userEmp1);

      expect(prisma.standaloneBudget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({ notas: 'nota existente' }),
      });
    });

    it('should throw BadRequestException when budget is expired', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, fecha_vencimiento: past });

      await expect(service.reject('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(null);

      await expect(service.reject('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a pending budget', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(budget);
      prisma.standaloneBudget.delete.mockResolvedValue(budget);

      const result = await service.delete('budget-1', userEmp1);

      expect(prisma.standaloneBudget.delete).toHaveBeenCalledWith({ where: { id: 'budget-1' } });
      expect(result).toEqual({ message: 'Presupuesto eliminado exitosamente' });
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.delete('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when budget is expired', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue({ ...budget, fecha_vencimiento: past });

      await expect(service.delete('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.standaloneBudget.findUnique.mockResolvedValue(null);

      await expect(service.delete('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });
});