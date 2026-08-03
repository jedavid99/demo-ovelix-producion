import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../database/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      review: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
      },
      client: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  describe('create', () => {
    const reviewData = {
      cliente_id: 'client-1',
      entidad: 'REPARACION',
      entidad_id: 'repair-1',
      puntuacion: 5,
      comentario: 'Excelente servicio',
    };

    it('lanza NotFound si el cliente no pertenece a la empresa (no-dev)', async () => {
      prisma.client.findFirst.mockResolvedValue(null);
      const currentUser = { id: 'u1', rol: 'ADMIN', empresa_id: 'emp-1' };

      await expect(service.create(reviewData as any, currentUser)).rejects.toThrow(NotFoundException);

      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: { id: 'client-1', empresa_id: 'emp-1' },
        select: { id: true },
      });
    });

    it('DEV crea la review sin filtro de empresa', async () => {
      prisma.client.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.review.create.mockResolvedValue({ id: 'review-1', ...reviewData });
      const currentUser = { id: 'u-dev', rol: 'DESARROLLADOR', empresa_id: 'emp-1' };

      await service.create(reviewData as any, currentUser);

      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        select: { id: true },
      });
    });

    it('guarda la puntuación y el comentario', async () => {
      prisma.client.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.review.create.mockResolvedValue({ id: 'review-1', ...reviewData });
      const currentUser = { id: 'u1', rol: 'ADMIN', empresa_id: 'emp-1' };

      const result = await service.create(reviewData as any, currentUser);

      expect(prisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cliente_id: 'client-1',
            entidad: 'REPARACION',
            entidad_id: 'repair-1',
            puntuacion: 5,
            comentario: 'Excelente servicio',
          }),
        }),
      );
      expect(result.puntuacion).toBe(5);
    });
  });

  describe('findAll', () => {
    it('devuelve { data, meta } con paginación', async () => {
      prisma.review.findMany.mockResolvedValue([{ id: 'r1' }, { id: 'r2' }]);
      prisma.review.count.mockResolvedValue(10);

      const result = await service.findAll({ page: 2, limit: 2 });

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 2, take: 2 }),
      );
      expect(result).toEqual({
        data: [{ id: 'r1' }, { id: 'r2' }],
        meta: { total: 10, page: 2, limit: 2, totalPages: 5 },
      });
    });

    it('filtra por entidad', async () => {
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.count.mockResolvedValue(0);

      await service.findAll({ entidad: 'REPARACION' });

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { entidad: 'REPARACION' } }),
      );
    });

    it('filtra por empresa vía el cliente', async () => {
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.count.mockResolvedValue(0);

      await service.findAll({ empresa_id: 'emp-1' });

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { cliente: { empresa_id: 'emp-1' } } }),
      );
    });
  });
});
