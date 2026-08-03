import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;
  let configService: any;
  let permissionsService: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashed_password_123',
    nombre: 'Test',
    apellido: 'User',
    activo: true,
    empresa_id: 'emp-1',
    rol: { name: 'ADMIN' },
    empresa: { id: 'emp-1', codigo_empresa: 'EMPRESA01' },
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      refreshToken: {
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
    };

    configService = {
      get: jest.fn((key: string) => {
        const config = {
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          JWT_REFRESH_EXPIRES_IN: '7d',
          DEV_INVITE_TOKEN: 'valid-token',
        };
        return config[key];
      }),
    };

    permissionsService = {
      getUserPermissions: jest.fn().mockResolvedValue(['dashboard.view']),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: PermissionsService, useValue: permissionsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'correct_password',
      codigo_empresa: 'EMPRESA01',
    };

    it('should login successfully with valid credentials', async () => {
      bcrypt.compare.mockResolvedValue(true);
      prisma.user.findFirst.mockResolvedValue(mockUser);
      prisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

      const result = await service.login(loginDto);

      expect(result.access_token).toBe('mock_token');
      expect(result.refresh_token).toBe('mock_token');
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      prisma.user.findFirst.mockResolvedValue({ ...mockUser, activo: false });

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      bcrypt.compare.mockResolvedValue(false);
      prisma.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should delete all refresh tokens for the user', async () => {
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await service.logout('user-1');

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { usuario_id: 'user-1' },
      });
    });
  });

  describe('me', () => {
    it('should return user without password', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.me('user-1');

      expect(result.password).toBeUndefined();
      expect(result.id).toBe('user-1');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.me('nonexistent')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerDeveloper', () => {
    const registerDto = {
      email: 'dev@example.com',
      password: 'password123',
      nombre: 'Dev',
      apellido: 'Eloper',
      dni: '12345678',
      telefono: '123456789',
      inviteToken: 'valid-token',
    };

    it('should throw UnauthorizedException when invite token is invalid', async () => {
      const invalidDto = { ...registerDto, inviteToken: 'wrong-token' };

      await expect(service.registerDeveloper(invalidDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should register a developer successfully', async () => {
      const developerRole = { id: 'role-dev', name: 'DESARROLLADOR' };
      prisma.role.findUnique.mockResolvedValue(developerRole);
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_pwd');
      prisma.user.create.mockResolvedValue({
        id: 'dev-1',
        email: registerDto.email,
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
        rol: developerRole,
        activo: true,
      });

      const result = await service.registerDeveloper(registerDto);

      expect(result.message).toBe('Desarrollador registrado exitosamente');
      expect(result.developer.email).toBe('dev@example.com');
    });

    it('should throw ConflictException when email already exists', async () => {
      const developerRole = { id: 'role-dev', name: 'DESARROLLADOR' };
      prisma.role.findUnique.mockResolvedValue(developerRole);
      prisma.user.findFirst.mockResolvedValue(mockUser);

      await expect(service.registerDeveloper(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});
