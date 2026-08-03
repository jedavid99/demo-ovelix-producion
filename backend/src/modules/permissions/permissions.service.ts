import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, Permission } from './permissions.constants';

@Injectable()
export class PermissionsService {
  private readonly permissionsCache = new Map<string, { permissions: string[]; expiresAt: number }>();
  private static readonly CACHE_TTL_MS = 30_000;

  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todos los permisos de un usuario (rol + específicos)
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const cached = this.permissionsCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.permissions;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        rol: true,
      },
    }) as any;

    if (!user) {
      return [];
    }

    // Obtener permisos del rol por defecto
    const rolePermissions = this.getRolePermissions(user.rol.name);

    // Combinar permisos del rol con permisos específicos del usuario
    // Los permisos específicos del usuario pueden agregar o quitar permisos
    const userSpecificPermissions = (user.permissions as string[]) || [];

    // Si el usuario tiene permisos específicos, usar esos como base
    // Si no, usar los permisos del rol
    const result = userSpecificPermissions.length > 0 ? userSpecificPermissions : rolePermissions;

    this.permissionsCache.set(userId, {
      permissions: result,
      expiresAt: Date.now() + PermissionsService.CACHE_TTL_MS,
    });

    return result;
  }

  /**
   * Invalida el caché de permisos de un usuario (tras cambios de rol/permisos)
   */
  invalidateUserPermissions(userId: string): void {
    this.permissionsCache.delete(userId);
  }

  /**
   * Obtiene los permisos por defecto de un rol
   */
  getRolePermissions(roleName: string): string[] {
    const roleKey = roleName.toUpperCase() as keyof typeof DEFAULT_ROLE_PERMISSIONS;
    return [...(DEFAULT_ROLE_PERMISSIONS[roleKey] || [])];
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  /**
   * Verifica si un usuario tiene alguno de los permisos especificados
   */
  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Verifica si un usuario tiene todos los permisos especificados
   */
  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Actualiza los permisos específicos de un usuario
   */
  async updateUserPermissions(userId: string, permissions: string[]): Promise<any> {
    // Validar que todos los permisos sean válidos
    const validPermissions = Object.values(PERMISSIONS);
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p as Permission));

    if (invalidPermissions.length > 0) {
      throw new ForbiddenException(`Permisos inválidos: ${invalidPermissions.join(', ')}`);
    }

    this.invalidateUserPermissions(userId);

    return await this.prisma.user.update({
      where: { id: userId },
      data: { permissions },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        permissions: true,
        rol: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * Resetea los permisos de un usuario a los de su rol por defecto
   */
  async resetUserPermissions(userId: string): Promise<any> {
    this.invalidateUserPermissions(userId);

    return await this.prisma.user.update({
      where: { id: userId },
      data: { permissions: [] },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        permissions: true,
        rol: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene todos los permisos disponibles
   */
  getAllPermissions(): string[] {
    return Object.values(PERMISSIONS);
  }

  /**
   * Obtiene permisos agrupados por categoría
   */
  getPermissionsByCategory(): Record<string, string[]> {
    const grouped: Record<string, string[]> = {
      Dashboard: [PERMISSIONS.DASHBOARD_VIEW],
      Reparaciones: [
        PERMISSIONS.REPAIRS_VIEW,
        PERMISSIONS.REPAIRS_CREATE,
        PERMISSIONS.REPAIRS_EDIT,
        PERMISSIONS.REPAIRS_DELETE,
        PERMISSIONS.REPAIRS_ASSIGN,
      ],
      Clientes: [
        PERMISSIONS.CLIENTS_VIEW,
        PERMISSIONS.CLIENTS_CREATE,
        PERMISSIONS.CLIENTS_EDIT,
        PERMISSIONS.CLIENTS_DELETE,
      ],
      Stock: [
        PERMISSIONS.STOCK_VIEW,
        PERMISSIONS.STOCK_CREATE,
        PERMISSIONS.STOCK_EDIT,
        PERMISSIONS.STOCK_DELETE,
        PERMISSIONS.STOCK_MOVEMENTS,
      ],
      Ventas: [
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        PERMISSIONS.SALES_EDIT,
        PERMISSIONS.SALES_DELETE,
      ],
      Caja: [
        PERMISSIONS.CASH_VIEW,
        PERMISSIONS.CASH_OPEN,
        PERMISSIONS.CASH_CLOSE,
      ],
      Usuarios: [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_EDIT,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.USERS_MANAGE_PERMISSIONS,
      ],
      Roles: [
        PERMISSIONS.ROLES_VIEW,
        PERMISSIONS.ROLES_CREATE,
        PERMISSIONS.ROLES_EDIT,
        PERMISSIONS.ROLES_DELETE,
      ],
      Empresas: [
        PERMISSIONS.COMPANIES_VIEW,
        PERMISSIONS.COMPANIES_CREATE,
        PERMISSIONS.COMPANIES_EDIT,
        PERMISSIONS.COMPANIES_DELETE,
      ],
      Reportes: [
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_SALES,
        PERMISSIONS.REPORTS_REPAIRS,
        PERMISSIONS.REPORTS_STOCK,
      ],
      Configuración: [
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
      ],
      Auditoría: [
        PERMISSIONS.AUDIT_VIEW,
      ],
      Desarrollador: [
        PERMISSIONS.DEVELOPER_VIEW,
        PERMISSIONS.DEVELOPER_MANAGE,
      ],
    };

    return grouped;
  }
}
