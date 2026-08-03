import { Controller, Get, Put, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { PERMISSIONS } from './permissions.constants';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Permisos')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    private prisma: PrismaService,
  ) {}

  private async assertCanManageUser(userId: string, req: any): Promise<void> {
    // Desarrollador puede gestionar permisos de cualquier usuario
    if (req.user.rol === 'DESARROLLADOR') return;

    const hasPermission = await this.permissionsService.hasPermission(
      req.user.id,
      PERMISSIONS.USERS_MANAGE_PERMISSIONS,
    );
    if (!hasPermission) {
      throw new ForbiddenException('No tienes permiso para gestionar permisos de usuarios');
    }

    // El usuario objetivo debe pertenecer a la misma empresa
    const target = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { empresa_id: true },
    });
    if (!target) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (target.empresa_id !== req.user.empresa_id) {
      throw new ForbiddenException('No puedes gestionar permisos de usuarios de otra empresa');
    }
  }

  /**
   * Obtiene todos los permisos disponibles
   */
  @ApiOperation({ summary: 'Obtener todos los permisos disponibles' })
  @Get('all')
  async getAllPermissions(@Request() req) {
    const isAdmin = req.user.rol === 'DESARROLLADOR' || req.user.rol === 'ADMIN';
    const hasPermission = await this.permissionsService.hasPermission(
      req.user.id,
      PERMISSIONS.USERS_MANAGE_PERMISSIONS,
    );
    if (!isAdmin && !hasPermission) {
      throw new ForbiddenException('No tienes permiso para ver el catálogo de permisos');
    }
    return {
      permissions: this.permissionsService.getAllPermissions(),
      grouped: this.permissionsService.getPermissionsByCategory(),
    };
  }

  /**
   * Obtiene los permisos del usuario actual
   */
  @ApiOperation({ summary: 'Obtener los permisos del usuario actual' })
  @Get('my-permissions')
  async getMyPermissions(@Request() req) {
    const permissions = await this.permissionsService.getUserPermissions(req.user.id);
    return {
      userId: req.user.id,
      permissions,
    };
  }

  /**
   * Obtiene los permisos de un usuario específico
   */
  @ApiOperation({ summary: 'Obtener los permisos de un usuario específico' })
  @Get('user/:userId')
  async getUserPermissions(@Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string, @Request() req) {
    await this.assertCanManageUser(userId, req);
    const permissions = await this.permissionsService.getUserPermissions(userId);
    return {
      userId,
      permissions,
    };
  }

  /**
   * Actualiza los permisos de un usuario específico
   */
  @ApiOperation({ summary: 'Actualizar los permisos de un usuario específico' })
  @Put('user/:userId')
  async updateUserPermissions(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() body: { permissions: string[] },
    @Request() req,
  ) {
    await this.assertCanManageUser(userId, req);

    return await this.permissionsService.updateUserPermissions(userId, body.permissions);
  }

  /**
   * Resetea los permisos de un usuario a los de su rol por defecto
   */
  @ApiOperation({ summary: 'Resetear los permisos de un usuario a los de su rol' })
  @Put('user/:userId/reset')
  async resetUserPermissions(@Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string, @Request() req) {
    await this.assertCanManageUser(userId, req);

    return await this.permissionsService.resetUserPermissions(userId);
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico
   */
  @ApiOperation({ summary: 'Verificar si el usuario actual tiene un permiso específico' })
  @Get('check/:permission')
  async checkPermission(@Param('permission') permission: string, @Request() req) {
    const hasPermission = await this.permissionsService.hasPermission(
      req.user.id,
      permission as any,
    );
    return {
      permission,
      hasPermission,
    };
  }
}
