import { Test, TestingModule } from '@nestjs/testing';
import { ServerLogsService } from './server-logs.service';
import { PrismaService } from '../../database/prisma.service';

describe('ServerLogsService', () => {
  let service: ServerLogsService;
  let prisma: any;

  const mockLogs = [
    {
      id: 'log-1',
      level: 'error',
      module: 'auth',
      message: 'boom',
      timestamp: new Date('2026-01-01T00:00:00Z'),
    },
    {
      id: 'log-2',
      level: 'info',
      module: 'backups',
      message: 'ok',
      timestamp: new Date('2026-01-02T00:00:00Z'),
    },
  ];

  beforeEach(async () => {
    prisma = {
      serverLog: {
        findMany: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerLogsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ServerLogsService>(ServerLogsService);
  });

  describe('findAll', () => {
    it('should list logs with pagination meta and defaults', async () => {
      prisma.serverLog.findMany.mockResolvedValue(mockLogs);
      prisma.serverLog.count.mockResolvedValue(2);

      const result = await service.findAll({});

      expect(result.data).toEqual(mockLogs);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 100,
        totalPages: 1,
      });
      expect(prisma.serverLog.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 100,
        orderBy: { timestamp: 'desc' },
      });
      expect(prisma.serverLog.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should apply level and module filters with pagination', async () => {
      prisma.serverLog.findMany.mockResolvedValue([mockLogs[0]]);
      prisma.serverLog.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 2,
        limit: 10,
        level: 'error',
        module: 'auth',
      });

      expect(result.meta).toEqual({
        total: 1,
        page: 2,
        limit: 10,
        totalPages: 1,
      });
      expect(prisma.serverLog.findMany).toHaveBeenCalledWith({
        where: { level: 'error', module: 'auth' },
        skip: 10,
        take: 10,
        orderBy: { timestamp: 'desc' },
      });
      expect(prisma.serverLog.count).toHaveBeenCalledWith({
        where: { level: 'error', module: 'auth' },
      });
    });

    it('should compute totalPages correctly', async () => {
      prisma.serverLog.findMany.mockResolvedValue([]);
      prisma.serverLog.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(result.meta.total).toBe(25);
      expect(result.meta.totalPages).toBe(3);
    });
  });

  describe('getStats', () => {
    it('should return totals grouped by level and module', async () => {
      prisma.serverLog.count.mockResolvedValue(3);
      prisma.serverLog.groupBy
        .mockResolvedValueOnce([
          { level: 'error', _count: 2 },
          { level: 'info', _count: 1 },
        ])
        .mockResolvedValueOnce([
          { module: 'auth', _count: 2 },
          { module: 'backups', _count: 1 },
        ]);

      const result = await service.getStats();

      expect(result.total).toBe(3);
      expect(result.byLevel).toHaveLength(2);
      expect(result.byModule).toHaveLength(2);
      expect(prisma.serverLog.groupBy).toHaveBeenNthCalledWith(1, {
        by: ['level'],
        _count: true,
        orderBy: { _count: { level: 'desc' } },
      });
      expect(prisma.serverLog.groupBy).toHaveBeenNthCalledWith(2, {
        by: ['module'],
        _count: true,
        orderBy: { _count: { module: 'desc' } },
      });
    });
  });
});
