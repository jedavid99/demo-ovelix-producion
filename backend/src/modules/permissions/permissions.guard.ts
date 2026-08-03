import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS } from './permissions.constants';

export const PERMISSIONS_KEY = 'permissions';
export const REQUIRE_ALL_PERMISSIONS_KEY = 'requireAll';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // No se requieren permisos específicos
    }

    const requireAll = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_ALL_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    ) || false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const userPermissions = user.permissions || [];

    if (requireAll) {
      // Requiere TODOS los permisos especificados
      const hasAll = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
      if (!hasAll) {
        throw new ForbiddenException(
          `No tienes todos los permisos requeridos: ${requiredPermissions.join(', ')}`,
        );
      }
      return true;
    } else {
      // Requiere AL MENOS UNO de los permisos especificados
      const hasAny = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );
      if (!hasAny) {
        throw new ForbiddenException(
          `No tienes ninguno de los permisos requeridos: ${requiredPermissions.join(', ')}`,
        );
      }
      return true;
    }
  }
}

// Decorador para requerir permisos específicos (al menos uno)
export const RequirePermissions = (...permissions: string[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
    Reflect.defineMetadata(REQUIRE_ALL_PERMISSIONS_KEY, false, descriptor.value);
    return descriptor;
  };
};

// Decorador para requerir TODOS los permisos especificados
export const RequireAllPermissions = (...permissions: string[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor.value);
    Reflect.defineMetadata(REQUIRE_ALL_PERMISSIONS_KEY, true, descriptor.value);
    return descriptor;
  };
};
