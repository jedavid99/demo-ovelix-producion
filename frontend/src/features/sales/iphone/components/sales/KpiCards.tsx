import { Smartphone, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface KpiCardsProps {
  cartCount: number;
}

export const KpiCards = ({ cartCount }: KpiCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inventario Total</p>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-2">0</p>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <TrendingUp size={16} className="text-muted-foreground" />
          <span>Sin datos</span>
        </div>
      </CardContent>
    </Card>
    <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ventas Hoy</p>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-2">0</p>
        <p className="text-muted-foreground text-sm">{cartCount} en carrito</p>
      </CardContent>
    </Card>
    <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ventas Totales</p>
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-2">$0.00</p>
        <p className="text-muted-foreground text-sm">Sin registros</p>
      </CardContent>
    </Card>
  </div>
);
