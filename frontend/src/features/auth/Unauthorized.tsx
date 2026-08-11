import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted dark:bg-card flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card  rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldX className="w-12 h-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground  mb-2">
          Acceso No Autorizado
        </h1>
        
        <p className="text-muted-foreground dark:text-muted-foreground mb-6">
          No tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
