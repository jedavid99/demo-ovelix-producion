import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    empresa_id?: string;
    entidad?: string;
    entidad_id?: string;
  }) {
    const { page = 1, limit = 50, empresa_id, entidad, entidad_id } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (empresa_id) {
      where.cliente = { empresa_id };
    }
    if (entidad) where.entidad = entidad;
    if (entidad_id) where.entidad_id = entidad_id;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          cliente: {
            select: { id: true, nombre_completo: true, telefono: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(data: CreateReviewDto, currentUser: any) {
    const cliente = await this.prisma.client.findFirst({
      where: {
        id: data.cliente_id,
        ...(currentUser.rol !== 'DESARROLLADOR' ? { empresa_id: currentUser.empresa_id } : {}),
      },
      select: { id: true },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado en tu empresa');
    }

    return this.prisma.review.create({
      data: {
        cliente_id: data.cliente_id,
        entidad: data.entidad,
        entidad_id: data.entidad_id,
        puntuacion: data.puntuacion,
        comentario: data.comentario,
      },
      include: {
        cliente: {
          select: { id: true, nombre_completo: true, telefono: true },
        },
      },
    });
  }
}
