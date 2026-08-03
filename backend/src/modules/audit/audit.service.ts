import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    empresa_id?: string;
    usuario_id?: string;
    entidad?: string;
  }) {
    const { page = 1, limit = 50, empresa_id, usuario_id, entidad } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (empresa_id) where.empresa_id = empresa_id;
    if (usuario_id) where.usuario_id = usuario_id;
    if (entidad) where.entidad = entidad;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
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
      }),
      this.prisma.auditLog.count({ where }),
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

  async getStats(empresa_id?: string) {
    const where: any = {};
    if (empresa_id) where.empresa_id = empresa_id;

    const [total, byEntidad, byUsuario] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['entidad'],
        where,
        _count: true,
        orderBy: { _count: { entidad: 'desc' } },
      }),
      this.prisma.auditLog.groupBy({
        by: ['usuario_id'],
        where,
        _count: true,
        orderBy: { _count: { usuario_id: 'desc' } },
      }),
    ]);

    return {
      total,
      byEntidad,
      byUsuario,
    };
  }
}
