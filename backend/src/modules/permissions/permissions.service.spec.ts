import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../../database/prisma.service';
import { PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from './permissions.constants';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  describe('getUserPermissions', () => {
    it('devuelve los permisos específicos del usuario si los tiene', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        permissions: [PERMISSIONS.DASHBOARD_VIEW, 'custom.view'],
        rol: { name: 'ADMIN' },
      });

      const result = await service.getUserPermissions('u1');

      expect(result).toEqual([PERMISSIONS.DASHBOARD_VIEW, 'custom.view']);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        include: { rol: true },
      });
    });

    it('usa los permisos del rol por defecto si no tiene específicos', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        permissions: [],
        rol: { name: 'ADMIN' },
      });

      const result = await service.getUserPermissions('u1');

      expect(result).toEqual([...DEFAULT_ROLE_PERMISSIONS.ADMIN]);
      expect(result).toContain(PERMISSIONS.DASHBOARD_VIEW);
    });

    it('usa la caché: una segunda llamada no vuelve a consultar prisma', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
        rol: { name: 'ADMIN' },
      });

      const first = await service.getUserPermissions('u1');
      const second = await service.getUserPermissions('u1');

      expect(first).toEqual(second);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('devuelve [] si el usuario no existe', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserPermissions('nope')).resolves.toEqual([]);
    });
  });

  describe('updateUserPermissions', () => {
    it('lanza ForbiddenException con permisos inválidos', async () => {
      await expect(
        service.updateUserPermissions('u1', ['invalid.perm']),
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('invalida la caché y actualiza los permisos', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        permissions: [PERMISSIONS.DASHBOARD_VIEW],
        rol: { name: 'ADMIN' },
      });
      prisma.user.update.mockResolvedValue({
        id: 'u1',
        permissions: [PERMISSIONS.CASH_VIEW],
      });

      await service.getUserPermissions('u1');
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);

      await service.updateUserPermissions('u1', [PERMISSIONS.CASH_VIEW]);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { permissions: [PERMISSIONS.CASH_VIEW] },
        select: expect.any(Object),
      });

      // la caché fue invalidada → nueva consulta a prisma
      await service.getUserPermissions('u1');
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('resetUserPermissions', () => {
    it('invalida la caché y limpia los permisos', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        permissions: [PERMISSIONS.CASH_VIEW],
        rol: { name: 'ADMIN' },
      });
      prisma.user.update.mockResolvedValue({ id: 'u1', permissions: [] });

      await service.getUserPermissions('u1');
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);

      await service.resetUserPermissions('u1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { permissions: [] },
        select: expect.any(Object),
      });

      await service.getUserPermissions('u1');
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllPermissions / getPermissionsByCategory / getRolePermissions', () => {
    it('getAllPermissions devuelve todos los permisos disponibles', () => {
      expect(service.getAllPermissions()).toEqual(Object.values(PERMISSIONS));
    });

    it('getPermissionsByCategory agrupa los permisos por categoría', () => {
      const grouped = service.getPermissionsByCategory();

      expect(grouped.Dashboard).toEqual([PERMISSIONS.DASHBOARD_VIEW]);
      expect(grouped['Desarrollador']).toEqual([
        PERMISSIONS.DEVELOPER_VIEW,
        PERMISSIONS.DEVELOPER_MANAGE,
      ]);
    });

    it('getRolePermissions devuelve los permisos por defecto de un rol', () => {
      expect(service.getRolePermissions('admin')).toEqual([
        ...DEFAULT_ROLE_PERMISSIONS.ADMIN,
      ]);
      expect(service.getRolePermissions('NO_EXISTE')).toEqual([]);
    });
  });
});
