import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;

  const notification = {
    id: 'notif-1',
    usuario_id: 'user-1',
    tipo: 'reparacion_completada',
    titulo: 'Reparación completada',
    mensaje: 'Reparación R-001 está lista',
    leida: false,
    created_at: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('create', () => {
    it('should create a notification with the provided data', async () => {
      const dto = {
        usuario_id: 'user-1',
        tipo: 'whatsapp' as const,
        titulo: 'Nuevo mensaje de WhatsApp',
        mensaje: 'Hola',
      };
      prisma.notification.create.mockResolvedValue({ id: 'notif-1', ...dto });

      const result = await service.create(dto);

      expect(prisma.notification.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe('notif-1');
    });
  });

  describe('findByUser', () => {
    it('should return notifications for the user ordered by created_at desc, limited to 50', async () => {
      prisma.notification.findMany.mockResolvedValue([notification]);

      const result = await service.findByUser('user-1');

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 'user-1' },
        orderBy: { created_at: 'desc' },
        take: 50,
      });
      expect(result).toEqual([notification]);
    });

    it('should filter by leida: false when unreadOnly is true', async () => {
      prisma.notification.findMany.mockResolvedValue([notification]);

      const result = await service.findByUser('user-1', true);

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { usuario_id: 'user-1', leida: false },
        orderBy: { created_at: 'desc' },
        take: 50,
      });
      expect(result).toEqual([notification]);
    });
  });

  describe('markAsRead', () => {
    it('should mark the notification as read scoped to the owning user', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead('notif-1', 'user-1');

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 'notif-1', usuario_id: 'user-1' },
        data: { leida: true },
      });
      expect(result).toEqual({ count: 1 });
    });

    it('should match 0 rows when the notification belongs to another user', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.markAsRead('notif-1', 'user-2');

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 'notif-1', usuario_id: 'user-2' },
        data: { leida: true },
      });
      expect(result).toEqual({ count: 0 });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications of the user as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-1');

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { usuario_id: 'user-1', leida: false },
        data: { leida: true },
      });
      expect(result).toEqual({ count: 3 });
    });
  });

  describe('delete', () => {
    it('should delete the notification scoped to the owning user', async () => {
      prisma.notification.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.delete('notif-1', 'user-1');

      expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
        where: { id: 'notif-1', usuario_id: 'user-1' },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('getUnreadCount', () => {
    it('should count unread notifications for the user', async () => {
      prisma.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { usuario_id: 'user-1', leida: false },
      });
      expect(result).toBe(5);
    });
  });

  describe('notify helpers', () => {
    it('should create a whatsapp notification with client entity info', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyWhatsApp('user-1', 'Hola cliente', 'client-1');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 'user-1',
          tipo: 'whatsapp',
          titulo: 'Nuevo mensaje de WhatsApp',
          mensaje: 'Hola cliente',
          entidad_id: 'client-1',
          entidad_tipo: 'client',
        }),
      });
    });

    it('should create a stock_bajo notification with product stock info', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyStockBajo('user-1', 'Pantalla iPhone 11', 2, 5);

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 'user-1',
          tipo: 'stock_bajo',
          titulo: 'Stock bajo',
          mensaje: 'Pantalla iPhone 11 tiene 2 unidades (mínimo: 5)',
        }),
      });
    });

    it('should create a reparacion_completada notification', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyReparacionCompletada('user-1', 'R-001', 'Juan');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 'user-1',
          tipo: 'reparacion_completada',
          titulo: 'Reparación completada',
          mensaje: 'Reparación R-001 de Juan está lista para entrega',
        }),
      });
    });

    it('should create a venta_realizada notification with the amount', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyVentaRealizada('user-1', 25000, 'Ana');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 'user-1',
          tipo: 'venta_realizada',
          titulo: 'Venta realizada',
          mensaje: 'Venta por $25000 a Ana',
        }),
      });
    });

    it('should create a cierre_caja notification with the date', async () => {
      prisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await service.notifyCierreCaja('user-1', '02/08/2026');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          usuario_id: 'user-1',
          tipo: 'cierre_caja',
          titulo: 'Recordatorio de cierre de caja',
          mensaje: 'Recuerde realizar el cierre de caja de hoy (02/08/2026) a las 18:00',
        }),
      });
    });
  });
});
