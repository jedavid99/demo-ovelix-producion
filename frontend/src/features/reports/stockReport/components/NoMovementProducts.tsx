import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { Product } from '../types';

interface NoMovementProductsProps {
  products: Product[];
}

export function NoMovementProducts({ products }: NoMovementProductsProps) {
  if (products.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Sin Movimiento (30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {products.slice(0, 5).map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock} | Última venta: {product.lastSale ? 'Hace más de 30 días' : 'Nunca'}
                </p>
              </div>
              <Badge variant="warning" size="sm">Revisar</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
