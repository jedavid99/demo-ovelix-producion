import { MdInventory2, MdWarning, MdShoppingCart, MdBarChart } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '../constants';

interface KpiCardsProps {
  totalItems: number;
  lowStockItems: number;
  totalInventoryValue: number;
  inventoryTurnover: number;
}

export function KpiCards({ totalItems, lowStockItems, totalInventoryValue, inventoryTurnover }: KpiCardsProps) {
  const turnoverBadgeVariant: 'success' | 'warning' | 'destructive' =
    inventoryTurnover > 2 ? 'success' : inventoryTurnover > 1 ? 'warning' : 'destructive';

  const cards = [
    { icon: MdInventory2, iconClass: 'bg-primary/10 text-primary', value: totalItems, label: 'Total de ítems en stock', valueClass: '' },
    { icon: MdWarning, iconClass: 'bg-destructive/10 text-destructive', value: lowStockItems, label: 'Ítems bajo stock mínimo', valueClass: 'text-destructive' },
    { icon: MdShoppingCart, iconClass: 'bg-emerald-500/10 text-emerald-600', value: formatCurrency(totalInventoryValue), label: 'Valor total del inventario', valueClass: '' },
    { icon: MdBarChart, iconClass: 'bg-primary/10 text-primary', value: 'Rotación', label: 'Ratio inventario/ventas', valueClass: '', badge: `${inventoryTurnover.toFixed(2)}x`, badgeVariant: turnoverBadgeVariant },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i} variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${card.iconClass}`}>
                <card.icon className="h-5 w-5" />
              </div>
              {card.badge && <Badge variant={card.badgeVariant as any} size="sm">{card.badge}</Badge>}
            </div>
            <p className={`text-2xl font-bold text-foreground ${card.valueClass}`}>{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
