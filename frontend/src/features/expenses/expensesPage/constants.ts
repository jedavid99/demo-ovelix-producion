export const categoryColors: Record<string, string> = {
  Parts: 'text-primary',
  Rent: 'text-purple-500',
  Salaries: 'text-rose-500',
  Tools: 'text-amber-500',
};

export function getCategoryBadge(color: string) {
  switch (color) {
    case 'blue': return { variant: 'default' as const };
    case 'purple': return { variant: 'secondary' as const };
    case 'rose': return { variant: 'destructive' as const };
    case 'amber': return { variant: 'warning' as const };
    default: return { variant: 'outline' as const };
  }
}

export function getStatusBadge(status: string) {
  return status === 'Paid'
    ? { variant: 'success' as const }
    : { variant: 'warning' as const };
}
