import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { PrismaService } from '../../database/prisma.service';

describe('AuditService', () => {
  let service: AuditService;
  let prisma: any;

  const mockLogs = [
    {
      id: 'log-1',
      usuario_id: 'user-1',
      accion: 'CREATE',
      entidad: 'Cliente',
      entidad_id: 'client-1',
      datos_antiguos: null,
      datos_nuevos: { nombre: 'Juan' },
      fecha: new Date('2024-01-15T10:00:00.000Z'),
      empresa_id: 'emp-1',
    },
  ];

  beforeEach(async () => {
    prisma = {
      auditLog: {
        findMany: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  describe('findAll', () => {
    it('should return paginated logs with meta', async () => {
      prisma.auditLog.findMany.mockResolvedValue(mockLogs);
      prisma.auditLog.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellido: true,
            },
          },
          empresa: {
            select: {
              id: true,
              codigo_empresa: true,
              razon_social: true,
            },
          },
        },
        orderBy: { fecha: 'desc' },
      });
      expect(result).toEqual({
        data: mockLogs,
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should apply default pagination values', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      prisma.auditLog.count.mockResolvedValue(0);

      await service.findAll({});

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 50 }),
      );
    });

    it('should filter by empresa_id, usuario_id and entidad', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      prisma.auditLog.count.mockResolvedValue(0);

      await service.findAll({
        empresa_id: 'emp-1',
        usuario_id: 'user-1',
        entidad: 'Cliente',
      });

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            empresa_id: 'emp-1',
            usuario_id: 'user-1',
            entidad: 'Cliente',
          },
        }),
      );
      expect(prisma.auditLog.count).toHaveBeenCalledWith({
        where: {
          empresa_id: 'emp-1',
          usuario_id: 'user-1',
          entidad: 'Cliente',
        },
      });
    });

    it('should compute totalPages correctly', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      prisma.auditLog.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.meta).toEqual({ total: 25, page: 2, limit: 10, totalPages: 3 });
    });
  });

  describe('getStats', () => {
    it('should return totals, byEntidad and byUsuario', async () => {
      prisma.auditLog.count.mockResolvedValue(5);
      prisma.auditLog.groupBy
        .mockResolvedValueOnce([{ entidad: 'Cliente', _count: 3 }])
        .mockResolvedValueOnce([{ usuario_id: 'user-1', _count: 5 }]);

      const result = await service.getStats('emp-1');

      expect(prisma.auditLog.count).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
      });
      expect(prisma.auditLog.groupBy).toHaveBeenCalledWith({
        by: ['entidad'],
        where: { empresa_id: 'emp-1' },
        _count: true,
        orderBy: { _count: { entidad: 'desc' } },
      });
      expect(prisma.auditLog.groupBy).toHaveBeenCalledWith({
        by: ['usuario_id'],
        where: { empresa_id: 'emp-1' },
        _count: true,
        orderBy: { _count: { usuario_id: 'desc' } },
      });
      expect(result).toEqual({
        total: 5,
        byEntidad: [{ entidad: 'Cliente', _count: 3 }],
        byUsuario: [{ usuario_id: 'user-1', _count: 5 }],
      });
    });

    it('should omit empresa filter when not provided', async () => {
      prisma.auditLog.count.mockResolvedValue(0);
      prisma.auditLog.groupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await service.getStats();

      expect(prisma.auditLog.count).toHaveBeenCalledWith({ where: {} });
      expect(prisma.auditLog.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });
  });
});
