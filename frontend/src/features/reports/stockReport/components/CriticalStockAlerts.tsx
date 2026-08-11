import { MdWarning, MdCheckCircle, MdShoppingCart } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { Product } from '../types';

interface CriticalStockAlertsProps {
  products: Product[];
  onNavigateProviders: () => void;
}

export function CriticalStockAlerts({ products, onNavigateProviders }: CriticalStockAlertsProps) {
  return (
    <Card className={products.length > 0 ? 'border-destructive/50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MdWarning className={products.length > 0 ? 'text-destructive' : 'text-success'} />
          Alertas de Stock Crítico
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Stock actual: {product.stock} / Mínimo: {product.minStock}</p>
                </div>
                <Button onClick={onNavigateProviders} variant="outline" size="sm" className="gap-1">
                  <MdShoppingCart size={14} /> Comprar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <MdCheckCircle size={48} className="mx-auto text-success mb-3" />
            <p className="text-sm font-medium text-success">Todos los productos tienen stock suficiente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
