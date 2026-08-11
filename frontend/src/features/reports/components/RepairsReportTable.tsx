import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Wrench } from 'lucide-react'
import { MdFileDownload } from 'react-icons/md'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { formatCurrency, ITEMS_PER_PAGE } from '../constants/repairsReport.constants'
import { exportToCSV } from '@/shared/lib/export'
import type { Repair } from '../types/repairsReport.types'

interface RepairsReportTableProps {
  filteredRepairs: Repair[]
  paginatedRepairs: Repair[]
  currentPage: number
  totalPages: number
  onPageChange: (fn: (p: number) => number) => void
}

export const RepairsReportTable: React.FC<RepairsReportTableProps> = ({
  filteredRepairs, paginatedRepairs, currentPage, totalPages, onPageChange,
}) => {
  const navigate = useNavigate()

  const handleExport = () => {
    const csvData = filteredRepairs.map(repair => ({
      Ticket: repair.ticketId,
      Cliente: repair.client,
      Dispositivo: repair.device,
      Tipo: repair.deviceType,
      Problema: repair.issue,
      Estado: repair.status,
      Fecha: format(repair.date, 'dd/MM/yyyy'),
      Costo: repair.cost,
      Técnico: repair.technician,
    }))
    exportToCSV(csvData, 'reporte-reparaciones')
  }

  if (filteredRepairs.length === 0) {
    return (
      <EmptyState icon={Wrench} title="No hay reparaciones en el período seleccionado" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detalle de Reparaciones</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <MdFileDownload size={16} />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/80 backdrop-blur-md sticky top-0">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Ticket</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Dispositivo</th>
                <th className="pb-3 font-medium">Problema</th>
                <th className="pb-3 font-medium text-center">Estado</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium text-right">Costo</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedRepairs.map((repair) => (
                <tr key={repair.id} className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate(`/repairs/${repair.id}`)}>
                  <td className="py-3 font-mono">{repair.ticketId}</td>
                  <td className="py-3">{repair.client}</td>
                  <td className="py-3">{repair.device}</td>
                  <td className="py-3">{repair.issue}</td>
                  <td className="py-3 text-center">
                    <Badge variant={repair.status === 'Completado' ? 'success' : repair.status === 'En Progreso' ? 'default' : repair.status === 'Pendiente' ? 'warning' : 'destructive'} size="sm">
                      {repair.status}
                    </Badge>
                  </td>
                  <td className="py-3">{format(repair.date, 'dd/MM/yyyy', { locale: es })}</td>
                  <td className="py-3 text-right font-semibold">{formatCurrency(repair.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredRepairs.length)} de {filteredRepairs.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default RepairsReportTable
