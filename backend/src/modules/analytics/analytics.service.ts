import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      users,
      companies,
      repairs,
      sales,
      usersByRole,
      salesToday,
      salesYesterday,
      salesWeek,
      salesMonth,
      repairsToday,
      repairsYesterday,
      repairsWeek,
      repairsMonth,
    ] = await Promise.all([
      this.prisma.user.count({ where: { activo: true } }),
      this.prisma.company.count({ where: { activo: true } }),
      this.prisma.repair.count(),
      this.prisma.sale.count(),
      this.prisma.user.groupBy({
        by: ['rol_id'],
        _count: true,
      }),
      this.prisma.sale.count({ where: { fecha: { gte: startOfToday } } }),
      this.prisma.sale.count({ where: { fecha: { gte: startOfYesterday, lt: startOfToday } } }),
      this.prisma.sale.count({ where: { fecha: { gte: startOfWeek } } }),
      this.prisma.sale.count({ where: { fecha: { gte: startOfMonth } } }),
      this.prisma.repair.count({ where: { fecha_ingreso: { gte: startOfToday } } }),
      this.prisma.repair.count({ where: { fecha_ingreso: { gte: startOfYesterday, lt: startOfToday } } }),
      this.prisma.repair.count({ where: { fecha_ingreso: { gte: startOfWeek } } }),
      this.prisma.repair.count({ where: { fecha_ingreso: { gte: startOfMonth } } }),
    ]);

    // Actividad semanal: reparaciones por día (últimos 7 días)
    const weeklyActivity = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const dayStart = new Date(startOfToday.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        return this.prisma.repair.count({
          where: { fecha_ingreso: { gte: dayStart, lt: dayEnd } },
        });
      }),
    );

    // Get role names for users by role
    const roles = await this.prisma.role.findMany();
    const roleMap = new Map(roles.map(r => [r.id, r.name]));

    const usersByRoleFormatted = usersByRole.map(item => {
      const roleName = roleMap.get(item.rol_id) || 'Unknown';
      const percentage = users > 0 ? Math.round((item._count / users) * 100) : 0;
      return {
        role: roleName,
        count: item._count,
        percentage,
      };
    });

    return {
      users,
      companies,
      repairs,
      sales,
      usersByRole: usersByRoleFormatted,
      weeklyActivity,
      // Métricas sin fuente de datos registrada: 0 en lugar de valores inventados
      loginsToday: 0,
      loginsYesterday: 0,
      loginsWeek: 0,
      loginsMonth: 0,
      salesToday,
      salesYesterday,
      salesWeek,
      salesMonth,
      repairsToday,
      repairsYesterday,
      repairsWeek,
      repairsMonth,
      apiRequestsToday: 0,
      apiRequestsYesterday: 0,
      apiRequestsWeek: 0,
      apiRequestsMonth: 0,
    };
  }
}
