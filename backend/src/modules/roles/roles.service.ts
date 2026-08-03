import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { isSystemRoleName } from './roles.constants';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return roles;
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(data: CreateRoleDto) {
    if (isSystemRoleName(data.name)) {
      throw new ForbiddenException('No se puede crear un rol del sistema');
    }

    // Verificar que el nombre no exista
    const existingRole = await this.prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new ConflictException('El nombre del rol ya existe');
    }

    const role = await this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissions || [],
      },
    });

    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Los roles del sistema no pueden renombrarse ni ceder su nombre
    if (isSystemRoleName(role.name) && data.name && data.name !== role.name) {
      throw new ForbiddenException('No se puede modificar el nombre de un rol del sistema');
    }

    if (data.name && !isSystemRoleName(role.name) && isSystemRoleName(data.name)) {
      throw new ForbiddenException('No se puede asignar el nombre de un rol del sistema');
    }

    // Si se cambia el nombre, verificar que no exista
    if (data.name && data.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: data.name },
      });

      if (existingRole) {
        throw new ConflictException('El nombre del rol ya existe');
      }
    }

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissions,
      },
    });

    return updatedRole;
  }

  async delete(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (isSystemRoleName(role.name)) {
      throw new ForbiddenException('No se puede eliminar un rol del sistema');
    }

    if (role._count.users > 0) {
      throw new ConflictException('No se puede eliminar un rol que tiene usuarios asignados');
    }

    await this.prisma.role.delete({
      where: { id },
    });

    return { message: 'Rol eliminado correctamente' };
  }
}
