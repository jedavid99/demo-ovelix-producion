import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BusinessInfoService } from './business-info.service';
import { PrismaService } from '../../database/prisma.service';

describe('BusinessInfoService', () => {
  let service: BusinessInfoService;
  let prisma: any;

  const currentUser = { id: 'user-1', empresa_id: 'emp-1' };

  const existingInfo = {
    id: 'bi-1',
    empresa_id: 'emp-1',
    nombre_negocio: 'TechRepair',
    telefono: '555-1234',
  };

  const company = {
    id: 'emp-1',
    razon_social: 'TechRepair S.A.',
    telefono: '555-1234',
    email: 'info@techrepair.com',
    direccion: 'Av. Siempre Viva 123',
    ciudad: 'Buenos Aires',
    provincia: 'Buenos Aires',
    codigo_postal: '1000',
  };

  beforeEach(async () => {
    prisma = {
      businessInfo: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      company: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessInfoService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BusinessInfoService>(BusinessInfoService);
  });

  describe('get', () => {
    it('should return existing business info for the user company', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(existingInfo);

      const result = await service.get(currentUser);

      expect(prisma.businessInfo.findUnique).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
      });
      expect(result).toEqual(existingInfo);
    });

    it('should create default business info from company when none exists', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(null);
      prisma.company.findUnique.mockResolvedValue(company);
      const created = { id: 'bi-new', empresa_id: 'emp-1', nombre_negocio: 'TechRepair S.A.' };
      prisma.businessInfo.create.mockResolvedValue(created);

      const result = await service.get(currentUser);

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { id: 'emp-1' },
      });
      expect(prisma.businessInfo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'emp-1',
            nombre_negocio: 'TechRepair S.A.',
            moneda: 'ARS',
            formato_fecha: 'DD/MM/YYYY',
            zona_horaria: 'America/Argentina/Buenos_Aires',
          }),
        }),
      );
      expect(result).toEqual(created);
    });

    it('should throw NotFoundException when company does not exist', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(null);
      prisma.company.findUnique.mockResolvedValue(null);

      await expect(service.get(currentUser)).rejects.toThrow(NotFoundException);
    });

    it('should serve the second call from cache without querying prisma again', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(existingInfo);

      const first = await service.get(currentUser);
      const second = await service.get(currentUser);

      expect(first).toEqual(existingInfo);
      expect(second).toEqual(existingInfo);
      expect(prisma.businessInfo.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update existing business info and refresh the cache', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(existingInfo);
      const updated = { ...existingInfo, nombre_negocio: 'TechRepair 2.0' };
      prisma.businessInfo.update.mockResolvedValue(updated);

      const result = await service.update({ nombre_negocio: 'TechRepair 2.0' }, currentUser);

      expect(prisma.businessInfo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1' },
          data: expect.objectContaining({
            nombre_negocio: 'TechRepair 2.0',
            fecha_actualizacion: expect.any(Date),
          }),
        }),
      );
      expect(result).toEqual(updated);

      const cached = await service.get(currentUser);
      expect(cached).toEqual(updated);
      expect(prisma.businessInfo.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should create default business info merged with provided data when none exists', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(null);
      prisma.company.findUnique.mockResolvedValue(company);
      const created = { id: 'bi-new', empresa_id: 'emp-1', nombre_negocio: 'Mi Negocio' };
      prisma.businessInfo.create.mockResolvedValue(created);

      const result = await service.update(
        { nombre_negocio: 'Mi Negocio', email: 'mi@negocio.com' },
        currentUser,
      );

      expect(prisma.businessInfo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            empresa_id: 'emp-1',
            nombre_negocio: 'Mi Negocio',
            email: 'mi@negocio.com',
          }),
        }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('updateLogo', () => {
    it('should update the logo and refresh the cache', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(existingInfo);
      const updated = { ...existingInfo, logo_url: 'https://cdn/logo.png' };
      prisma.businessInfo.update.mockResolvedValue(updated);

      const result = await service.updateLogo('https://cdn/logo.png', currentUser);

      expect(prisma.businessInfo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresa_id: 'emp-1' },
          data: expect.objectContaining({
            logo_url: 'https://cdn/logo.png',
            fecha_actualizacion: expect.any(Date),
          }),
        }),
      );
      expect(result).toEqual(updated);

      const cached = await service.get(currentUser);
      expect(cached).toEqual(updated);
      expect(prisma.businessInfo.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should create the default business info before updating the logo when none exists', async () => {
      prisma.businessInfo.findUnique.mockResolvedValue(null);
      prisma.company.findUnique.mockResolvedValue(company);
      const created = { id: 'bi-new', empresa_id: 'emp-1', nombre_negocio: 'TechRepair S.A.' };
      prisma.businessInfo.create.mockResolvedValue(created);
      prisma.businessInfo.update.mockResolvedValue({ ...created, logo_url: 'https://cdn/logo.png' });

      const result = await service.updateLogo('https://cdn/logo.png', currentUser);

      expect(prisma.businessInfo.create).toHaveBeenCalled();
      expect(prisma.businessInfo.update).toHaveBeenCalled();
      expect(result.logo_url).toBe('https://cdn/logo.png');
    });
  });
});
