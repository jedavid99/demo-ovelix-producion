import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto, UpdateBookingEstadoDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /** Resuelve la empresa por slug público o codigo_empresa (mismo criterio que tenant-pages). */
  private async resolveCompany(slug: string) {
    const normalized = slug.toLowerCase();
    const company =
      (await this.prisma.company.findUnique({ where: { slug: normalized } })) ??
      (await this.prisma.company.findUnique({ where: { codigo_empresa: normalized } })) ??
      (await this.prisma.company.findFirst({
        where: { slug: { equals: normalized, mode: 'insensitive' }, activo: true },
      })) ??
      (await this.prisma.company.findFirst({
        where: { codigo_empresa: { equals: normalized, mode: 'insensitive' }, activo: true },
      }));

    if (!company || !company.activo) {
      throw new NotFoundException('Empresa no encontrada');
    }
    return company;
  }

  /** Endpoint público: crea una reserva sin autenticación. */
  async createPublic(data: CreateBookingDto) {
    const company = await this.resolveCompany(data.slug);

    const fecha = new Date(data.fecha);
    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    return this.prisma.booking.create({
      data: {
        empresa_id: company.id,
        nombre: data.nombre,
        email: data.email,
        whatsapp: data.whatsapp || null,
        dispositivo: data.dispositivo || null,
        servicio: data.servicio || null,
        fecha,
        horario: data.horario || null,
        notas: data.notas || null,
        estado: 'pendiente',
      },
    });
  }

  async findAll(currentUser: any, page: number = 1, limit: number = 10, filters?: { estado?: string; fecha_desde?: string; fecha_hasta?: string }) {
    const where: any = {};
    if (currentUser.rol !== 'DESARROLLADOR') {
      where.empresa_id = currentUser.empresa_id;
    }
    if (filters?.estado) {
      where.estado = filters.estado;
    }
    if (filters?.fecha_desde || filters?.fecha_hasta) {
      where.fecha = {
        ...(filters.fecha_desde ? { gte: new Date(filters.fecha_desde) } : {}),
        ...(filters.fecha_hasta ? { lte: new Date(filters.fecha_hasta) } : {}),
      };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha: 'asc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, currentUser: any) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }
    if (currentUser.rol !== 'DESARROLLADOR' && booking.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver esta reserva');
    }
    return booking;
  }

  async updateEstado(id: string, data: UpdateBookingEstadoDto, currentUser: any) {
    const booking = await this.findOne(id, currentUser);
    return this.prisma.booking.update({
      where: { id },
      data: {
        estado: data.estado,
        ...(data.notas !== undefined ? { notas: data.notas || null } : {}),
      },
    });
  }

  async remove(id: string, currentUser: any) {
    const booking = await this.findOne(id, currentUser);
    await this.prisma.booking.delete({ where: { id: booking.id } });
    return { message: 'Reserva eliminada correctamente' };
  }
}
