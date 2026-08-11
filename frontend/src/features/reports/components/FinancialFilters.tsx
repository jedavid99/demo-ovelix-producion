import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { PeriodOption } from '../types/financial.types';
import { PERIOD_OPTIONS } from '../constants/financial.constants';

interface FinancialFiltersProps {
  period: PeriodOption;
  setPeriod: (p: PeriodOption) => void;
  customRange: { start: string; end: string };
  setCustomRange: (r: { start: string; end: string }) => void;
}

export const FinancialFilters: React.FC<FinancialFiltersProps> = ({ period, setPeriod, customRange, setCustomRange }) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {PERIOD_OPTIONS.map((p) => (
          <Badge
            key={p}
            variant={period === p ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => setPeriod(p)}
          >
            {p}
          </Badge>
        ))}
        {period === 'Personalizado' && (
          <div className="flex items-center gap-2 ml-4">
            <input type="date" aria-label="Fecha inicial" value={customRange.start} onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <span className="text-muted-foreground">-</span>
            <input type="date" aria-label="Fecha final" value={customRange.end} onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })} className="px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          </div>
        )}
      </div>
    </Card>
  );
};
export default FinancialFilters;
