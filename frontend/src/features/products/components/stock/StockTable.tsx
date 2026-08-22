import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Eye, Edit, Trash2, ShoppingCart, Tag } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/components/ui/use-toast';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { StockImageCarousel, StockImageThumbnail } from './StockImageCarousel';
import { StockPreviewModal } from './StockPreviewModal';
import { CANALES_VENTA_LABELS, CANALES_VENTA_COLORS } from '@/types/stock.types';
import type { StockItem, CanalVenta } from '@/types/stock.types';
import { stockService } from '@/services/stockService';

interface StockTableProps {
  items: StockItem[];
  totalItems: number;
  onRefresh: () => void;
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' } }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

function stockStatus(item: StockItem) {
  if (item.es_por_encargo) return { variant: 'info' as const, label: 'Por encargo' };
  if (item.stock_actual === 0) return { variant: 'destructive' as const, label: 'Agotado' };
  if (item.stock_actual <= item.stock_minimo) return { variant: 'warning' as const, label: 'Bajo stock' };
  return { variant: 'success' as const, label: 'En stock' };
}

const CATEGORIA_COLORS: Record<string, string> = {
  pantallas: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  baterias: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'puertos de carga': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  placas: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  camaras: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  accesorios: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  general: 'bg-muted text-muted-foreground',
};

function getCategoriaColor(cat: string) {
  return CATEGORIA_COLORS[cat.toLowerCase()] || 'bg-muted text-muted-foreground';
}

export const StockTable = ({ items, totalItems, onRefresh }: StockTableProps) => {
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<StockItem | null>(null);

  const openCarousel = (item: StockItem) => {
    if (item.imagen_url) {
      setCarouselImages([item.imagen_url]);
      setCarouselOpen(true);
    }
  };

  const handleDelete = async (item: StockItem) => {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
    try {
      await stockService.delete(item.id);
      toast({ title: 'Eliminado', description: `"${item.nombre}" eliminado del inventario.` });
      onRefresh();
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar el producto.', variant: 'destructive' });
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Canales</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="wait">
                {items.map((item, idx) => {
                  const status = stockStatus(item);
                  const canales = Array.isArray(item.canales_venta) ? item.canales_venta : [];
                  return (
                    <motion.tr key={item.id} custom={idx} variants={rowVariants} initial="hidden" animate="visible" exit="exit"
                      className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <StockImageThumbnail item={item} onClick={() => openCarousel(item)} />
                          <div>
                            <p className="font-medium text-foreground">{item.nombre}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.codigo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" size="sm" className="capitalize">{item.tipo_producto}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getCategoriaColor(item.categoria)}`}>
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <span className={item.stock_actual === 0 ? 'text-destructive' : item.stock_actual <= item.stock_minimo ? 'text-amber-600' : 'text-foreground'}>
                          {item.es_por_encargo ? '🔄' : item.stock_actual}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-foreground">{formatCurrency(item.precio_venta)}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{item.tipo_precio}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {canales.slice(0, 2).map(canal => (
                            <span key={canal} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${CANALES_VENTA_COLORS[canal as CanalVenta]}`}>
                              {CANALES_VENTA_LABELS[canal as CanalVenta]}
                            </span>
                          ))}
                          {canales.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground">
                              +{canales.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant} size="sm" className="font-medium">{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm"><MoreVertical size={16} /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="gap-2" onClick={() => setPreviewItem(item)}>
                              <Eye size={14} /> Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => toast({ title: 'Editar', description: 'Función disponible próximamente.' })}>
                              <Edit size={14} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => toast({ title: 'Vender', description: 'Función disponible próximamente.' })}>
                              <ShoppingCart size={14} /> Realizar venta
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(item)}>
                              <Trash2 size={14} /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
          <span>Mostrando <strong className="text-foreground">{items.length}</strong> de <strong className="text-foreground">{totalItems}</strong> productos</span>
        </div>
      </motion.div>

      <StockImageCarousel
        images={carouselImages}
        open={carouselOpen}
        onClose={() => setCarouselOpen(false)}
      />

      <StockPreviewModal
        item={previewItem}
        open={!!previewItem}
        onClose={() => setPreviewItem(null)}
        onEdit={(item) => toast({ title: 'Editar', description: 'Función disponible próximamente.' })}
        onDelete={handleDelete}
        onSale={(item) => toast({ title: 'Vender', description: 'Función disponible próximamente.' })}
      />
    </>
  );
};
