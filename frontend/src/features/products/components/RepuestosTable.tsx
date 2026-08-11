import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react'
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
import type { RepuestoItem, StatusBadge } from '../types/repuestos.types'
import { categoryColorMap, rowVariants } from '../constants/repuestos.constants'

interface RepuestosTableProps {
  loading: boolean
  filteredItems: RepuestoItem[]
  totalItems: number
  getStatusBadge: (status: string, quantity: number) => StatusBadge
  onOpenModal: () => void
}

export const RepuestosTable: React.FC<RepuestosTableProps> = ({
  loading, filteredItems, totalItems, getStatusBadge, onOpenModal,
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
        title="No hay repuestos"
        description="No se encontraron repuestos con los filtros actuales. Prueba a ajustar tu búsqueda o agrega un nuevo repuesto."
        actionLabel="Agregar repuesto"
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
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Repuesto</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cantidad</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="wait">
              {filteredItems.map((item, idx) => {
                const IconComponent = item.icon
                const status = getStatusBadge(item.status, item.quantity)
                const categoryColor = categoryColorMap[item.category] || 'bg-muted text-muted-foreground'
                return (
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
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                          {item.compatibleWith.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {item.compatibleWith.slice(0, 2).map((device) => (
                                <span key={device} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                  {device}
                                </span>
                              ))}
                              {item.compatibleWith.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{item.compatibleWith.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${categoryColor}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">
                      <span className={
                        item.quantity === 0
                          ? 'text-destructive'
                          : item.quantity < 5
                          ? 'text-amber-600'
                          : 'text-foreground'
                      }>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={status.variant} size="sm" className="font-medium">
                        {status.label}
                      </Badge>
                    </td>
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
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
        <span>
          Mostrando <strong className="text-foreground">{filteredItems.length}</strong> de{' '}
          <strong className="text-foreground">{totalItems}</strong> repuestos
        </span>
        <span>Última actualización: Hoy a las {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  )
}
export default RepuestosTable
