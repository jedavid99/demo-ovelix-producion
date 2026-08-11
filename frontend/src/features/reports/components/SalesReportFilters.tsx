import React from 'react'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { PERIODS } from '../constants/salesReport.constants'
import type { PeriodType } from '../types/salesReport.types'

interface SalesReportFiltersProps {
  period: PeriodType
  customRange: { start: string; end: string }
  onPeriodChange: (p: PeriodType) => void
  onCustomRangeChange: (range: { start: string; end: string }) => void
}

const SalesReportFilters: React.FC<SalesReportFiltersProps> = ({
  period, customRange, onPeriodChange, onCustomRangeChange,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map((p) => (
          <Badge
            key={p}
            variant={period === p ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => onPeriodChange(p)}
          >
            {p}
          </Badge>
        ))}
        {period === 'Personalizado' && (
          <div className="flex items-center gap-2 ml-4">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default SalesReportFilters
