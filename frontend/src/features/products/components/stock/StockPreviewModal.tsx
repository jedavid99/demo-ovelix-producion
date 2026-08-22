import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { X, Package, MapPin, Tag, Truck, ShoppingCart } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { formatCurrency } from '@/utils/currency';
import { CANALES_VENTA_LABELS, CANALES_VENTA_COLORS } from '@/types/stock.types';
import type { StockItem, CanalVenta } from '@/types/stock.types';

interface Props {
  item: StockItem | null;
  open: boolean;
  onClose: () => void;
  onEdit: (item: StockItem) => void;
  onDelete: (item: StockItem) => void;
  onSale: (item: StockItem) => void;
}

function stockStatus(item: StockItem) {
  if (item.es_por_encargo) return { variant: 'info' as const, label: 'Por encargo' };
  if (item.stock_actual === 0) return { variant: 'destructive' as const, label: 'Agotado' };
  if (item.stock_actual <= item.stock_minimo) return { variant: 'warning' as const, label: 'Bajo stock' };
  return { variant: 'success' as const, label: 'En stock' };
}

export function StockPreviewModal({ item, open, onClose, onEdit, onDelete, onSale }: Props) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && item?.codigo_barra) {
      try {
        JsBarcode(barcodeRef.current, item.codigo_barra, {
          format: 'CODE128',
          width: 2,
          height: 40,
          displayValue: true,
          fontSize: 12,
          margin: 5,
        });
      } catch { /* ignore */ }
    }
  }, [item?.codigo_barra, open]);

  if (!item) return null;

  const status = stockStatus(item);
  const canales = Array.isArray(item.canales_venta) ? item.canales_venta : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package size={18} /> Vista previa del producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {item.imagen_url && (
            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted/30">
              <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-foreground">{item.nombre}</h3>
            <p className="text-xs text-muted-foreground font-mono">{item.codigo}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={status.variant} size="sm">{status.label}</Badge>
            <Badge variant="outline" size="sm">{item.tipo_producto}</Badge>
            <Badge variant="outline" size="sm">{item.tipo_precio}</Badge>
            {item.categoria && (
              <Badge variant="secondary" size="sm">{item.categoria}</Badge>
            )}
          </div>

          {item.descripcion && (
            <p className="text-sm text-muted-foreground">{item.descripcion}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag size={14} /> Costo: <span className="font-medium text-foreground">{formatCurrency(item.costo_unitario)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag size={14} /> Precio: <span className="font-medium text-foreground">{formatCurrency(item.precio_venta)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package size={14} /> Stock: <span className="font-medium text-foreground">{item.stock_actual}</span>
            </div>
            {item.proveedor_nombre && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck size={14} /> {item.proveedor_nombre}
              </div>
            )}
            {item.ubicacion_almacen && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} /> {item.ubicacion_almacen}
              </div>
            )}
          </div>

          {canales.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">Canales de venta:</p>
              <div className="flex flex-wrap gap-1.5">
                {canales.map(canal => (
                  <span key={canal} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${CANALES_VENTA_COLORS[canal as CanalVenta]}`}>
                    {CANALES_VENTA_LABELS[canal as CanalVenta]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.codigo_barra && (
            <div className="flex justify-center bg-white p-2 rounded-lg border border-border">
              <svg ref={barcodeRef} />
            </div>
          )}

          {item.notas && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <span className="font-semibold">Notas:</span> {item.notas}
            </div>
          )}

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Button size="sm" onClick={() => { onEdit(item); onClose(); }}>
              <ShoppingCart size={14} className="mr-1" /> Vender
            </Button>
            <Button size="sm" variant="outline" onClick={() => { onEdit(item); onClose(); }}>
              Editar
            </Button>
            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => { onDelete(item); onClose(); }}>
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
