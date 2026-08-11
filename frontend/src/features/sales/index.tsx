import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, CreditCard, ShoppingCart, TrendingUp, DollarSign, Package, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DataTable from '@/shared/components/data-table'
import { useSales } from '@/hooks/useSales'
import { Sale } from '@/types/sale.types'
import { formatCurrency } from '@/utils/currency'

const getStatusBadge = (estado: string) => {
  switch (estado) {
    case 'completada': return { variant: 'success' as const, label: 'Completada' }
    case 'anulada': return { variant: 'destructive' as const, label: 'Anulada' }
    default: return { variant: 'outline' as const, label: estado }
  }
}

const formatFecha = (fecha: string) => {
  const d = new Date(fecha)
  return isNaN(d.getTime()) ? fecha : d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Sales() {
  const [page, setPage] = useState(1)
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [metodoPago, setMetodoPago] = useState('')

  const { data, total, totalPages, loading, error, refetch } = useSales({
    page,
    limit: 10,
    fecha_desde: fechaDesde || undefined,
    fecha_hasta: fechaHasta || undefined,
    metodo_pago: metodoPago || undefined,
  })

  const clearFilters = () => {
    setFechaDesde('')
    setFechaHasta('')
    setMetodoPago('')
    setPage(1)
  }

  const hasFilters = fechaDesde !== '' || fechaHasta !== '' || metodoPago !== ''

  const ingresos = data.reduce((acc, s) => acc + (Number(s.total) || 0), 0)
  const promedio = data.length > 0 ? ingresos / data.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">Gestiona tus ventas y transacciones</p>
        </div>
        <Link to="/sales/add">
          <Button>
            <Plus size={16} className="mr-2" />
            Nueva venta
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" size="sm">{total} ventas</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ingresos (página)</p>
            <p className="text-3xl font-bold text-foreground">{loading ? '…' : formatCurrency(ingresos)}</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" size="sm">Mostrando {data.length}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ventas (página)</p>
            <p className="text-3xl font-bold text-foreground">{loading ? '…' : data.length}</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <Badge variant="secondary" size="sm">Página {page}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ticket promedio</p>
            <p className="text-3xl font-bold text-foreground">{loading ? '…' : formatCurrency(promedio)}</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" size="sm">{totalPages} páginas</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Paginación</p>
            <p className="text-3xl font-bold text-foreground">{loading ? '…' : totalPages}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <input
                type="date"
                aria-label="Desde"
                value={fechaDesde}
                onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <input
                type="date"
                aria-label="Hasta"
                value={fechaHasta}
                onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-muted-foreground" />
              <select
                aria-label="Método de pago"
                value={metodoPago}
                onChange={(e) => { setMetodoPago(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los métodos</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="multiple">Múltiple</option>
              </select>
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="gap-2" onClick={clearFilters} disabled={!hasFilters}>
              <RotateCcw size={16} />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      <DataTable
        data={data}
        columns={[
          { key: 'fecha', header: 'Fecha', render: (sale) => formatFecha(sale.fecha) },
          {
            key: 'numero_comprobante',
            header: 'Comprobante',
            render: (sale) => sale.numero_comprobante || '—',
          },
          {
            key: 'cliente',
            header: 'Cliente',
            render: (sale) => sale.cliente?.nombre_completo || 'Mostrador',
          },
          {
            key: 'items',
            header: 'Productos',
            render: (sale) => `${sale.items?.length ?? 0} ítems`,
          },
          {
            key: 'total',
            header: 'Total',
            align: 'right',
            render: (sale) => formatCurrency(sale.total),
          },
          {
            key: 'estado',
            header: 'Estado',
            render: (sale) => {
              const badge = getStatusBadge(sale.estado)
              return <Badge variant={badge.variant}>{badge.label}</Badge>
            },
          },
        ]}
        rowKey={(sale) => sale.id}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage="No hay ventas registradas"
      />
    </div>
  )
}
