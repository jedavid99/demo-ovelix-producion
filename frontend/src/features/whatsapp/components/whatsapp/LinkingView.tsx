import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';

const LinkingView: React.FC = () => (
  <div className="h-full flex items-center justify-center p-4 md:p-6">
    <div className="bg-card border border-green-200/60 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <BsWhatsapp className="w-8 h-8 text-success" />
      </div>
      <h2 className="text-xl font-bold text-green-700 mb-2">Vinculando WhatsApp</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Escaneaste el código QR correctamente. Estamos conectando WhatsApp con tu sistema.
      </p>
      <div className="w-full bg-green-100 rounded-full h-3 mb-4 overflow-hidden">
        <div className="bg-success h-full rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="ml-2">Esto puede tomar unos segundos...</span>
      </div>
    </div>
  </div>
);

export default LinkingView;
