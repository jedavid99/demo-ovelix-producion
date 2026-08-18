import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera, X, ArrowLeft } from 'lucide-react';
import logo from '/ovelix-claro.png';

export default function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current = scanner;

    const onScanSuccess = (decodedText: string) => {
      try {
        // El QR contiene un JSON con el campo "orden"
        const qrData = JSON.parse(decodedText);
        const orderNumber = qrData.orden;
        
        if (orderNumber) {
          // Detener el escáner y liberar la cámara
          scanner.clear().then(() => {
            setIsScanning(false);
            // Redirigir a la página protegida de detalles de reparación
            navigate(`/reparaciones/qr-details/${orderNumber}`);
          }).catch(console.error);
        } else {
          setError('El QR no contiene un número de orden válido');
        }
      } catch (e) {
        console.error('Error al parsear QR:', e);
        setError('Formato de QR inválido');
      }
    };

    const onScanFailure = (error: string) => {
      // No mostrar error por cada fallo de escaneo (es normal mientras busca)
      // console.warn(`Error de escaneo: ${error}`);
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      // Limpiar el escáner y liberar la cámara al desmontar
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [navigate]);

  const handleCancel = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    navigate('/reparaciones/list');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f9f9ff] to-[#eef2ff]">
      {/* Header */}
      <div className=" border-[#c2c6d6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-[#424754] hover:text-[#0058be] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Cancelar</span>
            </button>
           
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0058be]/10 rounded-full mb-4">
              <Camera className="w-8 h-8 text-[#0058be]" />
            </div>
            <h1 className="text-2xl font-bold text-[#191b23] mb-2">
              Escanear Código QR
            </h1>
            <p className="text-[#424754]">
              Apunta la cámara al código QR de la orden de servicio
            </p>
          </div>

          {isScanning && (
            <div className="space-y-4">
              <div id="reader" className="w-full"></div>
              <p className="text-center text-sm text-[#727785]">
                Coloca el código QR dentro del marco para escanear
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!isScanning && (
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#0058be] text-white hover:bg-[#2170e4] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200"
              >
                Escanear otro código
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#727785]">
            Asegúrate de tener buena iluminación y que el código QR esté claro
          </p>
        </div>
      </div>
    </main>
  );
}
