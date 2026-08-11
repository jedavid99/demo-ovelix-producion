import { useEffect } from 'react';
import * as api from '../../api/whatsapp/whatsappApi';

interface ConnectionDeps {
  isConnected: boolean;
  setIsConnected: (v: boolean) => void;
  qrCode: string | null;
  setQrCode: (v: string | null) => void;
  qrImageUrl: string | null;
  setQrImageUrl: (v: string | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  connectionError: string | null;
  setConnectionError: (v: string | null) => void;
  pairingCode: string | null;
  setPairingCode: (v: string | null) => void;
  isLinking: boolean;
  setIsLinking: (v: boolean) => void;
}

export function useWhatsAppConnection(deps: ConnectionDeps) {
  const { setIsConnected, setQrCode, setQrImageUrl, setLoading, setConnectionError, setPairingCode, setIsLinking } = deps;

  useEffect(() => {
    let mounted = true;
    let isFirstPoll = true;
    let generating = false;

    const checkConnection = async () => {
      if (generating) return;
      try {
        const response = await api.getStatus();
        const status = response.data.data;
        if (!mounted) return;

        setIsConnected(status.connected);
        setQrCode(status.qr_code);
        setQrImageUrl(status.qr_image);
        setIsLinking(status.estado === 'linking');

        if (isFirstPoll) {
          isFirstPoll = false;
          setLoading(false);
        }

        if (status.qr_image || status.connected || status.estado === 'error' || status.estado === 'connected' || status.estado === 'linking') {
          setLoading(false);
        }

        if (status.estado === 'error') {
          setConnectionError('No se pudo conectar con WhatsApp. Verifica tu conexión a internet.');
        } else {
          setConnectionError(null);
        }

        if (!status.connected && (status.estado === 'disconnected' || status.estado === 'connected') && !status.qr_code) {
          generating = true;
          setLoading(true);
          try {
            await api.generateQR();
          } finally {
            generating = false;
            if (mounted) setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking WhatsApp status:', error);
        if (!mounted) return;
        if (isFirstPoll) {
          isFirstPoll = false;
          setLoading(false);
        }
        setConnectionError('Error al verificar el estado de WhatsApp');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const handleLogout = async () => {
    try {
      await api.disconnect();
      setIsConnected(false);
      setQrCode(null);
      setQrImageUrl(null);
      setLoading(false);
      setConnectionError(null);
      setPairingCode(null);
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleGenerateQR = async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      setPairingCode(null);
      await api.generateQR();
    } catch (error) {
      console.error('Error generating QR:', error);
      setLoading(false);
    }
  };

  const handleRegenerateQR = async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      setPairingCode(null);
      await api.regenerateQR();
    } catch (error) {
      console.error('Error regenerating QR:', error);
      setLoading(false);
    }
  };

  const handleRequestPairingCode = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setConnectionError(null);
      const response = await api.requestPairingCode(phoneNumber);
      const code = response.data.data.pairingCode;
      if (code) {
        setPairingCode(code);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error requesting pairing code:', error);
      setLoading(false);
      setConnectionError(error?.response?.data?.message || 'Error al solicitar código de vinculación');
    }
  };

  return { handleLogout, handleGenerateQR, handleRegenerateQR, handleRequestPairingCode };
}
