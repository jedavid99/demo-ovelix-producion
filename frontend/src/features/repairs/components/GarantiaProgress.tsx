import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface GarantiaProgressProps {
  tiene_garantia: boolean;
  fecha_inicio_garantia?: string;
  fecha_fin_garantia?: string;
  garantia_duracion?: number;
  garantia_unidad?: string;
}

type GarantiaEstado = 'vigente' | 'por_vencer' | 'vencida' | 'sin_garantia';

export const GarantiaProgress: React.FC<GarantiaProgressProps> = ({
  tiene_garantia,
  fecha_inicio_garantia,
  fecha_fin_garantia,
  garantia_duracion,
  garantia_unidad,
}) => {
  const [diasRestantes, setDiasRestantes] = useState<number>(0);
  const [progreso, setProgreso] = useState<number>(0);
  const [estado, setEstado] = useState<GarantiaEstado>('sin_garantia');
  const [contadorAnimado, setContadorAnimado] = useState<number>(0);

  useEffect(() => {
    if (!tiene_garantia || !fecha_inicio_garantia || !fecha_fin_garantia) {
      setEstado('sin_garantia');
      setDiasRestantes(0);
      setProgreso(0);
      return;
    }

    const inicio = new Date(fecha_inicio_garantia);
    const fin = new Date(fecha_fin_garantia);
    const ahora = new Date();

    // Calcular días restantes
    const diffTiempo = fin.getTime() - ahora.getTime();
    const dias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
    setDiasRestantes(dias);

    // Calcular progreso
    const duracionTotal = fin.getTime() - inicio.getTime();
    const tiempoTranscurrido = ahora.getTime() - inicio.getTime();
    const progresoCalculado = Math.min(100, Math.max(0, (tiempoTranscurrido / duracionTotal) * 100));
    setProgreso(progresoCalculado);

    // Determinar estado
    if (dias <= 0) {
      setEstado('vencida');
    } else if (dias <= 7) {
      setEstado('por_vencer');
    } else {
      setEstado('vigente');
    }
  }, [tiene_garantia, fecha_inicio_garantia, fecha_fin_garantia]);

  // Animación del contador
  useEffect(() => {
    let start = contadorAnimado;
    const end = Math.abs(diasRestantes);
    const duration = 1000;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));

    if (end === start) return;

    const timer = setInterval(() => {
      start += increment;
      setContadorAnimado(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, stepTime > 0 ? stepTime : 10);

    return () => clearInterval(timer);
  }, [diasRestantes]);

  if (!tiene_garantia) {
    return (
      <div className="bg-muted border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">Sin garantía</span>
        </div>
      </div>
    );
  }

  const getEstadoConfig = () => {
    switch (estado) {
      case 'vigente':
        return {
          color: 'bg-success',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
          label: 'Vigente',
        };
      case 'por_vencer':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: AlertCircle,
          label: 'Por vencer',
        };
      case 'vencida':
        return {
          color: 'bg-destructive/100',
          textColor: 'text-red-700',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-red-200',
          icon: Clock,
          label: 'Vencida',
        };
      default:
        return {
          color: 'bg-muted0',
          textColor: 'text-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: Shield,
          label: 'Sin garantía',
        };
    }
  };

  const config = getEstadoConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          <span className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <span className={`text-xs font-medium ${config.textColor}`}>
          {diasRestantes > 0 ? `Faltan ${contadorAnimado} días` : 'Expirada'}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className={`${config.color} h-2.5 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${progreso}%` }}
          role="progressbar"
          aria-valuenow={progreso}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de garantía: ${progreso.toFixed(0)}%`}
        />
      </div>

      {/* Información adicional */}
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        {fecha_inicio_garantia && (
          <div className="flex justify-between">
            <span>Inicio:</span>
            <span className="font-medium">
              {new Date(fecha_inicio_garantia).toLocaleDateString('es-AR')}
            </span>
          </div>
        )}
        {fecha_fin_garantia && (
          <div className="flex justify-between">
            <span>Fin:</span>
            <span className="font-medium">
              {new Date(fecha_fin_garantia).toLocaleDateString('es-AR')}
            </span>
          </div>
        )}
        {garantia_duracion && garantia_unidad && (
          <div className="flex justify-between">
            <span>Duración:</span>
            <span className="font-medium">
              {garantia_duracion} {garantia_unidad.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GarantiaProgress;
