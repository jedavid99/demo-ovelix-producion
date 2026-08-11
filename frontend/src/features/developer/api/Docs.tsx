import React from 'react';
import { FileText, Globe, ExternalLink, Book, Code, Zap } from 'lucide-react';
import { API_BASE } from '@/services/api';

export default function Docs() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">API Docs</h2>
        <p className="text-sm text-muted-foreground mt-1">Documentación de la API y Swagger integrado</p>
      </div>

      {/* Swagger UI */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Swagger UI</h3>
              <p className="text-sm text-muted-foreground">Documentación interactiva de la API</p>
            </div>
          </div>
          <a
            href={`${API_BASE}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Swagger</span>
          </a>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            URL: <code className="bg-muted px-2 py-1 rounded">{API_BASE}/docs</code>
          </p>
          <p className="text-xs text-muted-foreground">
            Swagger UI proporciona una interfaz interactiva para probar todos los endpoints de la API directamente desde el navegador.
          </p>
        </div>
      </div>

      {/* Endpoints principales */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Endpoints Principales</h3>
        <div className="space-y-3">
          {[
            { method: 'POST', path: '/api/auth/login', description: 'Autenticación de usuarios' },
            { method: 'POST', path: '/api/auth/register-developer', description: 'Registro de desarrolladores' },
            { method: 'GET', path: '/api/companies', description: 'Listar empresas' },
            { method: 'POST', path: '/api/companies', description: 'Crear nueva empresa' },
            { method: 'GET', path: '/api/users', description: 'Listar usuarios' },
            { method: 'GET', path: '/api/sales', description: 'Listar ventas' },
            { method: 'POST', path: '/api/sales', description: 'Crear venta' },
            { method: 'GET', path: '/api/stock', description: 'Listar productos' },
            { method: 'GET', path: '/api/repairs', description: 'Listar reparaciones' },
          ].map((endpoint) => (
            <div key={endpoint.path} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                endpoint.method === 'POST' ? 'bg-success text-white' :
                endpoint.method === 'GET' ? 'bg-primary text-white' :
                endpoint.method === 'PUT' ? 'bg-yellow-600 text-white' :
                endpoint.method === 'DELETE' ? 'bg-destructive text-white' :
                'bg-primary text-white'
              }`}>
                {endpoint.method}
              </span>
              <code className="text-sm text-foreground flex-1">{endpoint.path}</code>
              <span className="text-sm text-muted-foreground">{endpoint.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recursos de documentación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Guía de Uso</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Documentación completa sobre cómo usar la API
          </p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover text-sm">
            Ver Guía
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Code className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground">Ejemplos</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ejemplos de código en diferentes lenguajes
          </p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
            Ver Ejemplos
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-foreground">Postman</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Colección de Postman para probar la API
          </p>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
            Descargar
          </button>
        </div>
      </div>

      {/* Información de autenticación */}
      <div className="bg-primary/5 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Autenticación</h4>
            <p className="text-sm text-blue-800">
              La API usa JWT tokens para autenticación. Incluye el token en el header Authorization:
              <br />
              <code className="bg-primary/10 px-2 py-1 rounded mt-2 inline-block">Authorization: Bearer &lt;your_token&gt;</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
