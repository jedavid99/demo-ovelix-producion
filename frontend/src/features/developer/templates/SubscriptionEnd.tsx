import React from 'react';
import { XCircle, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export default function SubscriptionEnd() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tu suscripción ha finalizado</h1>
            <p className="text-muted-foreground">
              Tu cuenta ha sido suspendida por falta de pago
            </p>
          </div>

          <div className="bg-destructive/10 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">¿Por qué fue suspendida tu cuenta?</h3>
                <p className="text-sm text-red-800">
                  No pudimos procesar tu pago mensual. Tu cuenta permanecerá suspendida hasta que actualices tu método de pago o reactive tu suscripción.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Detalles de tu cuenta</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan anterior:</span>
                <span className="font-medium text-foreground">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de suspensión:</span>
                <span className="font-medium text-foreground">15 de enero, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Último pago:</span>
                <span className="font-medium text-foreground">$79.00</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover">
              <CreditCard className="w-4 h-4" />
              <span>Actualizar Método de Pago</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted">
              <RefreshCw className="w-4 h-4" />
              <span>Reactivar Suscripción</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
