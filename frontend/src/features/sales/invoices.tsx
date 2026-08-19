import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Plus,
  Filter,
  TrendingUp,
  Clock,
  Wallet,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge'
import DataTable from '@/shared/components/data-table'
import { useSales } from '@/hooks/useSales'
import type { Sale } from '@/types/sale.types'

interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  cuit: string;
  amount: number;
  status: 'authorized' | 'pending' | 'error';
}

function mapSaleToInvoice(sale: Sale): Invoice {
  const estado = String(sale.estado).toLowerCase();
  const status = estado === 'anulada' ? 'error' : 'authorized';
  return {
    id: sale.id,
    number: sale.numero_comprobante || `VTA-${sale.id.slice(0, 8)}`,
    date: formatDate(sale.fecha),
    customer: sale.cliente?.nombre_completo || 'Cliente mostrador',
    cuit: '—',
    amount: Number(sale.total) || 0,
    status,
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dateRangeToFilter(range: string): { fecha_desde?: string; fecha_hasta?: string } {
  const now = new Date();
  const to = now.toISOString();
  if (range === 'Mes actual') {
    return { fecha_desde: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), fecha_hasta: to };
  }
  if (range === 'Último trimestre') {
    return { fecha_desde: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(), fecha_hasta: to };
  }
  return { fecha_desde: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), fecha_hasta: to };
}

export default function InvoicesList() {
  const [dateRange, setDateRange] = useState('Últimos 30 días');
  const [invoiceType, setInvoiceType] = useState('Todas');
  const [paymentStatus, setPaymentStatus] = useState('Todos los estados');
  const [arcaStatus, setArcaStatus] = useState('Cualquier estado');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const range = useMemo(() => dateRangeToFilter(dateRange), [dateRange]);

  const filters = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      ...range,
      estado: arcaStatus === 'Error' ? 'anulada' : arcaStatus === 'Autorizada' ? 'completada' : undefined,
    }),
    [currentPage, range, arcaStatus],
  );

  const { data, total, totalPages, loading, error, refetch } = useSales(filters);

  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, arcaStatus]);

  const invoices = useMemo(() => data.map(mapSaleToInvoice), [data]);

  const filteredInvoices = useMemo(() => invoices.filter(invoice => {
    const matchesSearch = !searchQuery ||
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArca = arcaStatus === 'Cualquier estado' ||
      (arcaStatus === 'Autorizada' && invoice.status === 'authorized') ||
      (arcaStatus === 'Pendiente' && invoice.status === 'pending') ||
      (arcaStatus === 'Error' && invoice.status === 'error');
    const matchesPayment = paymentStatus === 'Todos los estados' ||
      (paymentStatus === 'Pagada' && invoice.status === 'authorized') ||
      (paymentStatus === 'No pagada' && invoice.status === 'error');
    return matchesSearch && matchesArca && matchesPayment;
  }), [invoices, searchQuery, arcaStatus, paymentStatus]);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  const unpaidAmount = invoices.filter(inv => inv.status !== 'authorized').reduce((sum, inv) => sum + inv.amount, 0);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'authorized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="size-1.5 rounded-full bg-success"></span>
            Autorizada
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Pendiente
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-destructive">
            <span className="size-1.5 rounded-full bg-destructive/100"></span>
            Error
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">Gestiona tus facturas electrónicas y estado ARCA</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" disabled title="La exportación estará disponible próximamente">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Link to="/billing/create">
            <Button>
              <Plus size={16} className="mr-2" />
              Nueva factura
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total facturado</p>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">${totalAmount.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-success text-sm mt-2">
              <TrendingUp size={16} />
              <span>{total} facturas emitidas</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendientes</p>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Requieren acción ARCA</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo pendiente</p>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">${unpaidAmount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">{invoices.filter(inv => inv.status !== 'authorized').length} facturas sin pagar</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rango de fechas</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Últimos 30 días</option>
                <option>Mes actual</option>
                <option>Último trimestre</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo de factura</label>
              <div className="flex gap-2 flex-wrap">
                {['Todas', 'Factura A', 'Factura B'].map(type => (
                  <Badge
                    key={type}
                    variant={invoiceType === type ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setInvoiceType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado de pago</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Todos los estados</option>
                <option>Pagada</option>
                <option>No pagada</option>
                <option>Parcialmente pagada</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado ARCA</label>
              <select
                value={arcaStatus}
                onChange={(e) => setArcaStatus(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Cualquier estado</option>
                <option>Autorizada</option>
                <option>Pendiente</option>
                <option>Error</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <DataTable
        data={filteredInvoices}
        columns={[
          { key: 'number', header: 'Número', render: (inv) => <span className="font-mono text-muted-foreground">{inv.number}</span> },
          { key: 'date', header: 'Fecha' },
          { key: 'customer', header: 'Cliente' },
          { key: 'cuit', header: 'CUIT', render: (inv) => <span className="text-muted-foreground">{inv.cuit}</span> },
          {
            key: 'amount',
            header: 'Monto',
            align: 'right',
            render: (inv) => (
              <span className="font-medium text-foreground">
                {inv.amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}
              </span>
            ),
          },
          { key: 'status', header: 'Estado ARCA', render: (inv) => getStatusBadge(inv.status) },
        ]}
        rowKey={(inv) => inv.id}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
        error={error || undefined}
        onRetry={refetch}
        emptyMessage="No hay facturas registradas"
      />
    </div>
  );
}
