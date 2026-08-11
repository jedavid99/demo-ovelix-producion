import React from 'react';
import { Clock, CheckCircle, CreditCard, AlertTriangle } from 'lucide-react';

export default function TrialEnd() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">¡Tu período de prueba está por terminar!</h1>
            <p className="text-muted-foreground">
              Tu prueba gratuita de 15 días finaliza en <span className="font-semibold text-orange-600">3 días</span>
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">¿Qué sucederá cuando termine tu prueba?</h3>
                <p className="text-sm text-orange-800">
                  Si no actualizas a un plan de pago, tu cuenta será suspendida y perderás acceso a todas las funcionalidades del sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-foreground">Elige tu plan ideal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-border rounded-xl p-4 hover:border-blue-500 transition-colors">
                <h4 className="font-semibold text-foreground">Básico</h4>
                <div className="text-2xl font-bold text-primary">$29</div>
                <p className="text-sm text-muted-foreground">/mes</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> 5 usuarios</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> 100 clientes</li>
                </ul>
              </div>
              <div className="border-2 border-blue-500 bg-primary/5 rounded-xl p-4">
                <h4 className="font-semibold text-foreground">Premium</h4>
                <div className="text-2xl font-bold text-primary">$79</div>
                <p className="text-sm text-muted-foreground">/mes</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> 20 usuarios</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> 500 clientes</li>
                </ul>
              </div>
              <div className="border-2 border-border rounded-xl p-4 hover:border-yellow-500 transition-colors">
                <h4 className="font-semibold text-foreground">Oro</h4>
                <div className="text-2xl font-bold text-yellow-600">$149</div>
                <p className="text-sm text-muted-foreground">/mes</p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> Usuarios ilimitados</li>
                  <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-success" /> Clientes ilimitados</li>
                </ul>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover">
            <CreditCard className="w-4 h-4" />
            <span>Actualizar Plan Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
}
