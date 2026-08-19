import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BudgetRequestsService } from './budget-requests.service';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('BudgetRequestsService', () => {
  let service: BudgetRequestsService;
  let prisma: any;

  const devUser = { id: 'dev-1', rol: 'DESARROLLADOR', empresa_id: null };
  const userEmp1 = { id: 'user-1', rol: 'ADMIN', empresa_id: 'emp-1' };
  const userEmp2 = { id: 'user-2', rol: 'ADMIN', empresa_id: 'emp-2' };

  const company = { id: 'company-1', slug: 'tech-reparaciones', codigo_empresa: 'EMP001', activo: true };

  const request = {
    id: 'req-1',
    empresa_id: 'emp-1',
    numero: 'REQ-20260816-0001',
    estado: 'PENDIENTE',
    nombre: 'Juan Pérez',
    whatsapp: '541100000000',
    email: null,
    categoria: 'Pantallas',
    dispositivo: 'iPhone 12',
    modelo: 'iPhone 12',
    problema: 'No enciende',
    descripcion: null,
    tiempo_estimado: '3-4 horas',
    precio_ofertado: '425000',
    precio_ajustado: null,
    plan_pago: 'half',
    sena_monto: '212500',
    sena_metodo: 'qr',
    comprobante: 'MP-123',
    resto_metodo: 'efectivo',
    delivery_metodo: null,
    delivery_direccion: null,
    delivery_costo: null,
    turno_fecha: null,
    turno_horario: null,
    notas_admin: null,
    repair_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      company: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
      budgetRequest: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      client: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      repair: {
        create: jest.fn(),
      },
      tenantPage: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetRequestsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsService, useValue: { notifyNuevoPresupuesto: jest.fn(), create: jest.fn() } },
      ],
    }).compile();

    service = module.get<BudgetRequestsService>(BudgetRequestsService);
  });

  describe('createPublic', () => {
    const createDto = {
      slug: 'tech-reparaciones',
      nombre: 'Juan Pérez',
      whatsapp: '541100000000',
      dispositivo: 'iPhone 12',
      problema: 'No enciende',
      precio_ofertado: 425000,
      plan_pago: 'half',
      sena_monto: 212500,
    };

    const today = new Date();
    const prefix = `REQ-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    it('should create a PENDIENTE request with a generated numero', async () => {
      prisma.company.findUnique.mockResolvedValue(company);
      prisma.budgetRequest.findFirst.mockResolvedValue(null);
      prisma.budgetRequest.create.mockResolvedValue({ ...request, id: 'req-new', numero: `${prefix}-0001` });
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.createPublic(createDto as any);

      expect(prisma.budgetRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'company-1',
            estado: 'PENDIENTE',
            numero: `${prefix}-0001`,
            nombre: 'Juan Pérez',
            dispositivo: 'iPhone 12',
          }),
        }),
      );
      expect(result.numero).toBe(`${prefix}-0001`);
    });

    it('should increment the sequence from the last request', async () => {
      prisma.company.findUnique.mockResolvedValue(company);
      prisma.budgetRequest.findFirst.mockResolvedValue({ numero: `${prefix}-0007` });
      prisma.budgetRequest.create.mockImplementation(({ data }) => Promise.resolve({ ...request, ...data }));
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.createPublic(createDto as any);

      expect(prisma.budgetRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ numero: `${prefix}-0008` }) }),
      );
    });

    it('should throw NotFoundException when the company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.createPublic(createDto as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should filter by company for non-dev users and return paginated results', async () => {
      prisma.budgetRequest.findMany.mockResolvedValue([request]);
      prisma.budgetRequest.count.mockResolvedValue(1);

      const result = await service.findAll(userEmp1, 1, 10);

      expect(prisma.budgetRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' }, skip: 0, take: 10 }),
      );
      expect(result).toEqual({
        data: [request],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply the estado filter', async () => {
      prisma.budgetRequest.findMany.mockResolvedValue([]);
      prisma.budgetRequest.count.mockResolvedValue(0);

      await service.findAll(devUser, 1, 10, { estado: 'CONFIRMADO' });

      expect(prisma.budgetRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { estado: 'CONFIRMADO' } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the request for the owner company', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);

      const result = await service.findOne('req-1', userEmp1);

      expect(result).toEqual(request);
    });

    it('should throw NotFoundException when it does not exist', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('req-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for another company (non-dev)', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);

      await expect(service.findOne('req-1', userEmp2)).rejects.toThrow(ForbiddenException);
    });

    it('should allow DEV users to view requests of any company', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);

      const result = await service.findOne('req-1', devUser);

      expect(result).toEqual(request);
    });
  });

  describe('update', () => {
    it('should update precio_ajustado, notas_admin and estado', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);
      prisma.budgetRequest.update.mockImplementation(({ data }) =>
        Promise.resolve({ ...request, ...data }),
      );

      const result = await service.update(
        'req-1',
        { precio_ajustado: 400000, notas_admin: 'Ajuste por falla leve', estado: 'CONFIRMADO' } as any,
        userEmp1,
      );

      expect(prisma.budgetRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'req-1' },
          data: expect.objectContaining({
            precio_ajustado: expect.any(Object),
            notas_admin: 'Ajuste por falla leve',
            estado: 'CONFIRMADO',
          }),
        }),
      );
      expect(result.estado).toBe('CONFIRMADO');
    });
  });

  describe('convertToRepair', () => {
    it('should create (or reuse) a client, create a repair and mark CONVERTIDO', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);
      prisma.$transaction.mockImplementation(async (fn) => fn(prisma));

      const newClient = { id: 'client-1', nombre_completo: 'Juan Pérez', telefono: '541100000000', empresa_id: 'emp-1' };
      const newRepair = {
        id: 'repair-1',
        numero_reparacion: 'REQ-20260816-0001',
        cliente_id: 'client-1',
        empresa_id: 'emp-1',
      };

      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue(newClient);
      prisma.repair.create.mockResolvedValue(newRepair);
      prisma.budgetRequest.update.mockResolvedValue({ ...request, estado: 'CONVERTIDO', repair_id: 'repair-1' });

      const result = await service.convertToRepair('req-1', userEmp1);

      expect(prisma.client.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ nombre_completo: 'Juan Pérez' }) }),
      );
      expect(prisma.repair.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            numero_reparacion: 'REQ-20260816-0001',
            cliente_id: 'client-1',
            estado: 'INGRESADO',
            prioridad: 'medium',
            tiene_garantia: true,
            garantia_duracion: 6,
            garantia_unidad: 'MESES',
          }),
        }),
      );
      expect(prisma.budgetRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'req-1' },
          data: expect.objectContaining({ estado: 'CONVERTIDO', repair_id: 'repair-1' }),
        }),
      );
      expect(result.repair).toEqual(newRepair);
    });

    it('should reuse an existing client by whatsapp', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);
      prisma.$transaction.mockImplementation(async (fn) => fn(prisma));

      const existingClient = { id: 'client-1', nombre_completo: 'Juan Pérez', telefono: '541100000000', empresa_id: 'emp-1' };
      prisma.client.findFirst.mockResolvedValue(existingClient);
      prisma.repair.create.mockResolvedValue({ id: 'repair-1' });
      prisma.budgetRequest.update.mockResolvedValue({ ...request, estado: 'CONVERTIDO', repair_id: 'repair-1' });

      await service.convertToRepair('req-1', userEmp1);

      expect(prisma.client.create).not.toHaveBeenCalled();
      expect(prisma.repair.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ cliente_id: 'client-1' }) }),
      );
    });

    it('should throw BadRequestException when already CONVERTIDO', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({ ...request, estado: 'CONVERTIDO' });

      await expect(service.convertToRepair('req-1', userEmp1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when RECHAZADO', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({ ...request, estado: 'RECHAZADO' });

      await expect(service.convertToRepair('req-1', userEmp1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmPublic', () => {
    const pricedRequest = { ...request, precio_ajustado: '400000' };

    it('should mark the request as CONFIRMADO when there is a cost', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(pricedRequest);
      prisma.budgetRequest.update.mockResolvedValue({ ...pricedRequest, estado: 'CONFIRMADO' });
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.confirmPublic('REQ-20260816-0001');

      expect(prisma.budgetRequest.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'req-1' },
          data: expect.objectContaining({ estado: 'CONFIRMADO' }),
        }),
      );
      expect(result.estado).toBe('CONFIRMADO');
    });

    it('should throw BadRequestException when there is no cost yet', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({ ...request, precio_ofertado: null, precio_ajustado: null });

      await expect(service.confirmPublic('REQ-20260816-0001')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when already CONVERTIDO', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({ ...pricedRequest, estado: 'CONVERTIDO' });

      await expect(service.confirmPublic('REQ-20260816-0001')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when it does not exist', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(null);

      await expect(service.confirmPublic('REQ-9999-0001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelPublic', () => {
    it('should delete the request and return a message', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(request);
      prisma.budgetRequest.delete.mockResolvedValue(request);
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.cancelPublic('REQ-20260816-0001');

      expect(prisma.budgetRequest.delete).toHaveBeenCalledWith({ where: { id: 'req-1' } });
      expect(result).toEqual({ message: 'Reserva cancelada correctamente' });
    });

    it('should throw BadRequestException when already CONVERTIDO', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({ ...request, estado: 'CONVERTIDO' });

      await expect(service.cancelPublic('REQ-20260816-0001')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when it does not exist', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(null);

      await expect(service.cancelPublic('REQ-9999-0001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByOrderNumber', () => {
    it('should return the public status incl. linked repair', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue({
        ...request,
        repair: { numero_reparacion: 'REQ-20260816-0001', estado: 'EN_REPARACION' },
      });

      const result = await service.findByOrderNumber('REQ-20260816-0001');

      expect(result.numero).toBe('REQ-20260816-0001');
      expect(result.estado).toBe('PENDIENTE');
      expect(result.repair).toEqual({ numero_reparacion: 'REQ-20260816-0001', estado: 'EN_REPARACION' });
    });

    it('should throw NotFoundException when it does not exist', async () => {
      prisma.budgetRequest.findUnique.mockResolvedValue(null);

      await expect(service.findByOrderNumber('REQ-9999-0001')).rejects.toThrow(NotFoundException);
    });
  });
});