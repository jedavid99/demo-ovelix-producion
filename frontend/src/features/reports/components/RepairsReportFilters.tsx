import React from 'react'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { PERIOD_OPTIONS } from '../constants/repairsReport.constants'
import type { PeriodType } from '../types/repairsReport.types'

interface RepairsReportFiltersProps {
  period: PeriodType
  customRange: { start: string; end: string }
  onPeriodChange: (p: PeriodType) => void
  onCustomRangeChange: (range: { start: string; end: string }) => void
}

export const RepairsReportFilters: React.FC<RepairsReportFiltersProps> = ({
  period, customRange, onPeriodChange, onCustomRangeChange,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((p) => (
            <Badge
              key={p}
              variant={period === p ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => onPeriodChange(p)}
            >
              {p}
            </Badge>
          ))}
        </div>
        {period === 'Personalizado' && (
          <div className="flex gap-2 items-center">
            <input type="date" aria-label="Fecha inicial" value={customRange.start} onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm" />
            <span className="text-muted-foreground">-</span>
            <input type="date" aria-label="Fecha final" value={customRange.end} onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm" />
          </div>
        )}
      </div>
    </Card>
  )
}
export default RepairsReportFilters
