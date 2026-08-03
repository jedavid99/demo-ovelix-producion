import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../../database/prisma.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
const bcrypt = require('bcrypt');

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: any;

  const mockCompany = {
    id: 'company-1',
    codigo_empresa: 'EMPRESA01',
    razon_social: 'Empresa Uno SA',
    email: 'empresa@example.com',
    activo: true,
  };

  const mockAdminRole = { id: 'role-admin', name: 'ADMIN' };

  beforeEach(async () => {
    prisma = {
      company: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
      user: {
        create: jest.fn(),
      },
      paymentMethod: {
        create: jest.fn(),
      },
      notificationPreference: {
        create: jest.fn(),
      },
      integration: {
        create: jest.fn(),
      },
      planSubscription: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  describe('findAll', () => {
    it('should return paginated data with meta when page and limit are provided', async () => {
      prisma.company.findMany.mockResolvedValue([mockCompany]);
      prisma.company.count.mockResolvedValue(25);

      const result = await service.findAll(3, 10);

      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
      expect(prisma.company.count).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockCompany],
        meta: { total: 25, page: 3, limit: 10, totalPages: 3 },
      });
    });

    it('should return the full list when pagination is not provided', async () => {
      const companies = [mockCompany, { ...mockCompany, id: 'company-2' }];
      prisma.company.findMany.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(prisma.company.count).not.toHaveBeenCalled();
      expect(prisma.company.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ select: expect.any(Object) }),
      );
      expect(result).toEqual(companies);
    });
  });

  describe('findOne', () => {
    it('should return the company when it exists', async () => {
      prisma.company.findUnique.mockResolvedValue(mockCompany);

      const result = await service.findOne('company-1');

      expect(prisma.company.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'company-1' } }),
      );
      expect(result).toEqual(mockCompany);
    });

    it('should throw NotFoundException when company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne('company-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      codigo_empresa: 'EMPRESA02',
      razon_social: 'Empresa Dos SA',
      email: 'dos@example.com',
      admin_email: 'admin@example.com',
      admin_password: 'password123',
      admin_nombre: 'Ana',
      admin_apellido: 'Lopez',
    };

    function mockSuccessfulTransaction() {
      const tx = {
        company: { create: jest.fn().mockResolvedValue(mockCompany) },
        role: { findUnique: jest.fn().mockResolvedValue(mockAdminRole) },
        user: { create: jest.fn().mockResolvedValue({ id: 'user-1', email: 'admin@example.com' }) },
        paymentMethod: { create: jest.fn().mockResolvedValue({}) },
        notificationPreference: { create: jest.fn().mockResolvedValue({}) },
        integration: { create: jest.fn().mockResolvedValue({}) },
        planSubscription: { create: jest.fn().mockResolvedValue({}) },
      };
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));
      return tx;
    }

    it('should throw ConflictException when the codigo_empresa already exists', async () => {
      prisma.company.findUnique.mockResolvedValue(mockCompany);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should create company, admin user and seed defaults in a transaction', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      const tx = mockSuccessfulTransaction();

      const result = await service.create(createDto);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(tx.company.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ codigo_empresa: 'EMPRESA02' }),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(tx.role.findUnique).toHaveBeenCalledWith({ where: { name: 'ADMIN' } });
      expect(tx.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'admin@example.com',
            rol_id: 'role-admin',
            empresa_id: 'company-1',
          }),
        }),
      );
      expect(tx.paymentMethod.create).toHaveBeenCalled();
      expect(tx.notificationPreference.create).toHaveBeenCalled();
      expect(tx.integration.create).toHaveBeenCalled();
      expect(tx.planSubscription.create).toHaveBeenCalled();
      expect(result.company).toEqual(mockCompany);
      expect(result.admin.email).toBe('admin@example.com');
    });

    it('should throw ConflictException when the ADMIN role is not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      const tx = {
        company: { create: jest.fn().mockResolvedValue(mockCompany) },
        role: { findUnique: jest.fn().mockResolvedValue(null) },
        user: { create: jest.fn() },
        paymentMethod: { create: jest.fn() },
        notificationPreference: { create: jest.fn() },
        integration: { create: jest.fn() },
        planSubscription: { create: jest.fn() },
      };
      prisma.$transaction.mockImplementation(async (callback) => callback(tx));

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      await expect(service.update('company-1', { razon_social: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when changing to an existing codigo_empresa', async () => {
      prisma.company.findUnique
        .mockResolvedValueOnce(mockCompany)
        .mockResolvedValueOnce({ ...mockCompany, id: 'company-2' });

      await expect(service.update('company-1', { codigo_empresa: 'EMPRESA03' })).rejects.toThrow(ConflictException);
    });

    it('should update the company when data is valid', async () => {
      prisma.company.findUnique.mockResolvedValue(mockCompany);
      prisma.company.update.mockResolvedValue({ ...mockCompany, razon_social: 'Nueva Razón' });

      const result = await service.update('company-1', { razon_social: 'Nueva Razón' });

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: 'company-1' },
        data: { razon_social: 'Nueva Razón' },
      });
      expect(result.razon_social).toBe('Nueva Razón');
    });
  });

  describe('activate / deactivate', () => {
    it('should activate the company via update with activo true', async () => {
      prisma.company.findUnique.mockResolvedValue(mockCompany);
      prisma.company.update.mockResolvedValue({ ...mockCompany, activo: true });

      const result = await service.activate('company-1');

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: 'company-1' },
        data: { activo: true },
      });
      expect(result.activo).toBe(true);
    });

    it('should deactivate the company via update with activo false', async () => {
      prisma.company.findUnique.mockResolvedValue(mockCompany);
      prisma.company.update.mockResolvedValue({ ...mockCompany, activo: false });

      const result = await service.deactivate('company-1');

      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: 'company-1' },
        data: { activo: false },
      });
      expect(result.activo).toBe(false);
    });
  });
});
