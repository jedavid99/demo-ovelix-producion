import { MdShoppingCart } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '../constants';
import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
  onNavigateProviders: () => void;
}

export function ProductTable({ products, currentPage, totalPages, totalFiltered, onPageChange, onNavigateProviders }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-card/80 backdrop-blur-md sticky top-0">
          <tr className="text-left text-sm text-muted-foreground">
            <th className="pb-3 font-medium">Producto</th>
            <th className="pb-3 font-medium">Categoría</th>
            <th className="pb-3 font-medium">Stock Actual</th>
            <th className="pb-3 font-medium">Stock Mínimo</th>
            <th className="pb-3 font-medium text-right">Precio Venta</th>
            <th className="pb-3 font-medium text-center">Estado</th>
            <th className="pb-3 font-medium text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {products.map(product => {
            const isLowStock = product.stock < product.minStock;
            const stockRatio = product.stock / product.minStock;
            const stockColor = stockRatio <= 1 ? 'bg-destructive' : stockRatio <= 2 ? 'bg-amber-500' : 'bg-success';

            return (
              <tr key={product.id} className={`border-b border-border hover:bg-muted/50 transition-colors ${isLowStock ? 'bg-destructive/5' : ''}`}>
                <td className="py-3 font-medium">{product.name}</td>
                <td className="py-3">{product.category}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span>{product.stock}</span>
                    <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${stockColor} transition-all duration-300`} style={{ width: `${Math.min((product.stock / (product.minStock * 2)) * 100, 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="py-3">{product.minStock}</td>
                <td className="py-3 text-right font-semibold">{formatCurrency(product.price)}</td>
                <td className="py-3 text-center">
                  <Badge variant={isLowStock ? 'destructive' : 'success'} size="sm">
                    {isLowStock ? 'Crítico' : 'Normal'}
                  </Badge>
                </td>
                <td className="py-3 text-center">
                  {isLowStock && (
                    <Button onClick={onNavigateProviders} variant="outline" size="sm" className="gap-1">
                      <MdShoppingCart size={14} /> Comprar
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalFiltered)} de {totalFiltered}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
        </div>
      </div>
    </div>
  );
}
