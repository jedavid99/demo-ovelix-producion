import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../database/prisma.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: any;

  const nonDevUser = { id: 'user-1', empresa_id: 'emp-1', rol: 'ADMIN' };
  const devUser = { id: 'user-2', empresa_id: null, rol: 'DESARROLLADOR' };

  const mockClient = {
    id: 'client-1',
    nombre_completo: 'Juan Perez',
    telefono: '123456789',
    email: 'juan@example.com',
    empresa_id: 'emp-1',
  };

  beforeEach(async () => {
    prisma = {
      client: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      repair: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  describe('findAll', () => {
    it('should filter by empresa_id for non-dev users and return paginated data', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);
      prisma.client.count.mockResolvedValue(1);

      const result = await service.findAll(nonDevUser, 1, 10);

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1' },
          skip: 0,
          take: 10,
          orderBy: { fecha_registro: 'desc' },
        }),
      );
      expect(prisma.client.count).toHaveBeenCalledWith({ where: { empresa_id: 'emp-1' } });
      expect(result).toEqual({
        data: [mockClient],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply search filter with OR across name, phone and email', async () => {
      prisma.client.findMany.mockResolvedValue([]);
      prisma.client.count.mockResolvedValue(0);

      await service.findAll(nonDevUser, 1, 10, 'juan');

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            empresa_id: 'emp-1',
            OR: [
              { nombre_completo: { contains: 'juan', mode: 'insensitive' } },
              { telefono: { contains: 'juan' } },
              { email: { contains: 'juan', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should not filter by empresa_id for developers without empresa', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);
      prisma.client.count.mockResolvedValue(1);

      const result = await service.findAll(devUser, 1, 10);

      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
      expect(result.meta.total).toBe(1);
    });

    it('should compute totalPages correctly', async () => {
      prisma.client.findMany.mockResolvedValue(Array.from({ length: 10 }, () => mockClient));
      prisma.client.count.mockResolvedValue(25);

      const result = await service.findAll(nonDevUser, 3, 10);

      expect(result.meta).toEqual({ total: 25, page: 3, limit: 10, totalPages: 3 });
      expect(prisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the client when it exists for the same company', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne('client-1', nonDevUser);

      expect(result).toEqual(mockClient);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 'client-1' } });
    });

    it('should throw NotFoundException when client does not exist', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('client-1', nonDevUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when client belongs to another company', async () => {
      prisma.client.findUnique.mockResolvedValue({ ...mockClient, empresa_id: 'emp-2' });

      await expect(service.findOne('client-1', nonDevUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException for non-dev user without empresa_id', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);

      await expect(service.findOne('client-1', { id: 'user-1', empresa_id: null, rol: 'VENTAS' })).rejects.toThrow(ForbiddenException);
    });

    it('should allow developers to see any client', async () => {
      prisma.client.findUnique.mockResolvedValue({ ...mockClient, empresa_id: 'emp-2' });

      const result = await service.findOne('client-1', devUser);

      expect(result.empresa_id).toBe('emp-2');
    });
  });

  describe('getRepairs', () => {
    it('should return repairs for the client', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      const repairs = [{ id: 'repair-1', cliente_id: 'client-1' }];
      prisma.repair.findMany.mockResolvedValue(repairs);

      const result = await service.getRepairs('client-1', nonDevUser);

      expect(prisma.repair.findMany).toHaveBeenCalledWith({
        where: { cliente_id: 'client-1' },
        orderBy: { fecha_ingreso: 'desc' },
      });
      expect(result).toEqual(repairs);
    });
  });

  describe('create', () => {
    const createDto = {
      nombre_completo: 'Juan Perez',
      telefono: '123456789',
      email: 'juan@example.com',
      direccion: 'Calle 1',
    };

    it('should assign the empresa_id from the current user', async () => {
      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue({ ...mockClient });

      await service.create(createDto, nonDevUser);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nombre_completo: 'Juan Perez',
          telefono: '123456789',
          empresa_id: 'emp-1',
          email: 'juan@example.com',
          direccion: 'Calle 1',
        }),
      });
    });

    it('should use provided empresa_id for developers without empresa', async () => {
      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue({ ...mockClient, empresa_id: 'emp-2' });

      const result = await service.create({ ...createDto, empresa_id: 'emp-2' }, devUser);

      expect(prisma.client.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ empresa_id: 'emp-2' }),
      });
      expect(result.empresa_id).toBe('emp-2');
    });

    it('should throw ForbiddenException when there is no empresa to assign', async () => {
      await expect(
        service.create(createDto, { id: 'user-1', empresa_id: null, rol: 'VENTAS' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException when a client with the same phone exists in the company', async () => {
      prisma.client.findFirst.mockResolvedValue(mockClient);

      await expect(service.create(createDto, nonDevUser)).rejects.toThrow(ConflictException);
    });

    it('should omit optional fields that are undefined', async () => {
      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.create.mockResolvedValue(mockClient);

      await service.create(
        { nombre_completo: 'Ana', telefono: '987654321' },
        nonDevUser,
      );

      const createArg = prisma.client.create.mock.calls[0][0];
      expect(createArg.data.dni).toBeUndefined();
      expect(createArg.data.notas).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when client does not exist', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.update('client-1', { nombre_completo: 'X' }, nonDevUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for a client of another company', async () => {
      prisma.client.findUnique.mockResolvedValue({ ...mockClient, empresa_id: 'emp-2' });

      await expect(service.update('client-1', { nombre_completo: 'X' }, nonDevUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException when changing phone to one already in use', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.findFirst.mockResolvedValue({ ...mockClient, id: 'client-2' });

      await expect(
        service.update('client-1', { telefono: '999999999' }, nonDevUser),
      ).rejects.toThrow(ConflictException);
    });

    it('should update the client and add fecha_actualizacion', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.findFirst.mockResolvedValue(null);
      prisma.client.update.mockResolvedValue({ ...mockClient, nombre_completo: 'Juan Carlos' });

      const result = await service.update(
        'client-1',
        { nombre_completo: 'Juan Carlos' },
        nonDevUser,
      );

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: expect.objectContaining({ nombre_completo: 'Juan Carlos' }),
      });
      const updateArg = prisma.client.update.mock.calls[0][0];
      expect(updateArg.data.fecha_actualizacion).toBeInstanceOf(Date);
      expect(result.nombre_completo).toBe('Juan Carlos');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when client does not exist', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.delete('client-1', nonDevUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for a client of another company', async () => {
      prisma.client.findUnique.mockResolvedValue({ ...mockClient, empresa_id: 'emp-2' });

      await expect(service.delete('client-1', nonDevUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when the client has active repairs', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.repair.count.mockResolvedValue(3);

      await expect(service.delete('client-1', nonDevUser)).rejects.toThrow(ForbiddenException);
    });

    it('should delete the client and return a success message', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.repair.count.mockResolvedValue(0);
      prisma.client.delete.mockResolvedValue(mockClient);

      const result = await service.delete('client-1', nonDevUser);

      expect(prisma.repair.count).toHaveBeenCalledWith({
        where: {
          cliente_id: 'client-1',
          estado: {
            notIn: ['ENTREGADO_AL_CLIENTE', 'CANCELADO_POR_CLIENTE', 'PRESUPUESTO_RECHAZADO'],
          },
        },
      });
      expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: 'client-1' } });
      expect(result).toEqual({ message: 'Cliente eliminado exitosamente' });
    });
  });

  describe('activate / deactivate', () => {
    it('should activate the client via update with estado activo', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockResolvedValue({ ...mockClient, estado: 'activo' });

      const result = await service.activate('client-1', nonDevUser);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: expect.objectContaining({ estado: 'activo' }),
      });
      expect(result.estado).toBe('activo');
    });

    it('should deactivate the client via update with estado inactivo', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockResolvedValue({ ...mockClient, estado: 'inactivo' });

      const result = await service.deactivate('client-1', nonDevUser);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: expect.objectContaining({ estado: 'inactivo' }),
      });
      expect(result.estado).toBe('inactivo');
    });
  });
});
