import { useState, useEffect } from 'react';
import { EstadoReparacion } from '@/features/repairs/enums/estado-reparacion.enum';
import { API_BASE } from '@/services/api';

const API_URL = API_BASE;

export function usePermittedStates(repairId: string) {
  const [permitted, setPermitted] = useState<EstadoReparacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repairId) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('access_token');
    const url = `${API_URL}/repairs/${repairId}/estados-permitidos`;
    
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener estados permitidos');
        return res.json();
      })
      .then((data) => {
        setPermitted(data.data?.data?.permitted || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [repairId]);

  return { permitted, loading, error };
}
