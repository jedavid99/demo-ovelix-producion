import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateNotificationDto {
  usuario_id: string;
  tipo: 'whatsapp' | 'stock_bajo' | 'reparacion_completada' | 'reparacion_recibida' | 'venta_realizada' | 'cierre_caja';
  titulo: string;
  mensaje: string;
  entidad_id?: string;
  entidad_tipo?: string;
  metadata?: any;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: dto,
    });
  }

  async findByUser(usuarioId: string, unreadOnly = false) {
    const where: any = { usuario_id: usuarioId };
    if (unreadOnly) {
      where.leida = false;
    }

    return this.prisma.notification.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, usuarioId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id,
        usuario_id: usuarioId,
      },
      data: { leida: true },
    });
  }

  async markAllAsRead(usuarioId: string) {
    return this.prisma.notification.updateMany({
      where: {
        usuario_id: usuarioId,
        leida: false,
      },
      data: { leida: true },
    });
  }

  async delete(id: string, usuarioId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id,
        usuario_id: usuarioId,
      },
    });
  }

  async getUnreadCount(usuarioId: string) {
    return this.prisma.notification.count({
      where: {
        usuario_id: usuarioId,
        leida: false,
      },
    });
  }

  // Métodos para crear notificaciones específicas
  async notifyWhatsApp(usuarioId: string, mensaje: string, clienteId?: string) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'whatsapp',
      titulo: 'Nuevo mensaje de WhatsApp',
      mensaje,
      entidad_id: clienteId,
      entidad_tipo: 'client',
    });
  }

  async notifyStockBajo(usuarioId: string, producto: string, stockActual: number, stockMinimo: number) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'stock_bajo',
      titulo: 'Stock bajo',
      mensaje: `${producto} tiene ${stockActual} unidades (mínimo: ${stockMinimo})`,
    });
  }

  async notifyReparacionCompletada(usuarioId: string, numeroReparacion: string, cliente: string) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'reparacion_completada',
      titulo: 'Reparación completada',
      mensaje: `Reparación ${numeroReparacion} de ${cliente} está lista para entrega`,
    });
  }

  async notifyReparacionRecibida(usuarioId: string, numeroReparacion: string, cliente: string) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'reparacion_recibida',
      titulo: 'Nueva reparación recibida',
      mensaje: `Reparación ${numeroReparacion} de ${cliente} ha sido recibida`,
    });
  }

  async notifyVentaRealizada(usuarioId: string, monto: number, cliente?: string) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'venta_realizada',
      titulo: 'Venta realizada',
      mensaje: `Venta por $${monto} ${cliente ? `a ${cliente}` : ''}`,
    });
  }

  async notifyCierreCaja(usuarioId: string, fecha: string) {
    return this.create({
      usuario_id: usuarioId,
      tipo: 'cierre_caja',
      titulo: 'Recordatorio de cierre de caja',
      mensaje: `Recuerde realizar el cierre de caja de hoy (${fecha}) a las 18:00`,
    });
  }
}
