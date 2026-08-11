import { Search } from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ProductCatalogProps {
  searchQuery: string;
  cartLength: number;
  onSearchChange: (value: string) => void;
  onContinue: () => void;
}

export const ProductCatalog = ({ searchQuery, cartLength, onSearchChange, onContinue }: ProductCatalogProps) => (
  <div className="space-y-6">
    <div className="relative">
      <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar modelos de iPhone..."
        aria-label="Buscar modelos de iPhone"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
      />
    </div>
    <Card>
      <CardContent className="p-12 text-center">
        <MdPhoneAndroid size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay productos disponibles</p>
        <p className="text-sm text-muted-foreground">Agrega productos desde el panel de administración</p>
      </CardContent>
    </Card>
    <div className="flex justify-end gap-3 pt-4">
      <Button onClick={onContinue} disabled={cartLength === 0}>
        Continuar al carrito <ChevronRight size={16} className="ml-2" />
      </Button>
    </div>
  </div>
);
