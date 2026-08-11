import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RepairDetail } from '../../types/repairQR/repairQR.types';
import { fetchRepairByOrder } from '../../services/repairQR/repairQRApi';

export function useRepairQR() {
  const { order } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [repair, setRepair] = useState<RepairDetail | null>(null);

  useEffect(() => {
    (async () => {
      if (!order) {
        setError('No se proporcionó número de orden');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const foundRepair = await fetchRepairByOrder(order);
        if (foundRepair) {
          setRepair(foundRepair);
        } else {
          setError('No se encontró la reparación con el número de orden proporcionado');
        }
      } catch (err) {
        console.error('Error fetching repair details:', err);
        setError('Error al cargar los detalles de la reparación');
      } finally {
        setLoading(false);
      }
    })();
  }, [order]);

  const getClientDni = (repair: RepairDetail): string => {
    if (!repair) return '—';
    const { cliente } = repair;
    return (
      cliente?.dni ||
      cliente?.documento ||
      cliente?.dni_cuit ||
      cliente?.cuit ||
      cliente?.numero_documento ||
      (repair as any).dni_cliente ||
      (repair as any).cliente_dni ||
      '—'
    );
  };

  const getTechnicianName = (repair: RepairDetail): string => {
    if (!repair) return '—';
    const { tecnico } = repair;
    if (tecnico && typeof tecnico === 'object') {
      return tecnico?.nombre || tecnico?.name || '—';
    }
    if (typeof tecnico === 'string') return tecnico;
    return (repair as any).tecnico_nombre || (repair as any).tecnico_asignado || '—';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return {
    order, loading, error, repair,
    getClientDni, getTechnicianName, formatCurrency, formatDate,
  };
}
