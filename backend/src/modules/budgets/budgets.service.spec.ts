import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { PrismaService } from '../../database/prisma.service';
import { EstadoReparacion } from '../repairs/enums/estado-reparacion.enum';

describe('BudgetsService', () => {
  let service: BudgetsService;
  let prisma: any;
  let tx: any;

  const devUser = { id: 'dev-1', rol: 'DESARROLLADOR', empresa_id: null };
  const userEmp1 = { id: 'user-1', rol: 'ADMIN', empresa_id: 'emp-1' };
  const userEmp2 = { id: 'user-2', rol: 'ADMIN', empresa_id: 'emp-2' };

  const repair = {
    id: 'repair-1',
    empresa_id: 'emp-1',
    estado: EstadoReparacion.EN_DIAGNOSTICO,
  };

  const budget = {
    id: 'budget-1',
    numero: 'PRES-20260101-0001',
    reparacion_id: 'repair-1',
    estado: 'PENDING',
    fecha_envio: new Date(),
    fecha_respuesta: null,
    notas: 'nota existente',
    items: [{ descripcion: 'Pantalla', precio: 100 }],
    total: 100,
    reparacion: {
      id: 'repair-1',
      empresa_id: 'emp-1',
      estado: EstadoReparacion.EN_DIAGNOSTICO,
      cliente: { id: 'client-1', nombre_completo: 'Juan', telefono: '123' },
      tecnico_asignado: null,
    },
  };

  const updatedBudget = {
    ...budget,
    estado: 'APPROVED',
    fecha_respuesta: new Date(),
  };

  beforeEach(async () => {
    tx = {
      budget: {
        update: jest.fn(),
      },
      repair: {
        update: jest.fn(),
      },
    };

    prisma = {
      budget: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      repair: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(tx)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
  });

  describe('findAll', () => {
    it('should return paginated budgets with meta filtering by company for non-dev users', async () => {
      prisma.budget.findMany.mockResolvedValue([budget]);
      prisma.budget.count.mockResolvedValue(1);

      const result = await service.findAll(userEmp1, 1, 10);

      expect(prisma.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { reparacion: { empresa_id: 'emp-1' } },
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.budget.count).toHaveBeenCalledWith({
        where: { reparacion: { empresa_id: 'emp-1' } },
      });
      expect(result).toEqual({
        data: [budget],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply estado and reparacion_id filters and pagination', async () => {
      prisma.budget.findMany.mockResolvedValue([]);
      prisma.budget.count.mockResolvedValue(0);

      const result = await service.findAll(devUser, 2, 5, {
        estado: 'PENDING',
        reparacion_id: 'repair-1',
      });

      expect(prisma.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { estado: 'PENDING', reparacion_id: 'repair-1' },
          skip: 5,
          take: 5,
        }),
      );
      expect(result.meta).toEqual({ total: 0, page: 2, limit: 5, totalPages: 0 });
    });

    it('should not filter by company for DEV users', async () => {
      prisma.budget.findMany.mockResolvedValue([]);
      prisma.budget.count.mockResolvedValue(0);

      await service.findAll(devUser);

      expect(prisma.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the budget for the owner company', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);

      const result = await service.findOne('budget-1', userEmp1);

      expect(result).toEqual(budget);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);

      await expect(service.findOne('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when budget belongs to another company (non-dev)', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);

      await expect(service.findOne('budget-1', userEmp2)).rejects.toThrow(ForbiddenException);
    });

    it('should allow DEV users to view budgets of any company', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);

      const result = await service.findOne('budget-1', devUser);

      expect(result).toEqual(budget);
    });
  });

  describe('create', () => {
    const createDto = {
      reparacion_id: 'repair-1',
      items: [{ descripcion: 'Pantalla', precio: 100 }],
      total: 100,
    };

    it('should create a pending budget with a generated number', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);
      prisma.budget.findFirst.mockResolvedValue(null);
      prisma.budget.create.mockResolvedValue({ ...budget, numero: 'PRES-20260101-0001' });

      const result = await service.create(createDto as any, userEmp1);

      expect(prisma.budget.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            reparacion_id: 'repair-1',
            estado: 'PENDING',
            numero: expect.stringMatching(/^PRES-\d{8}-0001$/),
          }),
        }),
      );
      expect(result.estado).toBe('PENDING');
    });

    it('should throw NotFoundException when repair does not exist', async () => {
      prisma.repair.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto as any, userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when repair belongs to another company (non-dev)', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, empresa_id: 'emp-2' });

      await expect(service.create(createDto as any, userEmp1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when a pending budget already exists', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);
      prisma.budget.findFirst.mockResolvedValue({ id: 'budget-pending' });

      await expect(service.create(createDto as any, userEmp1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    const updateDto = { notas: 'nueva nota' };

    it('should update a pending budget', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);
      prisma.budget.update.mockResolvedValue({ ...budget, ...updateDto });

      const result = await service.update('budget-1', updateDto as any, userEmp1);

      expect(prisma.budget.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'budget-1' },
          data: updateDto,
        }),
      );
      expect(result.notas).toBe('nueva nota');
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.budget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.update('budget-1', updateDto as any, userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);

      await expect(service.update('budget-x', updateDto as any, userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should approve the budget and move the repair to EN_REPARACION when it was EN_DIAGNOSTICO', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);
      tx.budget.update.mockResolvedValue(updatedBudget);
      tx.repair.update.mockResolvedValue({});

      const result = await service.approve('budget-1', userEmp1);

      expect(tx.budget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({
          estado: 'APPROVED',
          fecha_respuesta: expect.any(Date),
        }),
      });
      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: { estado: EstadoReparacion.EN_REPARACION },
      });
      expect(result).toEqual(updatedBudget);
    });

    it('should approve without touching the repair when it is not EN_DIAGNOSTICO', async () => {
      const budgetEnReparacion = {
        ...budget,
        reparacion: { ...budget.reparacion, estado: EstadoReparacion.EN_REPARACION },
      };
      prisma.budget.findUnique.mockResolvedValue(budgetEnReparacion);
      tx.budget.update.mockResolvedValue(updatedBudget);

      await service.approve('budget-1', userEmp1);

      expect(tx.budget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({ estado: 'APPROVED' }),
      });
      expect(tx.repair.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.budget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.approve('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);

      await expect(service.approve('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when budget belongs to another company (non-dev)', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);

      await expect(service.approve('budget-1', userEmp2)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('reject', () => {
    it('should reject the budget and set the repair to PRESUPUESTO_RECHAZADO', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);
      const rejectedBudget = { ...updatedBudget, estado: 'REJECTED' };
      tx.budget.update.mockResolvedValue(rejectedBudget);
      tx.repair.update.mockResolvedValue({});

      const result = await service.reject('budget-1', userEmp1, 'presupuesto alto');

      expect(tx.budget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({
          estado: 'REJECTED',
          fecha_respuesta: expect.any(Date),
          notas: 'presupuesto alto',
        }),
      });
      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: { estado: EstadoReparacion.PRESUPUESTO_RECHAZADO },
      });
      expect(result).toEqual(rejectedBudget);
    });

    it('should keep existing budget notas when none is provided', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);
      tx.budget.update.mockResolvedValue({ ...updatedBudget, estado: 'REJECTED' });
      tx.repair.update.mockResolvedValue({});

      await service.reject('budget-1', userEmp1);

      expect(tx.budget.update).toHaveBeenCalledWith({
        where: { id: 'budget-1' },
        data: expect.objectContaining({ notas: 'nota existente' }),
      });
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.budget.findUnique.mockResolvedValue({ ...budget, estado: 'REJECTED' });

      await expect(service.reject('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);

      await expect(service.reject('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a pending budget', async () => {
      prisma.budget.findUnique.mockResolvedValue(budget);
      prisma.budget.delete.mockResolvedValue(budget);

      const result = await service.delete('budget-1', userEmp1);

      expect(prisma.budget.delete).toHaveBeenCalledWith({ where: { id: 'budget-1' } });
      expect(result).toEqual({ message: 'Presupuesto eliminado exitosamente' });
    });

    it('should throw BadRequestException when budget is not PENDING', async () => {
      prisma.budget.findUnique.mockResolvedValue({ ...budget, estado: 'APPROVED' });

      await expect(service.delete('budget-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when budget does not exist', async () => {
      prisma.budget.findUnique.mockResolvedValue(null);

      await expect(service.delete('budget-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });
});
