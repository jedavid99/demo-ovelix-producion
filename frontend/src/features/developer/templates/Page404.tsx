import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function Page404() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <Search className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Página no encontrada</h2>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover">
              <Home className="w-4 h-4" />
              <span>Ir al Inicio</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
