import React from 'react'
import { CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
export default function Billing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Facturación</h1>
          <p className="text-muted-foreground">Gestiona tus suscripciones y pagos</p>
        </div>
        <Button>
          <CreditCard size={16} className="mr-2" />
          Actualizar método de pago
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan Actual</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">Pro</p>
            <p className="text-muted-foreground text-sm">$49/mes</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Próximo pago</p>
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">Nov 15</p>
            <p className="text-muted-foreground text-sm">En 14 días</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</p>
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">Activo</p>
            <p className="text-muted-foreground text-sm">Todo al día</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Historial de facturas</h3>
          <p className="text-muted-foreground text-sm">No hay facturas disponibles aún.</p>
        </CardContent>
      </Card>
    </div>
  )
}
