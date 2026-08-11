import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Calendar, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import type { AdjustmentItem } from '../types/adjustments.types'
import { rowVariants } from '../constants/adjustments.constants'

interface AdjustmentsListProps {
  loading: boolean
  filteredItems: AdjustmentItem[]
  totalAdjustments: number
  getTypeBadge: (type: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
  onOpenModal: () => void
}

export const AdjustmentsList: React.FC<AdjustmentsListProps> = ({
  loading, filteredItems, totalAdjustments, getTypeBadge, getStatusBadge, onOpenModal,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
            <Skeleton variant="rectangular" className="h-10 w-10 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-32 h-4" />
              <Skeleton variant="text" className="w-48 h-3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No hay ajustes"
        description="No se encontraron ajustes con los filtros actuales. Crea un nuevo ajuste de stock para registrar movimientos de inventario."
        actionLabel="Nuevo ajuste"
        onAction={onOpenModal}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Motivo</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="wait">
              {filteredItems.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  custom={idx}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.productSku}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{getTypeBadge(item.type)}</td>
                  <td className="px-4 py-3.5 font-medium">
                    <span className={
                      item.type === 'entry' || item.type === 'return'
                        ? 'text-emerald-600'
                        : item.type === 'exit'
                        ? 'text-destructive'
                        : 'text-foreground'
                    }>
                      {item.type === 'entry' || item.type === 'return' ? '+' : '-'}{item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-xs truncate">{item.reason}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-muted-foreground/60" />
                      {item.date}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2"><Eye size={14} /> Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Edit size={14} /> Editar</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><Trash2 size={14} /> Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
        <span>
          Mostrando <strong className="text-foreground">{filteredItems.length}</strong> de{' '}
          <strong className="text-foreground">{totalAdjustments}</strong> ajustes
        </span>
        <span>Última actualización: Hoy a las {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  )
}
export default AdjustmentsList
