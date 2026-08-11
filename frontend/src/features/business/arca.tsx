import React, { useState, useEffect } from 'react';
import {
  Key,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Upload,
  Save,
  Bell,
  User,
  Gauge,
  Lock,
  FileText,
  Database,
} from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import { settingsApi } from '../settings/services/settingsApi';

export default function ARCA() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [formData, setFormData] = useState({
    cuit: '20-12345678-9',
    pointOfSale: '0001',
    environment: 'Testing (Homologación)',
    serviceType: 'WSFE (Factura Electrónica)',
    businessType: 'Responsable Inscripto',
    defaultVAT: '21% (Standard)',
    enablePercepciones: false,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const integrations = await settingsApi.getIntegrations();
        const arcaIntegration = Array.isArray(integrations)
          ? integrations.find((i: any) => i.nombre === 'arca')
          : undefined;
        if (active && arcaIntegration) {
          setIsConnected(Boolean(arcaIntegration.conectado));
        }
      } catch (err) {
        console.error('Error cargando integraciones:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleToggleConnection = async (next: boolean) => {
    setIsToggling(true);
    try {
      const integrations = await settingsApi.getIntegrations();
      const arcaIntegration = Array.isArray(integrations)
        ? integrations.find((i: any) => i.nombre === 'arca')
        : undefined;
      if (!arcaIntegration) {
        toast({ title: 'Error', description: 'No se encontró la integración de ARCA', variant: 'destructive' });
        return;
      }
      await settingsApi.updateIntegration(arcaIntegration.id, next);
      setIsConnected(next);
      toast({ title: next ? 'Conectado' : 'Desconectado', description: next ? 'ARCA conectada correctamente' : 'Conexión ARCA desactivada' });
    } catch (err) {
      console.error('Error actualizando integración:', err);
      toast({ title: 'Error', description: 'No se pudo actualizar la conexión ARCA', variant: 'destructive' });
    } finally {
      setIsToggling(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted ">
    
      <main className="max-w-6xl mx-auto w-full p-6 lg:p-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARCA Integration Settings</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">Manage your connection to ARCA (ex-AFIP) Web Services</p>
        </div>
        {/* Connection Status Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-card  border border-border  rounded-xl shadow-sm gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isConnected
                ? 'bg-green-100 dark:bg-green-900/30 text-success dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-destructive dark:text-destructive'
            }`}>
              {isConnected ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Connection Status</h2>
              <p className={`flex items-center gap-2 font-bold text-sm ${
                isConnected
                  ? 'text-success dark:text-green-400'
                  : 'text-destructive dark:text-destructive'
              }`}>
                <span className={`size-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'} ${!isConnected && 'animate-pulse'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleConnection(!isConnected)}
              disabled={isToggling || isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Zap size={16} />
              {isToggling ? 'Guardando...' : 'Test Connection'}
            </button>
            <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full bg-muted dark:bg-muted p-0.5 transition-colors has-[:checked]:bg-primary">
              <input
                type="checkbox"
                checked={isConnected}
                disabled={isToggling || isLoading}
                onChange={(e) => handleToggleConnection(e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-full w-5 rounded-full bg-card shadow-md transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
        {/* Business Credentials & Digital Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Business Credentials */}
          <div className="p-6 bg-card  border border-border  rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
              <Key size={20} className="text-primary" />
              Business Credentials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="cuit">CUIT Number</label>
                <input
                  id="cuit"
                  type="text"
                  placeholder="20-12345678-9"
                  value={formData.cuit}
                  onChange={(e) => handleInputChange('cuit', e.target.value)}
                  className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="point-of-sale">Point of Sale</label>
                  <input
                    id="point-of-sale"
                    type="text"
                    placeholder="0001"
                    value={formData.pointOfSale}
                    onChange={(e) => handleInputChange('pointOfSale', e.target.value)}
                    className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="environment">Environment</label>
                  <select
                    id="environment"
                    value={formData.environment}
                    onChange={(e) => handleInputChange('environment', e.target.value)}
                    className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Testing (Homologación)</option>
                    <option>Production (Producción)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="service-type">Service Type</label>
                <select
                  id="service-type"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>WSFE (Factura Electrónica)</option>
                  <option>WSMTX (Detalle de Mercaderías)</option>
                  <option>WSFEX (Exportación)</option>
                  <option>WSBFE (Bienes de Capital)</option>
                </select>
              </div>
            </div>
          </div>
          {/* Digital Certificate */}
          <div className="p-6 bg-card  border border-border  rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
              <Shield size={20} className="text-primary" />
              Digital Certificate
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Upload Certificate (.crt)</label>
                <div className="border-2 border-dashed border-border dark:border-border rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                  <Upload className="text-muted-foreground group-hover:text-primary mx-auto mb-2" size={24} />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Drag or click to upload</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Private Key (.key)</label>
                <div className="border-2 border-dashed border-border dark:border-border rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                  <Lock className="text-muted-foreground group-hover:text-primary mx-auto mb-2" size={24} />
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Drag or click to upload</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground italic">Certificates are encrypted and stored securely.</p>
            </div>
          </div>
        </div>
        {/* Tax Configuration */}
        <div className="p-6 bg-card  border border-border  rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
            <FileText size={20} className="text-primary" />
            Tax Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="business-type">Business Type</label>
              <select
                id="business-type"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Responsable Inscripto</option>
                <option>Monotributista</option>
                <option>Exento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2" htmlFor="default-vat">Default VAT (IVA)</label>
              <select
                id="default-vat"
                value={formData.defaultVAT}
                onChange={(e) => handleInputChange('defaultVAT', e.target.value)}
                className="w-full bg-muted dark:bg-muted border border-border dark:border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>21% (Standard)</option>
                <option>10.5% (Reduced)</option>
                <option>27% (Enhanced)</option>
                <option>0% (Exempt)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="percepciones"
                checked={formData.enablePercepciones}
                onChange={(e) => handleInputChange('enablePercepciones', e.target.checked)}
                className="rounded border-border text-primary focus:ring-blue-600"
              />
              <label htmlFor="percepciones" className="text-sm font-medium text-foreground dark:text-muted-foreground">
                Enable Percepciones
              </label>
            </div>
          </div>
        </div>
        {/* Synchronization Logs */}
        <div className="bg-card  border border-border  rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-border  flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Database size={20} className="text-primary" />
              Synchronization Logs (Last 10)
            </h3>
            <button className="text-primary hover:text-primary dark:hover:text-blue-400 text-sm font-medium transition-colors">
              Clear Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
                <tr className="bg-muted dark:bg-muted/50 border-b border-border ">
                  <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Request Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">CAE / Response</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border ">
                {/* Conectar con API real: api.get('/arca/logs') */}
                <tr className="hover:bg-muted dark:hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-foreground">-</td>
                  <td className="px-6 py-4 font-medium text-foreground">-</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground max-w-40 truncate">-</td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-muted-foreground">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer Actions */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2.5 rounded-lg border border-border dark:border-border font-bold text-muted-foreground hover:bg-muted dark:hover:bg-muted transition-colors">
            Discard Changes
          </button>
          <button className="px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
