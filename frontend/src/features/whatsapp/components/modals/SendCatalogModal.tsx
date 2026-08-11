import React, { useState } from 'react';
import {
  Search,
  Package,
  X,
  Check,
  Tag,
  AlertCircle,
  CheckCircle,
  MinusCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface SendCatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (products: Product[]) => void;
  availableProducts: Product[];
}

export const SendCatalogModal: React.FC<SendCatalogModalProps> = ({
  open,
  onClose,
  onSend,
  availableProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSend = () => {
    const productsToSend = availableProducts.filter((p) =>
      selectedProducts.has(p.id)
    );
    onSend(productsToSend);
    setSelectedProducts(new Set());
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStockConfig = (stock: number) => {
    if (stock <= 0) {
      return { label: 'Agotado', variant: 'destructive' as const, icon: <MinusCircle className="h-3 w-3" /> };
    }
    if (stock < 5) {
      return { label: 'Stock bajo', variant: 'warning' as const, icon: <AlertCircle className="h-3 w-3" /> };
    }
    return { label: `${stock} disponibles`, variant: 'success' as const, icon: <CheckCircle className="h-3 w-3" /> };
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'electrónica': 'bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400',
      'accesorios': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'repuestos': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'iphone': 'bg-muted text-foreground /50 dark:text-muted-foreground',
      'samsung': 'bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400',
      'motorola': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-destructive',
      'xiaomi': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return colors[category.toLowerCase()] || 'bg-primary/10 text-primary';
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const selectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-background border-border  shadow-xl rounded-xl overflow-hidden">
        {/* Header con gradiente */}
        <DialogHeader className="p-6 pb-3 border-b border-border/70  bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold">Enviar Catálogo</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Selecciona los productos que deseas mostrar al cliente
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Búsqueda mejorada */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              aria-label="Buscar por nombre o categoría"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-10 bg-muted dark:bg-card/50 border-border/70  focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-muted  transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground/60" />
              </button>
            )}
          </div>

          {/* Contador y acciones rápidas */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              {searchTerm && filteredProducts.length === 0 && (
                <span className="text-destructive/70 ml-2">No coincide con la búsqueda</span>
              )}
            </span>
            {filteredProducts.length > 0 && (
              <button
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                {selectedProducts.size === filteredProducts.length ? (
                  'Deseleccionar todo'
                ) : (
                  'Seleccionar todo'
                )}
              </button>
            )}
          </div>

          {/* Lista de productos */}
          <ScrollArea className="h-64 pr-2 -mr-2">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                <div className="h-16 w-16 rounded-full bg-muted /50 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                  {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {searchTerm ? 'Intenta con otra búsqueda' : 'Agrega productos al inventario primero'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.has(product.id);
                  const stockConfig = getStockConfig(product.stock);
                  const categoryColor = getCategoryColor(product.category);

                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "relative p-4 border rounded-xl transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border/70  hover:bg-muted/80 dark:hover:bg-card/50 hover:shadow-sm"
                      )}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleProduct(product.id)}
                          className="mt-1.5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{product.name}</span>
                              <Badge
                                variant="outline"
                                className={cn("text-[10px] px-2 py-0 h-5 font-medium border-0", categoryColor)}
                              >
                                {product.category}
                              </Badge>
                            </div>
                            <span className="text-sm font-bold text-foreground flex-shrink-0">
                              {formatCurrency(product.price)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-1.5">
                            <Badge
                              variant={stockConfig.variant}
                              className="text-[10px] px-2 py-0 h-5 font-medium flex items-center gap-1"
                            >
                              {stockConfig.icon}
                              {stockConfig.label}
                            </Badge>
                          </div>

                          {/* Indicador de selección */}
                          {isSelected && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer con acciones */}
        <DialogFooter className="p-6 pt-3 border-t border-border/70  bg-muted/50 dark:bg-card/50">
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={selectedProducts.size === 0}
              className="gap-2 min-w-[140px]"
            >
              <Package className="h-4 w-4" />
              Enviar ({selectedProducts.size})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};