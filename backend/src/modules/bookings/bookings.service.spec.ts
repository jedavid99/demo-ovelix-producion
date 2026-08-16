import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../../database/prisma.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: any;

  const devUser = { id: 'dev-1', rol: 'DESARROLLADOR', empresa_id: null };
  const userEmp1 = { id: 'user-1', rol: 'ADMIN', empresa_id: 'emp-1' };
  const userEmp2 = { id: 'user-2', rol: 'ADMIN', empresa_id: 'emp-2' };

  const company = { id: 'company-1', slug: 'tech-reparaciones', codigo_empresa: 'EMP001', activo: true };

  const booking = {
    id: 'booking-1',
    empresa_id: 'emp-1',
    nombre: 'Juan',
    email: 'juan@mail.com',
    whatsapp: null,
    dispositivo: 'iPhone 15 Pro',
    servicio: 'Reemplazo de pantalla',
    fecha: new Date('2026-08-16T15:00:00.000Z'),
    horario: '15:00',
    estado: 'pendiente',
    notas: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      company: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
      booking: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  describe('createPublic', () => {
    const createDto = {
      slug: 'tech-reparaciones',
      nombre: 'Juan',
      email: 'juan@mail.com',
      fecha: '2026-08-16T15:00:00.000Z',
      horario: '15:00',
    };

    it('should create a pending booking for the company resolved by slug', async () => {
      prisma.company.findUnique.mockResolvedValue(company);
      prisma.booking.create.mockResolvedValue(booking);

      const result = await service.createPublic(createDto as any);

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { slug: 'tech-reparaciones' },
      });
      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'company-1',
            nombre: 'Juan',
            email: 'juan@mail.com',
            estado: 'pendiente',
          }),
        }),
      );
      expect(result).toEqual(booking);
    });

    it('should resolve the company by codigo_empresa when slug does not match', async () => {
      prisma.company.findUnique.mockImplementation(({ where }) => {
        if (where.slug) return Promise.resolve(null);
        if (where.codigo_empresa === 'emp001') return Promise.resolve(company);
        return Promise.resolve(null);
      });
      prisma.company.findFirst.mockResolvedValue(null);
      prisma.booking.create.mockResolvedValue(booking);

      await service.createPublic({ ...createDto, slug: 'EMP001' } as any);

      expect(prisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ empresa_id: 'company-1' }) }),
      );
    });

    it('should throw NotFoundException when the company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.createPublic(createDto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when the company is inactive', async () => {
      prisma.company.findUnique.mockResolvedValue({ ...company, activo: false });

      await expect(service.createPublic(createDto as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when the date is invalid', async () => {
      prisma.company.findUnique.mockResolvedValue(company);

      await expect(service.createPublic({ ...createDto, fecha: 'no-es-fecha' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should filter by company for non-dev users and return paginated results', async () => {
      prisma.booking.findMany.mockResolvedValue([booking]);
      prisma.booking.count.mockResolvedValue(1);

      const result = await service.findAll(userEmp1, 1, 10);

      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' }, skip: 0, take: 10 }),
      );
      expect(result).toEqual({
        data: [booking],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it('should not filter by company for DEV users', async () => {
      prisma.booking.findMany.mockResolvedValue([]);
      prisma.booking.count.mockResolvedValue(0);

      await service.findAll(devUser);

      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
    });

    it('should apply estado and date filters', async () => {
      prisma.booking.findMany.mockResolvedValue([]);
      prisma.booking.count.mockResolvedValue(0);

      await service.findAll(devUser, 2, 5, {
        estado: 'confirmada',
        fecha_desde: '2026-08-01',
        fecha_hasta: '2026-08-31',
      });

      expect(prisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            estado: 'confirmada',
            fecha: expect.objectContaining({ gte: expect.any(Date), lte: expect.any(Date) }),
          }),
          skip: 5,
          take: 5,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the booking for the owner company', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne('booking-1', userEmp1);

      expect(result).toEqual(booking);
    });

    it('should throw NotFoundException when the booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('booking-x', userEmp1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when the booking belongs to another company (non-dev)', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);

      await expect(service.findOne('booking-1', userEmp2)).rejects.toThrow(ForbiddenException);
    });

    it('should allow DEV users to view bookings of any company', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);

      const result = await service.findOne('booking-1', devUser);

      expect(result).toEqual(booking);
    });
  });

  describe('updateEstado', () => {
    it('should update the estado of a booking', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);
      const updated = { ...booking, estado: 'confirmada' };
      prisma.booking.update.mockResolvedValue(updated);

      const result = await service.updateEstado('booking-1', { estado: 'confirmada' } as any, userEmp1);

      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { estado: 'confirmada' },
      });
      expect(result.estado).toBe('confirmada');
    });

    it('should throw ForbiddenException for bookings of another company', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);

      await expect(
        service.updateEstado('booking-1', { estado: 'cancelada' } as any, userEmp2),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      prisma.booking.findUnique.mockResolvedValue(booking);
      prisma.booking.delete.mockResolvedValue(booking);

      const result = await service.remove('booking-1', userEmp1);

      expect(prisma.booking.delete).toHaveBeenCalledWith({ where: { id: 'booking-1' } });
      expect(result).toEqual({ message: 'Reserva eliminada correctamente' });
    });

    it('should throw NotFoundException when the booking does not exist', async () => {
      prisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.remove('booking-x', userEmp1)).rejects.toThrow(NotFoundException);
    });
  });
});
