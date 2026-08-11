import React, { useState } from 'react';
import { RefreshCw, LogOut, Smartphone } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';
import { CONNECTION_BENEFITS } from '../../constants/whatsapp/whatsapp.constants';

interface DisconnectedViewProps {
  qrCode: string | null;
  qrImageUrl: string | null;
  loading: boolean;
  connectionError: string | null;
  pairingCode: string | null;
  onGenerateQR: () => void;
  onRegenerateQR: () => void;
  onLogout: () => void;
  onRequestPairingCode: (phoneNumber: string) => void;
}

const DisconnectedView: React.FC<DisconnectedViewProps> = ({
  qrCode, qrImageUrl, loading, connectionError, pairingCode,
  onGenerateQR, onRegenerateQR, onLogout, onRequestPairingCode
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mode, setMode] = useState<'qr' | 'pairing'>('qr');

  return (
    <div className="h-full flex items-center justify-center p-4 md:p-6">
      <div className="bg-card border border-green-200/60 rounded-2xl shadow-2xl p-5 max-w-4xl w-full transition-all duration-300">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 text-success">
            <BsWhatsapp className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-green-700">Integración de WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              Integra WhatsApp en ovelix para comunicarte con tus clientes con precisión corporativa.
            </p>
          </div>
        </div>

        {connectionError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-red-200 rounded-lg text-sm text-red-700">
            {connectionError}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('qr')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${mode === 'qr' ? 'bg-success text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
          >
            QR Code
          </button>
          <button
            onClick={() => setMode('pairing')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${mode === 'pairing' ? 'bg-success text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
          >
            Código de vinculación
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="md:w-2/5 flex flex-col items-center bg-green-50/50 rounded-xl p-4 border border-green-200/40">
            {mode === 'qr' && (
              <>
                <h3 className="text-sm font-semibold text-green-700 mb-3">Conectar con código QR</h3>
                {qrImageUrl ? (
                  <>
                    <div className="bg-card p-3 rounded-lg shadow-sm border border-green-200/50">
                      <img
                        src={qrImageUrl}
                        alt="WhatsApp QR Code"
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    <p className="text-sm text-center mt-3 text-foreground">
                      Escanea con WhatsApp para vincular tu dispositivo.
                    </p>
                    <div className="mt-3 flex gap-2 w-full">
                      <button
                        onClick={onRegenerateQR}
                        className="flex-1 bg-success hover:bg-success text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerar QR
                      </button>
                      <button
                        onClick={onLogout}
                        className="flex-shrink-0 bg-destructive/100 hover:bg-destructive text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 w-full text-xs bg-card/70 p-3 rounded-lg border border-green-200/30">
                      <span className="font-medium text-green-700">Instrucciones:</span>
                      <ol className="list-decimal list-inside text-muted-foreground mt-1 space-y-0.5">
                        <li>Abre WhatsApp → Ajustes</li>
                        <li>Dispositivos vinculados</li>
                        <li>Escanea el código QR</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center py-6">
                      {loading ? (
                        <>
                          <RefreshCw className="w-10 h-10 animate-spin text-success mb-3" />
                          <p className="text-sm text-muted-foreground">Conectando con WhatsApp...</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                            <BsWhatsapp className="w-6 h-6 text-success" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Presiona el botón para generar el código QR</p>
                          <button
                            onClick={onGenerateQR}
                            className="bg-success hover:bg-success text-white text-sm py-2 px-6 rounded-lg transition-colors font-medium"
                          >
                            Generar QR
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {mode === 'pairing' && (
              <>
                <h3 className="text-sm font-semibold text-green-700 mb-3">Conectar con número de teléfono</h3>
                {pairingCode ? (
                  <div className="flex flex-col items-center py-4">
                    <Smartphone className="w-10 h-10 text-success mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Ingresa este código en WhatsApp:</p>
                    <div className="bg-card px-6 py-3 rounded-lg border-2 border-green-400 mb-3">
                      <span className="text-2xl font-bold tracking-widest text-green-700 font-mono">
                        {pairingCode}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Abre WhatsApp → Ajustes → Dispositivos vinculados → Vincular con número de teléfono
                    </p>
                    <button
                      onClick={onRegenerateQR}
                      className="mt-4 bg-success hover:bg-success text-white text-sm py-2 px-4 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Generar nuevo código
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full py-4">
                    <Smartphone className="w-10 h-10 text-success mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Ingresa tu número de teléfono con código de país para recibir un código de vinculación.
                    </p>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ej: 541234567890"
                      className="w-full px-3 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 mb-3"
                      disabled={loading}
                    />
                    <button
                      onClick={() => onRequestPairingCode(phoneNumber)}
                      disabled={loading || !phoneNumber}
                      className="w-full bg-success hover:bg-success disabled:bg-muted text-white text-sm py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      {loading ? (
                        <><RefreshCw className="w-4 h-4 inline animate-spin mr-1" /> Conectando...</>
                      ) : 'Obtener código'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="md:w-3/5">
            <h3 className="text-sm font-semibold text-green-700 mb-3">Beneficios de integrar WhatsApp</h3>
            <div className="space-y-3">
              {CONNECTION_BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-green-50/30 p-3 rounded-lg border border-green-200/30 hover:border-green-400 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisconnectedView;
