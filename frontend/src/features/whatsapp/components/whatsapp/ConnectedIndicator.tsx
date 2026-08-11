import React from 'react';
import { LogOut } from 'lucide-react';

interface ConnectedIndicatorProps {
  onLogout: () => void;
}

const ConnectedIndicator: React.FC<ConnectedIndicatorProps> = ({ onLogout }) => (
  <div className="fixed bottom-6 right-6 bg-success text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 z-50 border border-green-400/30">
    <div className="relative">
      <div className="w-2.5 h-2.5 bg-card rounded-full animate-pulse" />
      <div className="absolute inset-0 w-2.5 h-2.5 bg-card rounded-full animate-ping opacity-75" />
    </div>
    <span className="text-sm font-semibold">WhatsApp Conectado</span>
    <button
      onClick={onLogout}
      className="ml-1 p-1.5 hover:bg-card/20 rounded-lg transition-colors"
      title="Desconectar"
    >
      <LogOut className="w-4 h-4" />
    </button>
  </div>
);

export default ConnectedIndicator;
