import { PieChart, Info } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { categoryColors } from '../constants';
import type { Expense } from '../types';

interface CategorySidebarProps {
  expenses: Expense[];
  categoryTotals: Record<string, number>;
  totalSpent: number;
}

export function CategorySidebar({ expenses, categoryTotals, totalSpent }: CategorySidebarProps) {
  const categories = Object.keys(categoryTotals);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-primary" />
            Distribución por Categoría
          </h3>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">Sin datos</p>
              <p className="text-sm">Agrega gastos para ver la distribución</p>
            </div>
          ) : (
            <>
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="18" className="text-muted/30" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs font-semibold text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">${totalSpent.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`size-3 rounded-full ${categoryColors[cat] || 'bg-muted'}`} />
                      <span className="text-sm font-medium text-foreground">{cat}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">${categoryTotals[cat]?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Button variant="outline" className="w-full mt-6">
            Ver reporte detallado
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-primary/10 dark:bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info size={16} />
            Insights Rápidos
          </h4>
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin insights disponibles. Registra gastos para obtener análisis.</p>
          ) : (
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">Sin análisis</span> aún. Conecta datos reales para obtener insights.
                </p>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
