import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency, ITEMS_PER_PAGE } from '../constants/salesReport.constants'
import type { Sale } from '../types/salesReport.types'

interface SalesReportTableProps {
  filteredSales: Sale[]
  paginatedSales: Sale[]
  currentPage: number
  totalPages: number
  onPageChange: (fn: (p: number) => number) => void
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({
  filteredSales, paginatedSales, currentPage, totalPages, onPageChange,
}) => {
  const navigate = useNavigate()

  if (filteredSales.length === 0) {
    return (
      <EmptyState icon={BarChart3} title="No hay ventas en el período seleccionado" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/80 backdrop-blur-md sticky top-0">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${sale.status === 'Completada' ? 'bg-success/5' : ''}`}
                  onClick={() => navigate(`/sales/${sale.id}`)}
                >
                  <td className="py-3">{format(sale.date, 'dd/MM/yyyy', { locale: es })}</td>
                  <td className="py-3">{sale.client}</td>
                  <td className="py-3">{sale.product}</td>
                  <td className="py-3 text-right font-semibold">{formatCurrency(sale.total)}</td>
                  <td className="py-3 text-center">
                    <Badge
                      variant={sale.status === 'Completada' ? 'success' : sale.status === 'Pendiente' ? 'warning' : 'destructive'}
                      size="sm"
                    >
                      {sale.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredSales.length)} de {filteredSales.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesReportTable
