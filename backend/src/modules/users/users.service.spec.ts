import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
const bcrypt = require('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;
  let permissionsService: any;

  const adminUser = {
    id: 'user-admin',
    rol: 'ADMIN',
    empresa_id: 'emp-1',
  };

  const devUser = {
    id: 'user-dev',
    rol: 'DESARROLLADOR',
    empresa_id: 'emp-1',
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
    };

    permissionsService = {
      invalidateUserPermissions: jest.fn(),
      getUserPermissions: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: PermissionsService, useValue: permissionsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('DEV ve todos los usuarios (where sin filtro)', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'u1' }]);

      await service.findAll(devUser);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('ADMIN ve solo los usuarios de su empresa', async () => {
      prisma.user.findMany.mockResolvedValue([]);

      await service.findAll(adminUser);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' } }),
      );
    });

    it('con page y limit devuelve { data, meta }', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'u1' }, { id: 'u2' }]);
      prisma.user.count.mockResolvedValue(2);

      const result = await service.findAll(adminUser, 1, 2);

      expect(prisma.user.count).toHaveBeenCalledWith({ where: { empresa_id: 'emp-1' } });
      expect(result).toEqual({
        data: [{ id: 'u1' }, { id: 'u2' }],
        meta: { total: 2, page: 1, limit: 2, totalPages: 1 },
      });
    });
  });

  describe('findOne', () => {
    it('devuelve el usuario sin password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@emp.com',
        empresa_id: 'emp-1',
      });

      const result = await service.findOne('u1', adminUser);

      expect(result.id).toBe('u1');
      expect(result).not.toHaveProperty('password');
    });

    it('lanza Forbidden si otro rol intenta ver un usuario de otra empresa', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'a@emp.com',
        empresa_id: 'emp-OTHER',
      });

      await expect(service.findOne('u1', adminUser)).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFound si el usuario no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('u1', adminUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createData = {
      email: 'new@emp.com',
      password: 'secret123',
      nombre: 'Nuevo',
      apellido: 'Usuario',
      rol: 'TECNICO',
    };

    it('ADMIN fuerza su propia empresa_id', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      prisma.role.findUnique.mockResolvedValue({ id: 'role-tecnico' });
      prisma.user.create.mockResolvedValue({ id: 'u-new' });

      await service.create(createData as any, adminUser);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'emp-1',
            rol_id: 'role-tecnico',
          }),
        }),
      );
    });

    it('asigna rol_id buscando el rol por nombre', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      prisma.role.findUnique.mockResolvedValue({ id: 'role-tecnico' });
      prisma.user.create.mockResolvedValue({ id: 'u-new' });

      await service.create(createData as any, adminUser);

      expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { name: 'TECNICO' } });
    });

    it('lanza NotFound si el rol no existe', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(service.create(createData as any, adminUser)).rejects.toThrow(NotFoundException);
    });

    it('lanza Conflict si ya existe un usuario con el mismo email en la empresa', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.create(createData as any, adminUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('no permite que un usuario cambie su propio rol', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-admin', empresa_id: 'emp-1' });

      await expect(
        service.update('user-admin', { rol: 'TECNICO' } as any, adminUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('bloquea asignar rol DESARROLLADOR a un no-dev', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u-other', empresa_id: 'emp-1' });

      await expect(
        service.update('u-other', { rol: 'DESARROLLADOR' } as any, adminUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFound si el rol no existe', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u-other', empresa_id: 'emp-1' });
      prisma.role.findUnique.mockResolvedValue(null);

      await expect(
        service.update('u-other', { rol: 'TECNICO' } as any, adminUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('invalida la caché de permisos cuando cambia el rol', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u-other',
        email: 'x@emp.com',
        empresa_id: 'emp-1',
      });
      prisma.role.findUnique.mockResolvedValue({ id: 'role-tecnico' });
      prisma.user.update.mockResolvedValue({ id: 'u-other' });

      await service.update('u-other', { rol: 'TECNICO' } as any, adminUser);

      expect(permissionsService.invalidateUserPermissions).toHaveBeenCalledWith('u-other');
      const updateCall = prisma.user.update.mock.calls[0][0];
      expect(updateCall.data.rol_id).toBe('role-tecnico');
      expect(updateCall.data.rol).toBeUndefined();
    });

    it('lanza Conflict si el email ya existe en la empresa', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u-other',
        email: 'old@emp.com',
        empresa_id: 'emp-1',
      });
      prisma.user.findFirst.mockResolvedValue({ id: 'someone-else' });

      await expect(
        service.update('u-other', { email: 'new@emp.com' } as any, adminUser),
      ).rejects.toThrow(ConflictException);
    });

    it('lanza Forbidden si intenta editar un usuario de otra empresa', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u-other',
        empresa_id: 'emp-OTHER',
      });

      await expect(
        service.update('u-other', { nombre: 'X' } as any, adminUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('changePassword', () => {
    const changeData = { currentPassword: 'oldpass', newPassword: 'newpass123' };

    it('permite a ADMIN cambiar la contraseña de otro usuario', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u-other', password: 'hashed' });
      bcrypt.hash.mockResolvedValue('new_hashed');
      prisma.user.update.mockResolvedValue({ id: 'u-other' });

      const result = await service.changePassword('u-other', changeData as any, adminUser);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u-other' },
        data: { password: 'new_hashed' },
      });
      expect(result.message).toBe('Contraseña actualizada exitosamente');
    });

    it('permite que el propio usuario cambie su contraseña', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-tecnico', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('new_hashed');
      prisma.user.update.mockResolvedValue({ id: 'user-tecnico' });

      const currentUser = { id: 'user-tecnico', rol: 'TECNICO', empresa_id: 'emp-1' };
      const result = await service.changePassword('user-tecnico', changeData as any, currentUser);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldpass', 'hashed');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-tecnico' },
        data: { password: 'new_hashed' },
      });
      expect(result.message).toBe('Contraseña actualizada exitosamente');
    });

    it('lanza Forbidden si la contraseña actual es incorrecta', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-tecnico', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      const currentUser = { id: 'user-tecnico', rol: 'TECNICO', empresa_id: 'emp-1' };

      await expect(
        service.changePassword('user-tecnico', changeData as any, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza Forbidden si un rol no autorizado cambia la contraseña de otro', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u-other', password: 'hashed' });

      const currentUser = { id: 'user-tecnico', rol: 'TECNICO', empresa_id: 'emp-1' };

      await expect(
        service.changePassword('u-other', changeData as any, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFound si el usuario no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword('nope', changeData as any, adminUser)).rejects.toThrow(NotFoundException);
    });
  });
});
