import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../../database/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { updatePlanSchema, createPaymentMethodSchema, createCategorySchema } from './dto/settings.dto';

jest.mock('@whiskeysockets/baileys', () => {
  const createSock = () => ({
    ev: { on: jest.fn() },
    sendMessage: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    requestPairingCode: jest.fn(),
    getChats: jest.fn(),
    loadMessages: jest.fn(),
  });
  return {
    __esModule: true,
    default: jest.fn(() => createSock()),
    useMultiFileAuthState: jest.fn().mockResolvedValue({ state: {}, saveCreds: jest.fn() }),
    DisconnectReason: {
      loggedOut: 401,
      connectionLost: 402,
      connectionClosed: 403,
      timedOut: 408,
      restartRequired: 515,
    },
  };
});

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  rm: jest.fn().mockResolvedValue(undefined),
}));

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: any;
  let whatsappService: any;

  beforeEach(async () => {
    prisma = {
      repairStateRequest: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      paymentMethod: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      notificationPreference: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      integration: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      planSubscription: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      taxRate: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      bankAccount: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      whatsAppSession: {
        findUnique: jest.fn(),
      },
    };

    whatsappService = {
      isConnected: jest.fn().mockReturnValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: PrismaService, useValue: prisma },
        { provide: WhatsappService, useValue: whatsappService },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  describe('ensureDefaults (via getPaymentMethods)', () => {
    it('seeds defaults for a new empresa (payment methods, preferences, integrations, plan)', async () => {
      prisma.paymentMethod.count.mockResolvedValue(0);
      prisma.notificationPreference.count.mockResolvedValue(0);
      prisma.integration.count.mockResolvedValue(0);
      prisma.planSubscription.findUnique.mockResolvedValue(null);
      prisma.paymentMethod.create.mockResolvedValue({ id: 'pm-1' });
      prisma.notificationPreference.create.mockResolvedValue({ id: 'np-1' });
      prisma.integration.create.mockResolvedValue({ id: 'int-1' });
      prisma.planSubscription.create.mockResolvedValue({ id: 'plan-1' });
      prisma.paymentMethod.findMany.mockResolvedValue([{ id: 'pm-1', nombre: 'Efectivo' }]);

      await service.getPaymentMethods('emp-1');

      expect(prisma.paymentMethod.count).toHaveBeenCalledWith({ where: { empresa_id: 'emp-1' } });
      expect(prisma.paymentMethod.create).toHaveBeenCalledTimes(3);
      expect(prisma.notificationPreference.create).toHaveBeenCalledTimes(3);
      expect(prisma.integration.create).toHaveBeenCalledTimes(3);
      expect(prisma.planSubscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ empresa_id: 'emp-1', plan: 'DEMO', activo: true }),
        }),
      );
    });

    it('does not re-query prisma once the empresa is already seeded', async () => {
      prisma.paymentMethod.count.mockResolvedValue(0);
      prisma.notificationPreference.count.mockResolvedValue(0);
      prisma.integration.count.mockResolvedValue(0);
      prisma.planSubscription.findUnique.mockResolvedValue(null);
      prisma.paymentMethod.create.mockResolvedValue({});
      prisma.notificationPreference.create.mockResolvedValue({});
      prisma.integration.create.mockResolvedValue({});
      prisma.planSubscription.create.mockResolvedValue({});
      prisma.paymentMethod.findMany.mockResolvedValue([]);

      await service.getPaymentMethods('emp-1');
      await service.getPaymentMethods('emp-1');

      expect(prisma.paymentMethod.count).toHaveBeenCalledTimes(1);
      expect(prisma.notificationPreference.count).toHaveBeenCalledTimes(1);
      expect(prisma.integration.count).toHaveBeenCalledTimes(1);
      expect(prisma.planSubscription.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.paymentMethod.create).toHaveBeenCalledTimes(3);
    });

    it('skips seeding when data already exists', async () => {
      prisma.paymentMethod.count.mockResolvedValue(3);
      prisma.notificationPreference.count.mockResolvedValue(3);
      prisma.integration.count.mockResolvedValue(3);
      prisma.planSubscription.findUnique.mockResolvedValue({ id: 'plan-1', plan: 'PRO' });
      prisma.paymentMethod.findMany.mockResolvedValue([{ id: 'pm-1' }]);

      await service.getPaymentMethods('emp-1');

      expect(prisma.paymentMethod.create).not.toHaveBeenCalled();
      expect(prisma.planSubscription.create).not.toHaveBeenCalled();
    });
  });

  describe('getRepairStates', () => {
    it('returns the available repair states', async () => {
      const result = await service.getRepairStates();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getRepairStateRequests', () => {
    it('filters requests by empresa', async () => {
      prisma.repairStateRequest.findMany.mockResolvedValue([{ id: 'req-1' }]);
      await service.getRepairStateRequests('emp-1');
      expect(prisma.repairStateRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' } }),
      );
    });
  });

  describe('createRepairStateRequest', () => {
    it('creates a pending request', async () => {
      prisma.repairStateRequest.create.mockResolvedValue({ id: 'req-1' });
      await service.createRepairStateRequest('emp-1', 'user-1', { estado_nombre: 'En cola' });
      expect(prisma.repairStateRequest.create).toHaveBeenCalledWith({
        data: {
          empresa_id: 'emp-1',
          usuario_id: 'user-1',
          estado_nombre: 'En cola',
          mensaje: undefined,
          estado: 'pendiente',
        },
      });
    });
  });

  describe('updateRepairStateRequest', () => {
    it('throws NotFoundException when request does not exist', async () => {
      prisma.repairStateRequest.findUnique.mockResolvedValue(null);
      await expect(service.updateRepairStateRequest('req-1', 'emp-1', 'aprobado')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when request belongs to another empresa', async () => {
      prisma.repairStateRequest.findUnique.mockResolvedValue({ id: 'req-1', empresa_id: 'other-emp' });
      await expect(service.updateRepairStateRequest('req-1', 'emp-1', 'aprobado')).rejects.toThrow(NotFoundException);
    });

    it('updates the request state', async () => {
      prisma.repairStateRequest.findUnique.mockResolvedValue({ id: 'req-1', empresa_id: 'emp-1' });
      prisma.repairStateRequest.update.mockResolvedValue({ id: 'req-1', estado: 'aprobado' });
      const result = await service.updateRepairStateRequest('req-1', 'emp-1', 'aprobado');
      expect(prisma.repairStateRequest.update).toHaveBeenCalledWith({ where: { id: 'req-1' }, data: { estado: 'aprobado' } });
      expect(result.estado).toBe('aprobado');
    });
  });

  describe('getPaymentMethods', () => {
    it('returns the payment methods of the empresa', async () => {
      prisma.paymentMethod.count.mockResolvedValue(3);
      prisma.notificationPreference.count.mockResolvedValue(3);
      prisma.integration.count.mockResolvedValue(3);
      prisma.planSubscription.findUnique.mockResolvedValue({ id: 'plan-1' });
      prisma.paymentMethod.findMany.mockResolvedValue([{ id: 'pm-1', nombre: 'Efectivo' }]);

      const result = await service.getPaymentMethods('emp-1');

      expect(prisma.paymentMethod.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' } }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('updatePaymentMethod', () => {
    it('throws NotFoundException when method does not exist or belongs to another empresa', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(null);
      await expect(service.updatePaymentMethod('pm-1', 'emp-1', { nombre: 'Nuevo' })).rejects.toThrow(NotFoundException);

      prisma.paymentMethod.findUnique.mockResolvedValue({ id: 'pm-1', empresa_id: 'other-emp' });
      await expect(service.updatePaymentMethod('pm-1', 'emp-1', { nombre: 'Nuevo' })).rejects.toThrow(NotFoundException);
    });

    it('updates a payment method that belongs to the empresa', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue({ id: 'pm-1', empresa_id: 'emp-1' });
      prisma.paymentMethod.update.mockResolvedValue({ id: 'pm-1', nombre: 'Nuevo' });

      const result = await service.updatePaymentMethod('pm-1', 'emp-1', { nombre: 'Nuevo' });

      expect(prisma.paymentMethod.update).toHaveBeenCalledWith({ where: { id: 'pm-1' }, data: { nombre: 'Nuevo' } });
      expect(result.nombre).toBe('Nuevo');
    });
  });

  describe('deletePaymentMethod', () => {
    it('throws NotFoundException when method does not exist', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue(null);
      await expect(service.deletePaymentMethod('pm-1', 'emp-1')).rejects.toThrow(NotFoundException);
    });

    it('deletes and returns a confirmation message', async () => {
      prisma.paymentMethod.findUnique.mockResolvedValue({ id: 'pm-1', empresa_id: 'emp-1' });
      prisma.paymentMethod.delete.mockResolvedValue({});
      const result = await service.deletePaymentMethod('pm-1', 'emp-1');
      expect(prisma.paymentMethod.delete).toHaveBeenCalledWith({ where: { id: 'pm-1' } });
      expect(result.message).toBe('Método de pago eliminado correctamente');
    });
  });

  describe('getIntegrations', () => {
    it('enriches the whatsapp integration with the real session state', async () => {
      prisma.paymentMethod.count.mockResolvedValue(3);
      prisma.notificationPreference.count.mockResolvedValue(3);
      prisma.integration.count.mockResolvedValue(3);
      prisma.planSubscription.findUnique.mockResolvedValue({ id: 'plan-1' });
      prisma.integration.findMany.mockResolvedValue([
        { id: 'int-1', nombre: 'whatsapp', conectado: false },
        { id: 'int-2', nombre: 'arca', conectado: false },
      ]);
      prisma.whatsAppSession.findUnique.mockResolvedValue({ estado: 'connected' });
      whatsappService.isConnected.mockReturnValue(false);

      const result = await service.getIntegrations('emp-1');

      expect(result[0]).toEqual(expect.objectContaining({ nombre: 'whatsapp', conectado: true, estado_real: 'connected' }));
      expect(result[1]).toEqual(expect.objectContaining({ nombre: 'arca', conectado: false }));
    });
  });

  describe('updateIntegration', () => {
    it('throws ForbiddenException for the whatsapp integration', async () => {
      prisma.integration.findUnique.mockResolvedValue({ id: 'int-1', empresa_id: 'emp-1', nombre: 'whatsapp' });
      await expect(service.updateIntegration('int-1', 'emp-1', { conectado: true })).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when integration does not exist or belongs to another empresa', async () => {
      prisma.integration.findUnique.mockResolvedValue(null);
      await expect(service.updateIntegration('int-1', 'emp-1', { conectado: true })).rejects.toThrow(NotFoundException);
    });

    it('updates a non-whatsapp integration', async () => {
      prisma.integration.findUnique.mockResolvedValue({ id: 'int-2', empresa_id: 'emp-1', nombre: 'mobbex' });
      prisma.integration.update.mockResolvedValue({ id: 'int-2', conectado: true });
      const result = await service.updateIntegration('int-2', 'emp-1', { conectado: true });
      expect(prisma.integration.update).toHaveBeenCalledWith({ where: { id: 'int-2' }, data: { conectado: true } });
      expect(result.conectado).toBe(true);
    });
  });

  describe('getPlan', () => {
    it('throws NotFoundException when no plan is found after seeding', async () => {
      prisma.paymentMethod.count.mockResolvedValue(3);
      prisma.notificationPreference.count.mockResolvedValue(3);
      prisma.integration.count.mockResolvedValue(3);
      prisma.planSubscription.findUnique.mockResolvedValue(null);

      await expect(service.getPlan('emp-1')).rejects.toThrow(NotFoundException);
    });

    it('returns the plan of the empresa', async () => {
      prisma.paymentMethod.count.mockResolvedValue(3);
      prisma.notificationPreference.count.mockResolvedValue(3);
      prisma.integration.count.mockResolvedValue(3);
      prisma.planSubscription.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'plan-1', empresa_id: 'emp-1', plan: 'PRO' });

      const result = await service.getPlan('emp-1');

      expect(result.plan).toBe('PRO');
    });
  });

  describe('updatePlan', () => {
    it('throws NotFoundException when there is no current plan', async () => {
      prisma.planSubscription.findUnique.mockResolvedValue(null);
      await expect(service.updatePlan('emp-1', { plan: 'PRO' })).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when the plan name is not in PLAN_OPTIONS', async () => {
      prisma.planSubscription.findUnique.mockResolvedValue({ id: 'plan-1', plan: 'DEMO', meses: 1, activo: true });
      await expect(service.updatePlan('emp-1', { plan: 'NOVEDAD' })).rejects.toThrow(ConflictException);
    });

    it('updates the plan with valid data', async () => {
      prisma.planSubscription.findUnique.mockResolvedValue({ id: 'plan-1', plan: 'DEMO', meses: 1, activo: true });
      prisma.planSubscription.update.mockResolvedValue({ id: 'plan-1', plan: 'PRO', meses: 3 });

      const result = await service.updatePlan('emp-1', { plan: 'PRO', meses: 3 });

      expect(prisma.planSubscription.update).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
        data: expect.objectContaining({ plan: 'PRO', meses: 3, activo: true }),
      });
      expect(result.plan).toBe('PRO');
    });
  });

  describe('createCategory', () => {
    it('throws ConflictException when the category name already exists', async () => {
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1' });
      await expect(service.createCategory('emp-1', { nombre: 'Pantallas' })).rejects.toThrow(ConflictException);
    });

    it('creates a category scoped to the empresa', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({ id: 'cat-1', nombre: 'Pantallas' });
      const result = await service.createCategory('emp-1', { nombre: 'Pantallas' });
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { nombre: 'Pantallas', empresa_id: 'emp-1' } });
      expect(result.nombre).toBe('Pantallas');
    });
  });

  describe('updateCategory', () => {
    it('throws NotFoundException when category does not exist or belongs to another empresa', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.updateCategory('cat-1', 'emp-1', { nombre: 'X' })).rejects.toThrow(NotFoundException);

      prisma.category.findUnique.mockResolvedValue({ id: 'cat-1', empresa_id: 'other-emp' });
      await expect(service.updateCategory('cat-1', 'emp-1', { nombre: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('throws NotFoundException when category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.deleteCategory('cat-1', 'emp-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('zod schema validation (used by ZodValidationPipe in controller)', () => {
    it('updatePlanSchema rejects invalid months', () => {
      expect(updatePlanSchema.safeParse({ meses: 0 }).success).toBe(false);
    });

    it('createPaymentMethodSchema rejects empty name', () => {
      expect(createPaymentMethodSchema.safeParse({ nombre: '' }).success).toBe(false);
    });

    it('createCategorySchema rejects empty name', () => {
      expect(createCategorySchema.safeParse({ nombre: '' }).success).toBe(false);
    });
  });
});
