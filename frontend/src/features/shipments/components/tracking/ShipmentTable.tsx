import { Card, CardContent } from '@/shared/components/ui/card'
import { ShipmentRow } from './ShipmentRow'
import { EmptyState } from '@/shared/components/async/EmptyState'
import type { Shipment } from '../../types/tracking/tracking.types'

interface ShipmentTableProps {
  shipments: Shipment[]
  onOpen: (shipment: Shipment) => void
}

export const ShipmentTable = ({ shipments, onOpen }: ShipmentTableProps) => (
  <Card>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        {shipments.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Transportista</th>
                <th className="px-6 py-4 font-medium">Ubicación</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Progreso</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shipments.map((shipment) => (
                <ShipmentRow key={shipment.id} shipment={shipment} onOpen={onOpen} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CardContent>
  </Card>
)
