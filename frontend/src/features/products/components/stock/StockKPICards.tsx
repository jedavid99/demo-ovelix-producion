import { motion } from 'framer-motion';
import { Package, Filter, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import type { StockItem } from '@/types/stock.types';

interface KpiCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
  color: string;
}

const kpiVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  hover: { y: -4, scale: 1.02, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.15)', transition: { type: 'spring', stiffness: 400, damping: 15 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

interface Props {
  items: StockItem[];
  loading?: boolean;
}

export const StockKPICards = ({ items, loading }: Props) => {
  const totalItems = items.length;
  const totalCategories = new Set(items.map(i => i.categoria)).size;
  const lowStockItems = items.filter(i => i.stock_actual > 0 && i.stock_actual <= i.stock_minimo).length;
  const totalValue = items.reduce((sum, i) => sum + i.precio_venta * i.stock_actual, 0);

  const kpiData: KpiCard[] = [
    { label: 'Productos', value: loading ? '...' : totalItems, icon: Package, trend: 'Sin datos', trendUp: false, color: 'text-primary' },
    { label: 'Categorías', value: loading ? '...' : totalCategories, icon: Filter, trend: 'Sin datos', trendUp: false, color: 'text-indigo-600' },
    { label: 'Stock bajo', value: loading ? '...' : lowStockItems, icon: AlertCircle, trend: 'Sin datos', trendUp: false, color: 'text-amber-600' },
    { label: 'Valor total', value: loading ? '...' : formatCurrency(totalValue), icon: DollarSign, trend: 'Sin datos', trendUp: false, color: 'text-emerald-600' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpiData.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div key={idx} variants={kpiVariants} whileHover="hover" className="h-full">
            <Card className="border-border/60 shadow-sm h-full transition-colors duration-200 hover:border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/50 ${kpi.color}`}><Icon size={20} /></div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  <span className="text-muted-foreground/60 italic text-[10px]">Inventario actual</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
