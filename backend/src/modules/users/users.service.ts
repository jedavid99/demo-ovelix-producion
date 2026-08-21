import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private permissionsService: PermissionsService,
  ) {}

  private readonly safeUserSelect = {
    id: true,
    email: true,
    nombre: true,
    apellido: true,
    dni: true,
    telefono: true,
    activo: true,
    status: true,
    empresa_id: true,
    rol_id: true,
    permissions: true,
    created_at: true,
    updated_at: true,
    rol: { select: { id: true, name: true, description: true, permissions: true } },
  } as const;

  async findAll(currentUser: any, page?: number, limit?: number) {
    // Desarrollador: ve todos los usuarios
    // Admin: ve solo usuarios de su empresa
    // Otros roles: no tienen acceso a este endpoint (se valida en guard)
    
    const where = currentUser.rol === 'DESARROLLADOR' 
      ? {} 
      : { empresa_id: currentUser.empresa_id };

    // Para el panel de desarrollador, queremos resaltar los pendientes
    // Podemos añadir un filtro opcional o simplemente devolverlos todos
    const orderBy = { created_at: 'desc' } as const;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: this.safeUserSelect,
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.user.count({ where }),
      ]);
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    const users = await this.prisma.user.findMany({
      where,
      select: this.safeUserSelect,
      orderBy,
    });

    return users;
  }

  async findPending(currentUser: any) {
    if (currentUser.rol !== 'DESARROLLADOR' && currentUser.rol !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para ver solicitudes pendientes');
    }

    const where = currentUser.rol === 'DESARROLLADOR' 
      ? { status: 'PENDING' } 
      : { empresa_id: currentUser.empresa_id, status: 'PENDING' };

    return this.prisma.user.findMany({
      where: where as any,
      select: this.safeUserSelect,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && user.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }

    return user;
  }

  async create(data: CreateUserDto, currentUser: any) {
    const validatedData = data as any;

    // Solo Desarrollador puede crear usuarios sin empresa_id
    // Admin debe crear usuarios de su empresa
    if (currentUser.rol === 'ADMIN') {
      validatedData.empresa_id = currentUser.empresa_id;
    } else if (currentUser.rol !== 'DESARROLLADOR' as any) {
      throw new ForbiddenException('No tienes permiso para crear usuarios');
    }

    // Verificar si ya existe el email en la empresa
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: validatedData.email,
        empresa_id: validatedData.empresa_id,
      },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este email en la empresa');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Get the role by name
    const role = await this.prisma.role.findUnique({
      where: { name: validatedData.rol },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const user = await this.prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        nombre: validatedData.nombre,
        apellido: validatedData.apellido,
        dni: validatedData.dni,
        telefono: validatedData.telefono,
        rol_id: role.id,
        empresa_id: validatedData.empresa_id,
      },
      select: this.safeUserSelect,
    });

    return user;
  }

  async update(id: string, data: UpdateUserDto, currentUser: any) {
    const validatedData = data;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && user.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para editar este usuario');
    }

    // No permitir que un usuario cambie su propio rol
    if (id === currentUser.id && validatedData.rol) {
      throw new ForbiddenException('No puedes cambiar tu propio rol');
    }

    // No permitir cambiar rol a DESARROLLADOR
    if (validatedData.rol === 'DESARROLLADOR' as any && currentUser.rol !== 'DESARROLLADOR' as any) {
      throw new ForbiddenException('Solo un Desarrollador puede asignar el rol de Desarrollador');
    }

    // Si se cambia el rol, obtener el rol_id
    let updateData: any = { ...validatedData };
    if (validatedData.rol) {
      const role = await this.prisma.role.findUnique({
        where: { name: validatedData.rol },
      });
      if (!role) {
        throw new NotFoundException('Rol no encontrado');
      }
      this.permissionsService.invalidateUserPermissions(id);
      updateData.rol_id = role.id;
      delete updateData.rol;
    }

    // Si se cambia el email, verificar que no exista
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: validatedData.email,
          empresa_id: user.empresa_id,
          id: { not: id },
        },
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con este email en la empresa');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: this.safeUserSelect,
    });

    return updatedUser;
  }

  async activate(id: string, currentUser: any) {
    return this.update(id, { activo: true }, currentUser);
  }

  async deactivate(id: string, currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // No permitir desactivarse a sí mismo
    if (user.id === currentUser.id) {
      throw new ForbiddenException('No puedes desactivarte a ti mismo');
    }

    return this.update(id, { activo: false }, currentUser);
  }

  async changePassword(id: string, data: ChangePasswordDto, currentUser: any) {
    const validatedData = data;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Solo puede cambiar su propia contraseña o un admin/desarrollador puede cambiar cualquiera
    if (currentUser.id !== id && currentUser.rol !== 'ADMIN' && currentUser.rol !== 'DESARROLLADOR') {
      throw new ForbiddenException('No tienes permiso para cambiar esta contraseña');
    }

    // Si es el propio usuario, verificar contraseña actual
    if (currentUser.id === id) {
      const passwordMatch = await bcrypt.compare(validatedData.currentPassword, user.password);
      if (!passwordMatch) {
        throw new ForbiddenException('La contraseña actual es incorrecta');
      }
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'REJECTED', currentUser: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (currentUser.rol !== 'DESARROLLADOR' && currentUser.rol !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para cambiar el estado del usuario');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status },
      select: this.safeUserSelect,
    });
  }
}
