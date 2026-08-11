import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { KpiItem } from '../types/categories.types'

interface CategoriesSummaryProps {
  kpiData: KpiItem[]
}

const CategoriesSummary: React.FC<CategoriesSummaryProps> = ({ kpiData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <Card key={idx} variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={kpi.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default CategoriesSummary
