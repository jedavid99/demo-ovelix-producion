import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ServerLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    level?: string;
    module?: string;
  }) {
    const { page = 1, limit = 100, level, module } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (level) where.level = level;
    if (module) where.module = module;

    const [logs, total] = await Promise.all([
      this.prisma.serverLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.serverLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [total, byLevel, byModule] = await Promise.all([
      this.prisma.serverLog.count(),
      this.prisma.serverLog.groupBy({
        by: ['level'],
        _count: true,
        orderBy: { _count: { level: 'desc' } },
      }),
      this.prisma.serverLog.groupBy({
        by: ['module'],
        _count: true,
        orderBy: { _count: { module: 'desc' } },
      }),
    ]);

    return {
      total,
      byLevel,
      byModule,
    };
  }
}
