import { Search, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface KPICardsProps {
  totalUnits: number;
  totalValue: number;
  noStockCount: number;
}

export function KPICards({ totalUnits, totalValue, noStockCount }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-card  p-6 rounded-xl border border-border  shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-primary">
            <Search size={24} />
          </div>
          <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
            <TrendingUp size={16} /> {totalUnits > 0 ? 'En stock' : 'Sin datos'}
          </span>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium">Total de unidades iPhone</h3>
        <p className="text-4xl font-bold text-foreground mt-2">{totalUnits}</p>
      </div>
      <div className="bg-card  p-6 rounded-xl border border-border  shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-primary">
            <DollarSign size={24} />
          </div>
          <span className="text-muted-foreground text-sm font-medium">ARS</span>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium">Valor de mercado</h3>
        <p className="text-4xl font-bold text-foreground mt-2">${totalValue.toLocaleString('es-AR')}</p>
      </div>
      <div className="bg-card  p-6 rounded-xl border border-border  shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-destructive">
            <AlertCircle size={24} />
          </div>
          <span className="text-destructive text-sm font-medium">{noStockCount > 0 ? 'Crítico' : 'OK'}</span>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium">Modelos sin stock</h3>
        <p className="text-4xl font-bold text-foreground mt-2">{noStockCount}</p>
      </div>
    </div>
  );
}
