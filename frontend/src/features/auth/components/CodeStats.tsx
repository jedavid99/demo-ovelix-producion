import React from 'react'
import { Key, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import type { CodeStats as CodeStatsType } from '../types/auth.types'

interface CodeStatsProps {
  stats: CodeStatsType
}

export const CodeStats: React.FC<CodeStatsProps> = ({ stats }) => {
  const items = [
    { label: 'Total', value: stats.total, icon: Key, bg: 'bg-primary/10 dark:bg-blue-900/30', color: 'text-primary' },
    { label: 'Activos', value: stats.active, icon: CheckCircle2, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-success dark:text-green-300' },
    { label: 'Por vencer', value: stats.expiringSoon, icon: Clock, bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-300' },
    { label: 'Vencidos', value: stats.expired, icon: AlertCircle, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-destructive dark:text-red-300' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <Card key={item.label} className="p-6 bg-card dark:bg-card border border-border/60">
          <div className="flex items-center gap-4">
            <div className={`p-3 ${item.bg} rounded-lg`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
export default CodeStats
