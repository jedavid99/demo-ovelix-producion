import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PrismaService } from '../../database/prisma.service';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: any;

  const mockRole = {
    id: 'role-1',
    name: 'SUPERVISOR',
    description: 'Rol de supervisión',
    permissions: ['repairs.view'],
    _count: { users: 0 },
  };

  beforeEach(async () => {
    prisma = {
      role: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  describe('findAll', () => {
    it('should return all roles with user counts, ordered by created_at desc', async () => {
      const roles = [mockRole, { ...mockRole, id: 'role-2', name: 'VENTAS' }];
      prisma.role.findMany.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(prisma.role.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { users: true } } },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return the role when it exists', async () => {
      prisma.role.findUnique.mockResolvedValue(mockRole);

      const result = await service.findOne('role-1');

      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        include: { _count: { select: { users: true } } },
      });
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role does not exist', async () => {
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('role-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should throw ConflictException when the role name already exists', async () => {
      prisma.role.findUnique.mockResolvedValue(mockRole);

      await expect(
        service.create({ name: 'SUPERVISOR', description: 'Dup' }),
      ).rejects.toThrow(ConflictException);
      expect(prisma.role.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when creating a system role', async () => {
      await expect(
        service.create({ name: 'TECNICO', description: 'Sistema' }),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.role.findUnique).not.toHaveBeenCalled();
      expect(prisma.role.create).not.toHaveBeenCalled();
    });

    it('should create a role with permissions defaulting to empty array', async () => {
      prisma.role.findUnique.mockResolvedValue(null);
      prisma.role.create.mockResolvedValue({ ...mockRole, name: 'CAJERO' });

      const result = await service.create({ name: 'CAJERO', description: 'Caja' });

      expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { name: 'CAJERO' } });
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          name: 'CAJERO',
          description: 'Caja',
          permissions: [],
        },
      });
      expect(result.name).toBe('CAJERO');
    });

    it('should create a role preserving the provided permissions', async () => {
      prisma.role.findUnique.mockResolvedValue(null);
      prisma.role.create.mockResolvedValue({ ...mockRole, name: 'CAJERO', permissions: ['sales.view'] });

      await service.create({
        name: 'CAJERO',
        description: 'Caja',
        permissions: ['sales.view'],
      });

      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          name: 'CAJERO',
          description: 'Caja',
          permissions: ['sales.view'],
        },
      });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when role does not exist', async () => {
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.update('role-1', { name: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when changing the name to an existing one', async () => {
      prisma.role.findUnique
        .mockResolvedValueOnce(mockRole)
        .mockResolvedValueOnce({ ...mockRole, id: 'role-2', name: 'GERENTE' });

      await expect(service.update('role-1', { name: 'GERENTE' })).rejects.toThrow(ConflictException);
    });

    it('should throw ForbiddenException when renaming a system role', async () => {
      prisma.role.findUnique.mockResolvedValue({ ...mockRole, name: 'TECNICO' });

      await expect(
        service.update('role-1', { name: 'TECNICO_2' }),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.role.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when assigning a system role name to another role', async () => {
      prisma.role.findUnique.mockResolvedValue(mockRole);

      await expect(
        service.update('role-1', { name: 'ADMIN' }),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.role.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.role.update).not.toHaveBeenCalled();
    });

    it('should update the role when data is valid', async () => {
      prisma.role.findUnique.mockResolvedValue(mockRole);
      prisma.role.update.mockResolvedValue({ ...mockRole, description: 'Nueva descripción' });

      const result = await service.update('role-1', { description: 'Nueva descripción' });

      expect(prisma.role.update).toHaveBeenCalledWith({
        where: { id: 'role-1' },
        data: {
          name: undefined,
          description: 'Nueva descripción',
          permissions: undefined,
        },
      });
      expect(result.description).toBe('Nueva descripción');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when role does not exist', async () => {
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.delete('role-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when deleting a system role', async () => {
      prisma.role.findUnique.mockResolvedValue({ ...mockRole, name: 'ADMIN' });

      await expect(service.delete('role-1')).rejects.toThrow(ForbiddenException);
      expect(prisma.role.delete).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when the role has assigned users', async () => {
      prisma.role.findUnique.mockResolvedValue({ ...mockRole, _count: { users: 2 } });

      await expect(service.delete('role-1')).rejects.toThrow(ConflictException);
      expect(prisma.role.delete).not.toHaveBeenCalled();
    });

    it('should delete the role and return a success message', async () => {
      prisma.role.findUnique.mockResolvedValue(mockRole);
      prisma.role.delete.mockResolvedValue(mockRole);

      const result = await service.delete('role-1');

      expect(prisma.role.delete).toHaveBeenCalledWith({ where: { id: 'role-1' } });
      expect(result).toEqual({ message: 'Rol eliminado correctamente' });
    });
  });
});
