import React from 'react'
import { Truck, User, MapPin, Eye, Edit, Trash2 } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import type { Remise, StatusBadge } from '../types/shipments.types'

interface RemisesListProps {
  filteredRemises: Remise[]
  paginatedRemises: Remise[]
  totalPages: number
  currentPage: number
  setCurrentPage: (fn: (p: number) => number) => void
  getStatusBadge: (status: Remise['status']) => StatusBadge
  openDetails: (remise: Remise) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onOpenAdd: () => void
}

export const RemisesList: React.FC<RemisesListProps> = ({
  filteredRemises, paginatedRemises, totalPages, currentPage, setCurrentPage,
  getStatusBadge, openDetails, onEdit, onDelete, onOpenAdd,
}) => {
  if (filteredRemises.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="No hay remises registrados"
        description="Agrega un nuevo remise para comenzar."
        actionLabel="Nuevo remise"
        onAction={onOpenAdd}
      />
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Placa</th>
                <th className="px-6 py-4 font-medium">Conductor</th>
                <th className="px-6 py-4 font-medium">Vehículo</th>
                <th className="px-6 py-4 font-medium">Ubicación</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedRemises.map((remise) => (
                <tr
                  key={remise.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors group"
                  onClick={() => openDetails(remise)}
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-primary">{remise.plate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-muted-foreground" />
                      <span className="font-medium">{remise.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{remise.vehicle}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{remise.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadge(remise.status).variant}>
                      {getStatusBadge(remise.status).label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openDetails(remise) }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(remise.id) }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(remise.id) }}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * 10 + 1} -{' '}
              {Math.min(currentPage * 10, filteredRemises.length)} de {filteredRemises.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default RemisesList
