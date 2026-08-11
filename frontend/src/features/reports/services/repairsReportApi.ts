import { repairService } from '@/services/repairService'
import type { Repair } from '../types/repairsReport.types'

export async function fetchRepairsData(): Promise<{ repairs: Repair[] }> {
  const response = await repairService.list({ limit: 1000 }) as any
  const repairsArray = response?.data?.data?.data || response?.data?.data?.reparaciones || response?.data?.data || []
  const validRepairsArray = Array.isArray(repairsArray) ? repairsArray : []

  const mappedRepairs: Repair[] = validRepairsArray.map((r: any) => ({
    id: r.id,
    ticketId: r.numero_reparacion || r.id?.substring(0, 8),
    client: r.cliente?.nombre_completo || r.cliente?.nombre || r.nombre_cliente || '—',
    device: r.dispositivo || '—',
    deviceType: r.tipo_dispositivo || r.tipo || 'General',
    issue: r.problema || r.descripcion || '—',
    status: r.estado === 'pending' || r.estado === 'PENDING' ? 'Pendiente' :
            r.estado === 'in_progress' || r.estado === 'IN_PROGRESS' ? 'En Progreso' :
            r.estado === 'ready' || r.estado === 'READY' ? 'Completado' :
            r.estado === 'delivered' || r.estado === 'DELIVERED' ? 'Completado' :
            r.estado === 'completed' || r.estado === 'COMPLETED' ? 'Completado' :
            r.estado === 'cancelled' || r.estado === 'CANCELLED' ? 'Cancelado' : 'Pendiente',
    date: r.fecha_ingreso ? new Date(r.fecha_ingreso) : new Date(r.createdAt),
    completedDate: r.fecha_estimada_entrega ? new Date(r.fecha_estimada_entrega) : undefined,
    cost: typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0,
    technician: r.tecnico?.nombre || r.tecnico || '—',
  }))

  return { repairs: mappedRepairs }
}
