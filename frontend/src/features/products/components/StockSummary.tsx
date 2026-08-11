import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { KpiItem } from '../types/repuestos.types'
import { kpiContainerVariants, kpiCardVariants } from '../constants/repuestos.constants'

interface StockSummaryProps {
  kpiData: KpiItem[]
}

export const StockSummary: React.FC<StockSummaryProps> = ({ kpiData }) => {
  return (
    <motion.div
      variants={kpiContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {kpiData.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <motion.div key={idx} variants={kpiCardVariants} whileHover="hover" className="h-full">
            <Card className="border-border/60 shadow-sm h-full transition-colors duration-200 hover:border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {kpi.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/50 ${kpi.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  {kpi.trend !== 'Sin datos' ? (
                    kpi.trendUp ? (
                      <>
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-emerald-600">{kpi.trend}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{kpi.trend}</span>
                      </>
                    )
                  ) : (
                    <span className="text-muted-foreground/60 italic text-[10px]">Sin datos disponibles</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
export default StockSummary
