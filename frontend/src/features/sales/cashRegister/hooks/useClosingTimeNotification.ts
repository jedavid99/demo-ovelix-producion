import { useEffect, useRef, useState } from 'react';
import { toast } from '@/shared/components/ui/use-toast';
import { cashClosingService } from '@/services/cashClosingService';

interface ClosingTimeInfo {
  hora_cierre: string;
  is_closing_time: boolean;
  is_past: boolean;
  diff_minutes: number;
}

export function useClosingTimeNotification() {
  const [closingInfo, setClosingInfo] = useState<ClosingTimeInfo | null>(null);
  const notifiedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const check = async () => {
      try {
        const info = await cashClosingService.checkClosingTime();
        setClosingInfo(info);

        if (info.is_closing_time && !notifiedRef.current) {
          notifiedRef.current = true;
          toast({
            title: 'Hora de cierre de caja',
            description: `Es hora de realizar el cierre de caja. Hora configurada: ${info.hora_cierre}`,
            duration: 30000,
          });
        }

        if (info.is_past && !notifiedRef.current) {
          notifiedRef.current = true;
          toast({
            title: 'Cierre de caja pendiente',
            description: `La hora de cierre (${info.hora_cierre}) ya pasó. Realice el cierre de caja.`,
            variant: 'destructive',
            duration: 30000,
          });
        }
      } catch {
        // silently fail — notification is non-critical
      }
    };

    check();
    intervalRef.current = setInterval(check, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return closingInfo;
}
