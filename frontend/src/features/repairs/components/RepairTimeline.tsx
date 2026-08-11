import React, { useEffect, useState } from 'react';
import { Clock, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ESTADOS_CONFIG } from '@/config/estadosReparacion.config';
import { API_BASE } from '@/services/api';

interface HistoryEntry {
  id: string;
  estado: string;
  nota: string | null;
  createdAt: string;
  usuario: { nombre: string; email: string } | null;
}

interface Props {
  repairId: string;
}

const API_URL = API_BASE;

export const RepairTimeline: React.FC<Props> = ({ repairId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    fetch(`${API_URL}/repairs/${repairId}/historial`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching history');
        return res.json();
      })
      .then((data) => {
        setHistory(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  }, [repairId]);

  if (loading) return <LoadingState label="Cargando historial..." />;
  if (history.length === 0) return <EmptyState title="Sin cambios registrados" />;

  return (
    <div className="relative pl-6 border-l-2 border-muted-foreground/20 space-y-6 py-2">
      {history.map((entry) => {
        const config = ESTADOS_CONFIG[entry.estado] || {
          label: entry.estado,
          color: '#95A5A6',
          textColor: '#FFFFFF',
        };

        return (
          <div key={entry.id} className="relative">
            <div
              className="absolute -left-[27px] w-4 h-4 rounded-full border-2 border-background shadow-sm"
              style={{ backgroundColor: config.color }}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-2.5 py-1 text-xs font-semibold rounded-full border-0 shadow-sm"
                  style={{
                    backgroundColor: config.color,
                    color: config.textColor === '#FFFFFF' ? 'white' : '#1a1a1a',
                  }}
                >
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(entry.createdAt), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
                </span>
                {entry.usuario && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {entry.usuario.nombre || entry.usuario.email}
                  </span>
                )}
              </div>
              {entry.nota && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-md flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{entry.nota}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
