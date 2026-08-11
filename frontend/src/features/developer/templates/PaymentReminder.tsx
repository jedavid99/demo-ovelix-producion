import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export default function PaymentReminder() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Recordatorio de Pago Pendiente</h1>
            <p className="text-muted-foreground">
              Tu pago mensual vence en <span className="font-semibold text-yellow-600">5 días</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Importante</h3>
                <p className="text-sm text-yellow-800">
                  Para evitar la suspensión de tu cuenta, por favor realiza el pago antes de la fecha de vencimiento.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Detalles del pago</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan actual:</span>
                <span className="font-medium text-foreground">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto a pagar:</span>
                <span className="font-bold text-2xl text-primary">$79.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de vencimiento:</span>
                <span className="font-medium text-foreground flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  20 de enero, 2024
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de pago:</span>
                <span className="font-medium text-foreground">•••• 4242</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-green-900 mb-3">Beneficios de mantener tu suscripción</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Acceso continuo a todas las funcionalidades del sistema</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Soporte prioritario 24/7</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-green-800">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Actualizaciones automáticas sin costo adicional</span>
              </li>
            </ul>
          </div>

          <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover">
            <CreditCard className="w-4 h-4" />
            <span>Pagar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
}
