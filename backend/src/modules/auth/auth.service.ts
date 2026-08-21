import { Injectable, UnauthorizedException, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { loginSchema, LoginDto } from './dto/login.dto';
import { refreshSchema, RefreshDto } from './dto/refresh.dto';
import { registerDeveloperSchema, RegisterDeveloperDto } from './dto/register-developer.dto';
import { registerCompanySchema, RegisterCompanyDto } from './dto/register-company.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { CompaniesService } from '../companies/companies.service';

// Función interna para generar código de activación
function generateActivationCode(): string {
  return 'ovelix-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private permissionsService: PermissionsService,
    private companiesService: CompaniesService,
  ) {}

  async login(data: LoginDto) {
    try {
      // Validar con Zod
      const validatedData = loginSchema.parse(data);

      let user;

      // Si no se proporciona código de empresa, buscar desarrollador global
      if (!validatedData.codigo_empresa) {
        user = await this.prisma.user.findFirst({
          where: {
            email: validatedData.email,
            rol: {
              name: 'DESARROLLADOR'
            },
            empresa_id: null,
          },
          include: {
            empresa: true,
            rol: true,
          },
        });
      } else {
        // Buscar usuario con su empresa
        user = await this.prisma.user.findFirst({
          where: {
            email: validatedData.email,
            empresa: {
              codigo_empresa: validatedData.codigo_empresa,
            },
          },
          include: {
            empresa: true,
            rol: true,
          },
        });
      }

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!user.activo) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      if (user.rol.name !== 'DESARROLLADOR' && user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Tu cuenta está pendiente de aprobación por un administrador');
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Obtener permisos del usuario
      const permissions = await this.permissionsService.getUserPermissions(user.id);

      // Generar tokens
      const tokens = await this.generateTokens(user.id, user.rol.name, user.empresa_id, permissions);

      // Guardar refresh token en BD
      await this.saveRefreshToken(user.id, tokens.refresh_token);

      // Retornar usuario sin contraseña
      const { password, ...userWithoutPassword } = user;

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error('Login error:', error.stack ?? error);
      throw error;
    }
  }

  async refresh(data: RefreshDto) {
    const validatedData = refreshSchema.parse(data);

    // Verificar refresh token en BD (almacenado hasheado)
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: { token: this.hashToken(validatedData.refresh_token) },
      include: {
        usuario: {
          include: { rol: true },
        },
      },
    }) as any;

    if (!refreshToken || !refreshToken.usuario) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (new Date() > refreshToken.expires_at) {
      await this.prisma.refreshToken.delete({ where: { id: refreshToken.id } });
      throw new UnauthorizedException('Refresh token expirado');
    }

      if (!refreshToken.usuario.activo) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      if (refreshToken.usuario.rol.name !== 'DESARROLLADOR' && refreshToken.usuario.status !== 'ACTIVE') {
        throw new UnauthorizedException('Tu cuenta está pendiente de aprobación por un administrador');
      }

      // Rotar refresh token (eliminar actual y crear nuevo)

    await this.prisma.refreshToken.delete({ where: { id: refreshToken.id } });

    // Obtener permisos del usuario
    const permissions = await this.permissionsService.getUserPermissions(refreshToken.usuario.id);

    // Generar nuevos tokens
    const tokens = await this.generateTokens(
      refreshToken.usuario.id,
      refreshToken.usuario.rol.name,
      refreshToken.usuario.empresa_id,
      permissions,
    );

    // Guardar nuevo refresh token
    await this.saveRefreshToken(refreshToken.usuario.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { usuario_id: userId },
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { empresa: true, rol: true },
    }) as any;

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async registerDeveloper(data: RegisterDeveloperDto) {
    const validatedData = registerDeveloperSchema.parse(data);

    // Verificar token de invitación (evita auto-registro de super-admins por anónimos)
    const expectedToken = this.configService.get<string>('DEV_INVITE_TOKEN');
    if (!expectedToken) {
      throw new UnauthorizedException('Registro de desarrolladores no habilitado');
    }
    if (validatedData.inviteToken !== expectedToken) {
      throw new UnauthorizedException('Token de invitación inválido');
    }

    // Verificar que no exista un desarrollador con el mismo email
    const developerRole = await this.prisma.role.findUnique({
      where: { name: 'DESARROLLADOR' },
    });

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: validatedData.email,
        rol_id: developerRole.id,
        empresa_id: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un desarrollador con ese email');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Crear desarrollador
    const developer = await this.prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        nombre: validatedData.nombre,
        apellido: validatedData.apellido,
        dni: validatedData.dni,
        telefono: validatedData.telefono,
        rol_id: developerRole.id,
        activo: true,
        empresa_id: null,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
      },
    });

    return {
      message: 'Desarrollador registrado exitosamente',
      developer,
    };
  }

  async registerCompany(data: RegisterCompanyDto & { activationCode?: string }) {
    const validatedData = registerCompanySchema.parse(data);

    const existingUser = await this.prisma.user.findFirst({
      where: { email: validatedData.admin_email as string },
    });
    if (existingUser) {
      throw new ConflictException('Ya existe un usuario registrado con ese email');
    }

    // Generar código de empresa con formato ovelix-XX
    const companyCount = await this.prisma.company.count();
    let nextNumber = companyCount + 1;
    let codigoEmpresa = `ovelix-${String(nextNumber).padStart(2, '0')}`;
    let existingCompany = await this.prisma.company.findUnique({
      where: { codigo_empresa: codigoEmpresa },
    });
    while (existingCompany) {
      nextNumber++;
      codigoEmpresa = `ovelix-${String(nextNumber).padStart(2, '0')}`;
      existingCompany = await this.prisma.company.findUnique({
        where: { codigo_empresa: codigoEmpresa },
      });
    }

    // Generar slug
    const baseSlug = validatedData.razon_social
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let existingSlug = await this.prisma.company.findUnique({ where: { slug } });
    let counter = 1;
    while (existingSlug) {
      slug = `${baseSlug}-${counter}`;
      existingSlug = await this.prisma.company.findUnique({ where: { slug } });
      counter++;
    }

    const hashedPassword = await bcrypt.hash(validatedData.admin_password, 12);

    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });

    if (!adminRole) {
      throw new ConflictException('Rol ADMIN no configurado en el sistema');
    }

    // El código de activación ya no es necesario para el registro inicial
    // pero se mantiene la generación en la tabla Company por compatibilidad si fuera necesario
    const activationCode = generateActivationCode();

    const result = await this.prisma.$transaction(async (tx) => {
      // Crear empresa con todos los campos incluyendo slug y activationCode
      const company = await tx.company.create({
        data: {
          codigo_empresa: codigoEmpresa,
          slug,
          razon_social: validatedData.razon_social,
          email: validatedData.email,
          telefono: validatedData.telefono || null,
          direccion: validatedData.direccion || null,
          ciudad: validatedData.ciudad || null,
          provincia: validatedData.provincia || null,
          codigo_postal: validatedData.codigo_postal || null,
          activationCode,
        },
      });

      const admin = await tx.user.create({
        data: {
          email: validatedData.admin_email,
          password: hashedPassword,
          nombre: validatedData.admin_nombre,
          apellido: validatedData.admin_apellido,
          dni: validatedData.admin_dni || null,
          telefono: validatedData.admin_telefono || null,
          rol_id: adminRole.id,
          empresa_id: company.id,
          activo: true,
          status: 'PENDING',
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          rol: true,
          activo: true,
        },
      });

      await this.companiesService.seedCompanyDefaults(tx, company.id);

      return { company, admin };
    });

    return {
      message: 'Empresa registrada exitosamente',
      company: result.company,
      admin: result.admin,
      activationCode,
    };
  }

  private async generateTokens(userId: string, rol: string, empresaId: string | null, permissions: string[] = []) {
    const payload = {
      sub: userId,
      rol,
      empresa_id: empresaId,
      permissions,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    await this.prisma.refreshToken.create({
      data: {
        token: this.hashToken(token),
        usuario_id: userId,
        expires_at: expiresAt,
      },
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
