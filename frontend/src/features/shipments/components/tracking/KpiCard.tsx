import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import type { KpiCardData } from '../../types/tracking/tracking.types'

interface KpiCardProps {
  data: KpiCardData
}

export const KpiCard = ({ data }: KpiCardProps) => (
  <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-lg ${data.bgColor} flex items-center justify-center`}>
          <div className={data.color}>{data.icon}</div>
        </div>
        <Badge variant={data.change >= 0 ? 'success' : 'destructive'} size="sm">
          {data.change >= 0 ? '+' : ''}{data.change}%
        </Badge>
      </div>
      <p className="text-2xl font-bold text-foreground">{data.value}</p>
      <p className="text-sm text-muted-foreground">{data.title}</p>
    </CardContent>
  </Card>
)
