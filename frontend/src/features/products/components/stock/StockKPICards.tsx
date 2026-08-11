import React from 'react';
import { motion } from 'framer-motion';
import { Package, Filter, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import { stockItems } from '../../constants/stock/stock.constants';

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

export const StockKPICards = () => {
  const totalItems = stockItems.length;
  const totalCategories = new Set(stockItems.map((i) => i.category)).size;
  const lowStockItems = stockItems.filter((i) => i.quantity < 5 && i.quantity > 0).length;
  const totalValue = stockItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const kpiData: KpiCard[] = [
    { label: 'Productos totales', value: totalItems, icon: Package, trend: 'Sin datos', trendUp: false, color: 'text-primary' },
    { label: 'Categorías', value: totalCategories, icon: Filter, trend: 'Sin datos', trendUp: false, color: 'text-indigo-600' },
    { label: 'Stock bajo', value: lowStockItems, icon: AlertCircle, trend: 'Sin datos', trendUp: false, color: 'text-amber-600' },
    { label: 'Valor total', value: formatCurrency(totalValue), icon: DollarSign, trend: 'Sin datos', trendUp: false, color: 'text-emerald-600' },
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
                  {kpi.trend !== 'Sin datos' ? (
                    kpi.trendUp ? (
                      <><TrendingUp size={14} className="text-emerald-500" /><span className="text-emerald-600">{kpi.trend}</span></>
                    ) : (
                      <><TrendingDown size={14} className="text-muted-foreground" /><span className="text-muted-foreground">{kpi.trend}</span></>
                    )
                  ) : (
                    <span className="text-muted-foreground/60 italic text-[10px]">Sin datos disponibles</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
