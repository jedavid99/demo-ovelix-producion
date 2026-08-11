import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { toast } from '@/shared/components/ui/use-toast';
import { stockService } from '@/services/stockService';
import type { RepairPart } from './RepairEdit.types';

interface EditPartsFormProps {
  repuestos: RepairPart[];
  nuevoRepuesto: { nombre: string; cantidad: number; costo_unitario: number };
  setNuevoRepuesto: (repuesto: { nombre: string; cantidad: number; costo_unitario: number }) => void;
  agregarRepuesto: () => void;
  eliminarRepuesto: (id: string) => void;
}

export const EditPartsForm: React.FC<EditPartsFormProps> = ({
  repuestos,
  nuevoRepuesto,
  setNuevoRepuesto,
  agregarRepuesto,
  eliminarRepuesto,
}) => {
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [stockSearch, setStockSearch] = useState('');
  const [loadingStock, setLoadingStock] = useState(false);

  const loadStockItems = async () => {
    try {
      setLoadingStock(true);
      const response = await stockService.list({ limit: 100 }) as any;
      const items = response?.data?.data?.data || response?.data?.data || response?.data || [];
      setStockItems(Array.isArray(items) ? items : []);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error al cargar stock:', error);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    if (stockModalOpen) {
      loadStockItems();
    }
  }, [stockModalOpen]);

  const filteredStockItems = stockItems.filter(item =>
    item.nombre?.toLowerCase().includes(stockSearch.toLowerCase()) ||
    item.codigo?.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const addFromStock = (stockItem: any) => {
    setNuevoRepuesto({
      nombre: stockItem.nombre,
      cantidad: 1,
      costo_unitario: stockItem.costo_unitario || 0,
    });
    setStockModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {repuestos.length > 0 && (
        <div className="space-y-2">
          {repuestos.map((repuesto) => (
            <div
              key={repuesto.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{repuesto.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {repuesto.cantidad} x ${repuesto.costo_unitario.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-sm">
                  ${(repuesto.cantidad * repuesto.costo_unitario).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => eliminarRepuesto(repuesto.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Eliminar repuesto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => setStockModalOpen(true)}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar en Inventario
        </Button>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-medium mb-3">Agregar Repuesto Manual</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder="Nombre del repuesto"
              value={nuevoRepuesto.nombre}
              onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Cantidad"
              value={nuevoRepuesto.cantidad}
              onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, cantidad: parseInt(e.target.value) || 1 })}
              min={1}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Costo unitario"
              value={nuevoRepuesto.costo_unitario}
              onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, costo_unitario: parseFloat(e.target.value) || 0 })}
              min={0}
              step={0.01}
            />
          </div>
        </div>
        <Button
          onClick={agregarRepuesto}
          className="mt-3"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Repuesto
        </Button>
      </div>

      <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
        <DialogContent className="max-w-2xl max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Buscar Repuestos en Inventario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Buscar por nombre o código..."
              aria-label="Buscar por nombre o código"
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              className="w-full"
            />
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {loadingStock ? (
                <div className="text-center py-8 text-muted-foreground">Cargando inventario...</div>
              ) : filteredStockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {stockSearch ? 'No se encontraron repuestos' : 'No hay repuestos en el inventario'}
                </div>
              ) : (
                filteredStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => addFromStock(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        Código: {item.codigo} | Stock: {item.stock_actual}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="font-bold text-sm">${item.costo_unitario?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-muted-foreground">Precio venta: ${item.precio_venta?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
