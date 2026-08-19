import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { PrismaService } from '../../database/prisma.service';
import { EstadoReparacion } from './enums/estado-reparacion.enum';

describe('RepairsService', () => {
  let service: RepairsService;
  let prisma: any;
  let tx: any;

  const devUser = { id: 'dev-1', rol: 'DESARROLLADOR', empresa_id: null };
  const userEmp1 = { id: 'user-1', rol: 'ADMIN', empresa_id: 'emp-1' };
  const userEmp2 = { id: 'user-2', rol: 'ADMIN', empresa_id: 'emp-2' };
  const tecnicoUser = { id: 'tec-1', rol: 'TECNICO', empresa_id: 'emp-1' };

  const repair = {
    id: 'repair-1',
    numero_reparacion: 'REP-0001',
    cliente_id: 'client-1',
    empresa_id: 'emp-1',
    estado: EstadoReparacion.INGRESADO,
    dispositivo: 'iPhone 12',
    marca: 'Apple',
    modelo: 'A2172',
    problema_reportado: 'No enciende',
    diagnosis: null,
    reparacion_realizada: null,
    fecha_ingreso: new Date(),
    fecha_estimada_entrega: null,
    fecha_entrega: null,
    total_reparacion: null,
    garantia_meses: null,
    tecnico_asignado_id: 'tec-1',
    cliente: {
      id: 'client-1',
      nombre_completo: 'Juan Perez',
      telefono: '123456789',
      dni: '12345678',
    },
    tecnico_asignado: { id: 'tec-1', nombre: 'Ana', apellido: 'Gomez' },
    budgets: [],
    partsUsed: [],
  };

  beforeEach(async () => {
    tx = {
      repair: {
        update: jest.fn(),
      },
      repairStateHistory: {
        create: jest.fn(),
      },
    };

    prisma = {
      repair: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      repairStateHistory: {
        findMany: jest.fn(),
      },
      tenantPage: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(tx)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepairsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RepairsService>(RepairsService);
  });

  describe('findAll', () => {
    it('should filter by company for non-dev users and return paginated meta', async () => {
      prisma.repair.findMany.mockResolvedValue([repair]);
      prisma.repair.count.mockResolvedValue(1);

      const result = await service.findAll(userEmp1, 1, 10);

      expect(prisma.repair.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1' },
          skip: 0,
          take: 10,
        }),
      );
      expect(prisma.repair.count).toHaveBeenCalledWith({ where: { empresa_id: 'emp-1' } });
      expect(result).toEqual({
        data: [repair],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should NOT filter by company for DEV users (empty where)', async () => {
      prisma.repair.findMany.mockResolvedValue([]);
      prisma.repair.count.mockResolvedValue(0);

      await service.findAll(devUser);

      expect(prisma.repair.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should apply estado, cliente_id, tecnico_id and date filters', async () => {
      prisma.repair.findMany.mockResolvedValue([]);
      prisma.repair.count.mockResolvedValue(0);

      await service.findAll(userEmp1, 2, 5, {
        estado: EstadoReparacion.EN_REPARACION,
        cliente_id: 'client-1',
        tecnico_id: 'tec-1',
        fecha_desde: '2026-01-01',
        fecha_hasta: '2026-01-31',
      });

      expect(prisma.repair.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            empresa_id: 'emp-1',
            estado: EstadoReparacion.EN_REPARACION,
            cliente_id: 'client-1',
            tecnico_asignado_id: 'tec-1',
            fecha_ingreso: {
              gte: new Date('2026-01-01'),
              lte: new Date('2026-01-31'),
            },
          },
          skip: 5,
          take: 5,
        }),
      );
    });

    it('should add tecnico_asignado_id filter for TECNICO users', async () => {
      prisma.repair.findMany.mockResolvedValue([]);
      prisma.repair.count.mockResolvedValue(0);

      await service.findAll(tecnicoUser);

      expect(prisma.repair.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1', tecnico_asignado_id: 'tec-1' },
        }),
      );
    });
  });

  describe('findByOrderNumber', () => {
    it('should return only public fields without cliente data', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);

      const result = await service.findByOrderNumber('REP-0001');

      expect(prisma.repair.findUnique).toHaveBeenCalledWith({
        where: { numero_reparacion: 'REP-0001' },
        include: {
          tecnico_asignado: { select: { nombre: true, apellido: true } },
        },
      });
      expect(result.numero_reparacion).toBe('REP-0001');
      expect(result.estado).toBe(EstadoReparacion.INGRESADO);
      expect(result.tecnico_asignado).toBeDefined();
      expect((result as any).cliente).toBeUndefined();
      expect((result as any).cliente_id).toBeUndefined();
    });

    it('should throw NotFoundException when repair does not exist', async () => {
      prisma.repair.findUnique.mockResolvedValue(null);

      await expect(service.findByOrderNumber('REP-X')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getHistory', () => {
    it('should return the history for a repair of the own company', async () => {
      const history = [
        {
          id: 'h-1',
          repair_id: 'repair-1',
          estado: EstadoReparacion.INGRESADO,
          usuario: { nombre: 'Ana', email: 'ana@x.com' },
          nota: null,
        },
      ];
      prisma.repair.findFirst.mockResolvedValue({ id: 'repair-1' });
      prisma.repairStateHistory.findMany.mockResolvedValue(history);

      const result = await service.getHistory('repair-1', userEmp1);

      expect(prisma.repair.findFirst).toHaveBeenCalledWith({
        where: { id: 'repair-1', empresa_id: 'emp-1' },
        select: { id: true },
      });
      expect(prisma.repairStateHistory.findMany).toHaveBeenCalledWith({
        where: { repair_id: 'repair-1' },
        orderBy: { createdAt: 'asc' },
        include: { usuario: { select: { nombre: true, email: true } } },
      });
      expect(result).toEqual(history);
    });

    it('should not filter by company for DEV users', async () => {
      prisma.repair.findFirst.mockResolvedValue({ id: 'repair-1' });
      prisma.repairStateHistory.findMany.mockResolvedValue([]);

      await service.getHistory('repair-1', devUser);

      expect(prisma.repair.findFirst).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        select: { id: true },
      });
    });

    it('should throw NotFoundException when repair does not exist or belongs to another company (non-dev)', async () => {
      prisma.repair.findFirst.mockResolvedValue(null);

      await expect(service.getHistory('repair-x', userEmp1)).rejects.toThrow(NotFoundException);
      await expect(service.getHistory('repair-x', userEmp2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPermittedStates', () => {
    it('should return the permitted states for the repair state', async () => {
      prisma.repair.findFirst.mockResolvedValue({ ...repair, estado: EstadoReparacion.EN_DIAGNOSTICO });

      const result = await service.getPermittedStates('repair-1', userEmp1);

      expect(prisma.repair.findFirst).toHaveBeenCalledWith({
        where: { id: 'repair-1', empresa_id: 'emp-1' },
      });
      expect(result.permitted).toEqual([
        EstadoReparacion.PRESUPUESTADO_ESPERANDO_OK,
        EstadoReparacion.IRREPARABLE_PARA_RETIRAR,
        EstadoReparacion.CANCELADO_POR_CLIENTE,
      ]);
    });

    it('should return an empty permitted list for final states', async () => {
      prisma.repair.findFirst.mockResolvedValue({ ...repair, estado: EstadoReparacion.CERRADO_FACTURADO });

      const result = await service.getPermittedStates('repair-1', userEmp1);

      expect(result.permitted).toEqual([]);
    });

    it('should throw NotFoundException when repair does not exist', async () => {
      prisma.repair.findFirst.mockResolvedValue(null);

      await expect(service.getPermittedStates('repair-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update the repair and create a history entry within a transaction', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);
      const updated = { ...repair, estado: EstadoReparacion.EN_COLA_DIAGNOSTICO };
      tx.repair.update.mockResolvedValue(updated);
      tx.repairStateHistory.create.mockResolvedValue({ id: 'h-1' });

      const result = await service.updateStatus(
        'repair-1',
        { estado: EstadoReparacion.EN_COLA_DIAGNOSTICO, nota: 'pasa a cola' },
        userEmp1,
      );

      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: { estado: EstadoReparacion.EN_COLA_DIAGNOSTICO },
      });
      expect(tx.repairStateHistory.create).toHaveBeenCalledWith({
        data: {
          repair_id: 'repair-1',
          estado: EstadoReparacion.EN_COLA_DIAGNOSTICO,
          usuario_id: 'user-1',
          nota: 'pasa a cola',
        },
      });
      expect(result).toEqual(updated);
    });

    it('should set fecha_entrega when the new state is a delivered state', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, estado: EstadoReparacion.LISTO_PARA_RETIRAR });
      prisma.tenantPage.findUnique.mockResolvedValue({
        config: { warranty: { enabled: false, duration: 6, unit: 'MESES' } },
      });
      tx.repair.update.mockResolvedValue({ ...repair, estado: EstadoReparacion.ENTREGADO_AL_CLIENTE });
      tx.repairStateHistory.create.mockResolvedValue({ id: 'h-1' });

      await service.updateStatus(
        'repair-1',
        { estado: EstadoReparacion.ENTREGADO_AL_CLIENTE },
        userEmp1,
      );

      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: expect.objectContaining({
          estado: EstadoReparacion.ENTREGADO_AL_CLIENTE,
          fecha_entrega: expect.any(Date),
        }),
      });
    });

    it('should activate the company warranty when delivering a repair without warranty', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, estado: EstadoReparacion.LISTO_PARA_RETIRAR, tiene_garantia: false });
      prisma.tenantPage.findUnique.mockResolvedValue({
        config: { warranty: { enabled: true, duration: 3, unit: 'MESES' } },
      });
      tx.repair.update.mockResolvedValue({ ...repair, estado: EstadoReparacion.ENTREGADO_AL_CLIENTE });
      tx.repairStateHistory.create.mockResolvedValue({ id: 'h-1' });

      await service.updateStatus(
        'repair-1',
        { estado: EstadoReparacion.ENTREGADO_AL_CLIENTE },
        userEmp1,
      );

      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: expect.objectContaining({
          estado: EstadoReparacion.ENTREGADO_AL_CLIENTE,
          fecha_entrega: expect.any(Date),
          tiene_garantia: true,
          garantia_duracion: 3,
          garantia_unidad: 'MESES',
          garantia_meses: 3,
          fecha_inicio_garantia: expect.any(Date),
          fecha_fin_garantia: expect.any(Date),
        }),
      });
    });

    it('should NOT overwrite an existing warranty when delivering', async () => {
      prisma.repair.findUnique.mockResolvedValue({
        ...repair,
        estado: EstadoReparacion.LISTO_PARA_RETIRAR,
        tiene_garantia: true,
        garantia_duracion: 12,
        garantia_unidad: 'MESES',
      });
      tx.repair.update.mockResolvedValue({ ...repair, estado: EstadoReparacion.ENTREGADO_AL_CLIENTE });
      tx.repairStateHistory.create.mockResolvedValue({ id: 'h-1' });

      await service.updateStatus(
        'repair-1',
        { estado: EstadoReparacion.ENTREGADO_AL_CLIENTE },
        userEmp1,
      );

      expect(tx.repair.update).toHaveBeenCalledWith({
        where: { id: 'repair-1' },
        data: expect.objectContaining({
          estado: EstadoReparacion.ENTREGADO_AL_CLIENTE,
          fecha_entrega: expect.any(Date),
        }),
      });
      expect(prisma.tenantPage.findUnique).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when repair does not exist', async () => {
      prisma.repair.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('repair-x', { estado: EstadoReparacion.EN_COLA_DIAGNOSTICO }, userEmp1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when repair belongs to another company (non-dev)', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, empresa_id: 'emp-2' });

      await expect(
        service.updateStatus('repair-1', { estado: EstadoReparacion.EN_COLA_DIAGNOSTICO }, userEmp1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException for a non-permitted transition', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);

      await expect(
        service.updateStatus('repair-1', { estado: EstadoReparacion.EN_REPARACION }, userEmp1),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return the repair for the owner company', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);

      const result = await service.findOne('repair-1', userEmp1);

      expect(result).toEqual(repair);
    });

    it('should allow DEV users to see repairs of any company', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);

      const result = await service.findOne('repair-1', devUser);

      expect(result).toEqual(repair);
    });

    it('should throw NotFoundException when repair does not exist', async () => {
      prisma.repair.findUnique.mockResolvedValue(null);

      await expect(service.findOne('repair-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when repair belongs to another company (non-dev)', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, empresa_id: 'emp-2' });

      await expect(service.findOne('repair-1', userEmp1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for a TECNICO not assigned to the repair', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, tecnico_asignado_id: 'tec-other' });

      await expect(service.findOne('repair-1', tecnicoUser)).rejects.toThrow(ForbiddenException);
    });

    it('should allow a TECNICO assigned to the repair', async () => {
      prisma.repair.findUnique.mockResolvedValue(repair);

      const result = await service.findOne('repair-1', tecnicoUser);

      expect(result).toEqual(repair);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException when trying to unmark an already paid repair', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, pagado: true });

      await expect(
        service.update('repair-1', { pagado: false }, userEmp1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow keeping pagado as true on an already paid repair', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, pagado: true });
      prisma.repair.update = jest.fn().mockResolvedValue({ ...repair, pagado: true });

      const result = await service.update('repair-1', { pagado: true }, userEmp1);

      expect(prisma.repair.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'repair-1' },
          data: expect.objectContaining({ pagado: true }),
        }),
      );
      expect(result.pagado).toBe(true);
    });
  });

  describe('complete', () => {
    it('should set the repair to REPARADO_PENDIENTE_PAGO with the total', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, estado: EstadoReparacion.EN_REPARACION });
      const updated = {
        ...repair,
        estado: EstadoReparacion.REPARADO_PENDIENTE_PAGO,
        total_reparacion: 500,
        metodo_pago_id: 'mp-1',
      };
      prisma.repair.update = jest.fn().mockResolvedValue(updated);

      const result = await service.complete(
        'repair-1',
        { total_reparacion: 500, metodo_pago: 'mp-1' },
        userEmp1,
      );

      expect(prisma.repair.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'repair-1' },
          data: expect.objectContaining({
            estado: EstadoReparacion.REPARADO_PENDIENTE_PAGO,
            total_reparacion: 500,
            metodo_pago_id: 'mp-1',
          }),
        }),
      );
      expect(result.estado).toBe(EstadoReparacion.REPARADO_PENDIENTE_PAGO);
    });

    it('should throw BadRequestException when repair is not in a completable state', async () => {
      prisma.repair.findUnique.mockResolvedValue({ ...repair, estado: EstadoReparacion.EN_DIAGNOSTICO });

      await expect(
        service.complete('repair-1', { total_reparacion: 500 }, userEmp1),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
