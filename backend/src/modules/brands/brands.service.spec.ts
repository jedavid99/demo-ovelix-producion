import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { PrismaService } from '../../database/prisma.service';

describe('BrandsService', () => {
  let service: BrandsService;
  let prisma: any;

  const mockBrand = { id: 'brand-1', nombre: 'Samsung', empresa_id: 'emp-1' };

  beforeEach(async () => {
    prisma = {
      brand: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      repair: {
        count: jest.fn(),
      },
      stockItem: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  describe('findAll', () => {
    it('filtra por empresa_id', async () => {
      prisma.brand.findMany.mockResolvedValue([mockBrand]);

      await service.findAll('emp-1');

      expect(prisma.brand.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { empresa_id: 'emp-1' } }),
      );
    });

    it('filtra por search de forma insensible a mayúsculas', async () => {
      prisma.brand.findMany.mockResolvedValue([mockBrand]);

      await service.findAll('emp-1', 'sam');

      expect(prisma.brand.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            empresa_id: 'emp-1',
            nombre: { contains: 'sam', mode: 'insensitive' },
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('lanza NotFound si la marca no existe', async () => {
      prisma.brand.findUnique.mockResolvedValue(null);

      await expect(service.findOne('brand-1', 'emp-1')).rejects.toThrow(NotFoundException);
    });

    it('lanza Forbidden si la marca es de otra empresa', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);

      await expect(service.findOne('brand-1', 'emp-OTHER')).rejects.toThrow(ForbiddenException);
    });

    it('devuelve la marca si pertenece a la empresa', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);

      await expect(service.findOne('brand-1', 'emp-1')).resolves.toEqual(mockBrand);
    });
  });

  describe('create', () => {
    it('lanza Conflict si ya existe una marca con el mismo nombre en la empresa', async () => {
      prisma.brand.findFirst.mockResolvedValue(mockBrand);
      const currentUser = { id: 'u1', empresa_id: 'emp-1' };

      await expect(
        service.create({ nombre: 'Samsung' } as any, currentUser),
      ).rejects.toThrow(ConflictException);
    });

    it('crea la marca con la empresa_id del usuario', async () => {
      prisma.brand.findFirst.mockResolvedValue(null);
      prisma.brand.create.mockResolvedValue(mockBrand);
      const currentUser = { id: 'u1', empresa_id: 'emp-1' };

      const result = await service.create({ nombre: 'Apple' } as any, currentUser);

      expect(prisma.brand.create).toHaveBeenCalledWith({
        data: { nombre: 'Apple', empresa_id: 'emp-1' },
      });
      expect(result).toEqual(mockBrand);
    });
  });

  describe('update', () => {
    it('lanza Forbidden si la marca no pertenece a la empresa', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      const currentUser = { id: 'u1', empresa_id: 'emp-OTHER' };

      await expect(
        service.update('brand-1', { nombre: 'Xiaomi' } as any, currentUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza Conflict si el nuevo nombre colisiona con otra marca', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.brand.findFirst.mockResolvedValue({ id: 'brand-2', nombre: 'Xiaomi' });
      const currentUser = { id: 'u1', empresa_id: 'emp-1' };

      await expect(
        service.update('brand-1', { nombre: 'Xiaomi' } as any, currentUser),
      ).rejects.toThrow(ConflictException);
    });

    it('actualiza la marca correctamente', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.brand.findFirst.mockResolvedValue(null);
      prisma.brand.update.mockResolvedValue({ ...mockBrand, nombre: 'Samsung Mobile' });
      const currentUser = { id: 'u1', empresa_id: 'emp-1' };

      const result = await service.update('brand-1', { nombre: 'Samsung Mobile' } as any, currentUser);

      expect(prisma.brand.update).toHaveBeenCalledWith({
        where: { id: 'brand-1' },
        data: { nombre: 'Samsung Mobile' },
      });
      expect(result.nombre).toBe('Samsung Mobile');
    });
  });

  describe('remove', () => {
    it('lanza Conflict si la marca está en uso en reparaciones', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.repair.count.mockResolvedValue(3);
      prisma.stockItem.count.mockResolvedValue(0);

      await expect(service.remove('brand-1', 'emp-1')).rejects.toThrow(ConflictException);
    });

    it('lanza Conflict si la marca está en uso en stock', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.repair.count.mockResolvedValue(0);
      prisma.stockItem.count.mockResolvedValue(2);

      await expect(service.remove('brand-1', 'emp-1')).rejects.toThrow(ConflictException);
    });

    it('elimina la marca si no está en uso', async () => {
      prisma.brand.findUnique.mockResolvedValue(mockBrand);
      prisma.repair.count.mockResolvedValue(0);
      prisma.stockItem.count.mockResolvedValue(0);
      prisma.brand.delete.mockResolvedValue(mockBrand);

      const result = await service.remove('brand-1', 'emp-1');

      expect(prisma.brand.delete).toHaveBeenCalledWith({ where: { id: 'brand-1' } });
      expect(result.message).toBe('Marca eliminada correctamente');
    });
  });
});
