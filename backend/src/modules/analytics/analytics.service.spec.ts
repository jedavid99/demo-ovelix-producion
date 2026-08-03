import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../database/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  const SYSTEM_TIME = '2026-01-15T15:00:00Z';

  const startOfToday = () => {
    const now = new Date(SYSTEM_TIME);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  beforeEach(async () => {
    prisma = {
      user: {
        count: jest.fn(),
        groupBy: jest.fn(),
      },
      company: {
        count: jest.fn(),
      },
      repair: {
        count: jest.fn(),
      },
      sale: {
        count: jest.fn(),
      },
      role: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);

    jest.useFakeTimers();
    jest.setSystemTime(new Date(SYSTEM_TIME));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockStats = () => {
    prisma.user.count.mockResolvedValue(10);
    prisma.company.count.mockResolvedValue(3);
    prisma.repair.count
      .mockResolvedValueOnce(100) // total
      .mockResolvedValueOnce(2) // today
      .mockResolvedValueOnce(4) // yesterday
      .mockResolvedValueOnce(15) // week
      .mockResolvedValueOnce(40) // month
      .mockResolvedValueOnce(1) // weekly day 1
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(7);
    prisma.sale.count
      .mockResolvedValueOnce(200) // total
      .mockResolvedValueOnce(5) // today
      .mockResolvedValueOnce(3) // yesterday
      .mockResolvedValueOnce(20) // week
      .mockResolvedValueOnce(50); // month
    prisma.user.groupBy.mockResolvedValue([
      { rol_id: 'role-admin', _count: 6 },
      { rol_id: 'role-tech', _count: 4 },
    ]);
    prisma.role.findMany.mockResolvedValue([
      { id: 'role-admin', name: 'ADMIN' },
      { id: 'role-tech', name: 'TECNICO' },
    ]);
  };

  it('should return the real counts queried from prisma (not random values)', async () => {
    mockStats();

    const result = await service.getStats();

    expect(prisma.user.count).toHaveBeenCalledWith({ where: { activo: true } });
    expect(prisma.company.count).toHaveBeenCalledWith({ where: { activo: true } });
    expect(prisma.repair.count).toHaveBeenCalledTimes(12);
    expect(prisma.sale.count).toHaveBeenCalledTimes(5);

    expect(result.users).toBe(10);
    expect(result.companies).toBe(3);
    expect(result.repairs).toBe(100);
    expect(result.sales).toBe(200);
    expect(result.salesToday).toBe(5);
    expect(result.salesYesterday).toBe(3);
    expect(result.salesWeek).toBe(20);
    expect(result.salesMonth).toBe(50);
    expect(result.repairsToday).toBe(2);
    expect(result.repairsYesterday).toBe(4);
    expect(result.repairsWeek).toBe(15);
    expect(result.repairsMonth).toBe(40);
  });

  it('should build weeklyActivity from the last 7 days using real repair counts', async () => {
    mockStats();

    const result = await service.getStats();

    expect(result.weeklyActivity).toEqual([1, 2, 3, 4, 5, 6, 7]);

    const today = startOfToday();
    const weeklyCalls = prisma.repair.count.mock.calls.slice(5, 12);
    weeklyCalls.forEach((call, i) => {
      const { gte, lt } = call[0].where.fecha_ingreso;
      const dayStart = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      expect(gte.getTime()).toBe(dayStart.getTime());
      expect(lt.getTime()).toBe(dayStart.getTime() + 24 * 60 * 60 * 1000);
    });
  });

  it('should query sales/repairs with real date ranges for today and yesterday', async () => {
    mockStats();

    await service.getStats();

    const today = startOfToday();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const saleCalls = prisma.sale.count.mock.calls;
    expect(saleCalls[0][0]).toBeUndefined();
    expect(saleCalls[1][0].where.fecha.gte.getTime()).toBe(today.getTime());
    expect(saleCalls[2][0].where.fecha.gte.getTime()).toBe(yesterday.getTime());
    expect(saleCalls[2][0].where.fecha.lt.getTime()).toBe(today.getTime());
    expect(saleCalls[3][0].where.fecha.gte.getTime()).toBe(
      new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).getTime(),
    );
    expect(saleCalls[4][0].where.fecha.gte.getTime()).toBe(monthStart.getTime());

    const repairCalls = prisma.repair.count.mock.calls;
    expect(repairCalls[0][0]).toBeUndefined();
    expect(repairCalls[1][0].where.fecha_ingreso.gte.getTime()).toBe(today.getTime());
    expect(repairCalls[2][0].where.fecha_ingreso.gte.getTime()).toBe(yesterday.getTime());
    expect(repairCalls[2][0].where.fecha_ingreso.lt.getTime()).toBe(today.getTime());
    expect(repairCalls[3][0].where.fecha_ingreso.gte.getTime()).toBe(
      new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).getTime(),
    );
    expect(repairCalls[4][0].where.fecha_ingreso.gte.getTime()).toBe(monthStart.getTime());
  });

  it('should format usersByRole with real role names and percentages', async () => {
    mockStats();

    const result = await service.getStats();

    expect(result.usersByRole).toEqual([
      { role: 'ADMIN', count: 6, percentage: 60 },
      { role: 'TECNICO', count: 4, percentage: 40 },
    ]);
  });

  it('should report logins and apiRequests as 0 (no data source)', async () => {
    mockStats();

    const result = await service.getStats();

    expect(result.loginsToday).toBe(0);
    expect(result.loginsYesterday).toBe(0);
    expect(result.loginsWeek).toBe(0);
    expect(result.loginsMonth).toBe(0);
    expect(result.apiRequestsToday).toBe(0);
    expect(result.apiRequestsYesterday).toBe(0);
    expect(result.apiRequestsWeek).toBe(0);
    expect(result.apiRequestsMonth).toBe(0);
  });

  it('should use "Unknown" role and 0% when role is not mapped or there are no users', async () => {
    prisma.user.count.mockResolvedValue(0);
    prisma.company.count.mockResolvedValue(0);
    prisma.repair.count.mockResolvedValue(0);
    prisma.sale.count.mockResolvedValue(0);
    prisma.user.groupBy.mockResolvedValue([{ rol_id: 'role-x', _count: 0 }]);
    prisma.role.findMany.mockResolvedValue([]);

    const result = await service.getStats();

    expect(result.users).toBe(0);
    expect(result.usersByRole).toEqual([{ role: 'Unknown', count: 0, percentage: 0 }]);
  });
});
