import React from 'react'
import { MdTrendingUp, MdTrendingDown, MdSell } from 'react-icons/md'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { formatCurrency } from '../constants/salesReport.constants'

interface SalesReportSummaryProps {
  totalRevenue: number
  totalSales: number
  avgTicket: number
  topProduct: [string, number] | undefined
  hasSales: boolean
}

const SalesReportSummary: React.FC<SalesReportSummaryProps> = ({
  totalRevenue, totalSales, avgTicket, topProduct, hasSales,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MdTrendingUp className="h-5 w-5 text-primary" />
            </div>
            {hasSales && (
              <Badge variant="success" size="sm" className="gap-1">
                <MdTrendingUp size={12} />+12%
              </Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-muted-foreground">Total de ingresos</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MdSell className="h-5 w-5 text-emerald-600" />
            </div>
            {hasSales && (
              <Badge variant="success" size="sm" className="gap-1">
                <MdTrendingUp size={12} />+8%
              </Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSales}</p>
          <p className="text-sm text-muted-foreground">Cantidad de ventas</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MdTrendingUp className="h-5 w-5 text-primary" />
            </div>
            {hasSales && (
              <Badge variant="destructive" size="sm" className="gap-1">
                <MdTrendingDown size={12} />-3%
              </Badge>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(avgTicket)}</p>
          <p className="text-sm text-muted-foreground">Ticket promedio</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <MdSell className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">{topProduct?.[0] || '—'}</p>
          <p className="text-sm text-muted-foreground">
            Producto más vendido {topProduct ? `(${topProduct[1]} u.)` : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesReportSummary
