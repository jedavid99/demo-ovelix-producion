import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Package, Zap, Cpu, Wrench, Cable, Building2, Globe } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DataTable from '@/shared/components/data-table'
export default function Providers() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  // 📦 Datos vacíos (cargar desde API)
  const suppliers: {
    id: number
    name: string
    contact: string
    category: string
    phone: string
    email: string
    location: string
    type: string
    color: string
    icon: React.ElementType
  }[] = []
  const filterOptions = {
    all: { label: 'Todos', suppliers },
    local: { label: 'Local', suppliers: suppliers.filter(s => s.type === 'Local') },
    international: { label: 'Internacional', suppliers: suppliers.filter(s => s.type === 'International') },
    oem: { label: 'OEM', suppliers: suppliers.filter(s => s.type === 'OEM') },
    thirdparty: { label: 'Terceros', suppliers: suppliers.filter(s => s.type === 'Third-party') },
  }
  const filtered: any[] = filterOptions[activeFilter as keyof typeof filterOptions].suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalSuppliers = suppliers.length
  const localSuppliers = suppliers.filter(s => s.type === 'Local').length
  const internationalSuppliers = suppliers.filter(s => s.type === 'International').length
  const averageDeliveryDays = 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-muted  p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado compacto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Proveedores</h1>
            <p className="text-sm text-muted-foreground">Gestiona todos los proveedores de hardware y servicios</p>
          </div>
          <Button onClick={() => navigate('/providers/add')} size="sm">
            <UserPlus size={16} className="mr-2" />
            Nuevo proveedor
          </Button>
        </div>
        {/* KPI Cards compactas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: totalSuppliers, icon: Building2, color: 'text-primary', bg: 'bg-primary/10', sub: 'Proveedores activos' },
            { label: 'Nacionales', value: localSuppliers, icon: Building2, color: 'text-success', bg: 'bg-success/10', sub: 'Socios domésticos' },
            { label: 'Internacionales', value: internationalSuppliers, icon: Globe, color: 'text-primary', bg: 'bg-primary/10', sub: 'Proveedores globales' },
            { label: 'Tiempo Promedio', value: averageDeliveryDays === 0 ? '—' : averageDeliveryDays, icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10', sub: 'Días de entrega' },
          ].map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-card rounded-lg border border-border shadow-sm p-4 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">{kpi.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{kpi.sub}</p>
              </motion.div>
            )
          })}
        </div>
        {/* Filtros más compactos */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, contacto o ubicación..."
                  aria-label="Buscar por nombre, contacto o ubicación"
                  className="w-full pl-9 pr-4 py-1.5 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(filterOptions).map(([key, val]) => (
                  <Button
                    key={key}
                    variant={activeFilter === key ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() => setActiveFilter(key)}
                  >
                    {val.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Tabla de proveedores */}
        <DataTable
          data={filtered}
          columns={[
            { key: 'name', header: 'Nombre', render: (s) => <span className="font-medium text-foreground">{s.name}</span> },
            { key: 'contact', header: 'Contacto', render: (s) => <span className="text-muted-foreground">{s.contact}</span> },
            { key: 'category', header: 'Categoría' },
            { key: 'phone', header: 'Teléfono', render: (s) => <span className="text-muted-foreground">{s.phone}</span> },
            { key: 'email', header: 'Email', render: (s) => <span className="text-muted-foreground">{s.email}</span> },
            { key: 'location', header: 'Ubicación' },
            { key: 'type', header: 'Tipo', render: (s) => <Badge variant="outline">{s.type}</Badge> },
          ]}
          rowKey={(s) => s.id}
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filtered.length / 10))}
          onPageChange={setCurrentPage}
          loading={false}
          emptyMessage="No hay proveedores registrados"
        />
      </div>
    </motion.div>
  )
}
