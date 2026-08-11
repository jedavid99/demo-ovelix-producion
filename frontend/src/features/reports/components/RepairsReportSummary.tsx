import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { MdTrendingUp } from 'react-icons/md'
import type { KpiItem } from '../types/repairsReport.types'

interface RepairsReportSummaryProps {
  primaryKpis: KpiItem[]
  secondaryKpis: KpiItem[]
}

function KpiCard({ item }: { item: KpiItem }) {
  const Icon = item.icon
  return (
    <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${item.iconColor}`} />
          </div>
          {item.badge && (
            <Badge variant={item.badge.variant as any} size="sm" className="gap-1">
              <MdTrendingUp size={12} />
              {item.badge.text}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground">{item.value}</p>
        <p className="text-sm text-muted-foreground">{item.label}</p>
      </CardContent>
    </Card>
  )
}

export const RepairsReportSummary: React.FC<RepairsReportSummaryProps> = ({ primaryKpis, secondaryKpis }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKpis.map((kpi, i) => <KpiCard key={i} item={kpi} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondaryKpis.map((kpi, i) => <KpiCard key={i} item={kpi} />)}
      </div>
    </>
  )
}
export default RepairsReportSummary
