export const SYSTEM_ROLES = ['DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS'] as const;

export function isSystemRoleName(name: string): boolean {
  return (SYSTEM_ROLES as readonly string[]).includes(name.toUpperCase());
}
