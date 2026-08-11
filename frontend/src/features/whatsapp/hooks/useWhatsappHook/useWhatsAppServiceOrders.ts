import { useEffect } from 'react';
import * as api from '../../api/whatsapp/whatsappApi';
import { CACHE_DURATION } from '../../constants/whatsapp/whatsapp.constants';
import type { Contact } from '../../whatsapp.types';

interface ServiceOrdersDeps {
  orderOpen: boolean;
  selectedContact: Contact | null;
  serviceOrders: any[];
  setServiceOrders: (orders: any[]) => void;
  loadingServiceOrders: boolean;
  setLoadingServiceOrders: (v: boolean) => void;
  serviceOrdersError: string | null;
  setServiceOrdersError: (err: string | null) => void;
  serviceOrdersCache: { data: any[]; timestamp: number } | null;
  setServiceOrdersCache: (cache: { data: any[]; timestamp: number } | null) => void;
}

export function useWhatsAppServiceOrders(deps: ServiceOrdersDeps) {
  const {
    orderOpen, selectedContact, setServiceOrders,
    setLoadingServiceOrders, setServiceOrdersError, serviceOrdersCache, setServiceOrdersCache,
  } = deps;

  useEffect(() => {
    if (orderOpen && selectedContact) {
      const now = Date.now();
      if (serviceOrdersCache && (now - serviceOrdersCache.timestamp) < CACHE_DURATION) {
        setServiceOrders(serviceOrdersCache.data);
        setServiceOrdersError(null);
        return;
      }

      setLoadingServiceOrders(true);
      setServiceOrdersError(null);

      (async () => {
        try {
          const response = await api.getRepairsByClient(selectedContact.id);
          const orders = response.data?.data?.data?.data || [];

          const formattedOrders = Array.isArray(orders) ? orders.map((repair: any) => ({
            id: repair.id,
            orderNumber: repair.numero_orden || `${repair.numero_reparacion}`,
            clientName: repair.cliente?.nombre_completo || selectedContact.name,
            device: repair.dispositivo || 'Dispositivo',
            status: repair.estado || 'pending',
            total: repair.total_reparacion || 0,
            date: repair.fecha_ingreso,
          })) : [];

          setServiceOrders(formattedOrders);
          setServiceOrdersCache({ data: formattedOrders, timestamp: now });
          setLoadingServiceOrders(false);
          setServiceOrdersError(null);
        } catch (error) {
          console.error('Error loading service orders:', error);
          setServiceOrders([]);
          setLoadingServiceOrders(false);
          setServiceOrdersError('Error al cargar las \u00F3rdenes de servicio. Por favor, intenta nuevamente.');
        }
      })();
    }
  }, [orderOpen, selectedContact]);

  return {};
}
