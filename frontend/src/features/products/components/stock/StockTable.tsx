import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/components/ui/use-toast';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { getStatusBadge, categoryColorMap } from '../../constants/stock/stock.constants';
import type { StockItem } from '../../types/stock/stock.types';

interface StockTableProps {
  items: StockItem[];
  totalItems: number;
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' } }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const StockTable = ({ items, totalItems }: StockTableProps) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
    className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
          <tr className="border-b border-border">
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <AnimatePresence mode="wait">
            {items.map((item, idx) => {
              const IconComponent = item.icon;
              const status = getStatusBadge(item.status, item.quantity);
              const catColor = categoryColorMap[item.category] || 'bg-muted text-muted-foreground';
              return (
                <motion.tr key={item.id} custom={idx} variants={rowVariants} initial="hidden" animate="visible" exit="exit"
                  className="hover:bg-muted/30 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${catColor}`}>{item.category}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium">
                    <span className={item.quantity === 0 ? 'text-destructive' : item.quantity < 5 ? 'text-amber-600' : 'text-foreground'}>{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={status.variant} size="sm" className="font-medium">{status.label}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm"><MoreVertical size={16} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2" onClick={() => toast({ title: 'Ver detalles', description: 'Función disponible próximamente.' })}><Eye size={14} /> Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => toast({ title: 'Editar', description: 'Función disponible próximamente.' })}><Edit size={14} /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => toast({ title: 'Eliminar', description: 'Función disponible próximamente.' })}><Trash2 size={14} /> Eliminar</DropdownMenuItem>
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
      <span>Última actualización: Hoy a las {new Date().toLocaleTimeString()}</span>
    </div>
  </motion.div>
);
