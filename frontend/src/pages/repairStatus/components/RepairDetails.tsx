import { GarantiaProgress } from '@/features/repairs/components/GarantiaProgress';
import { formatDate, formatCurrency } from '../constants';
import type { RepairData } from '../types';

interface RepairDetailsProps {
  repairData: RepairData;
}

export function RepairDetails({ repairData }: RepairDetailsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8">
      <h3 className="text-xl font-bold text-[#191b23] mb-6">Detalles de la Reparaci\u00F3n</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">N\u00FAmero de Orden</p>
            <p className="text-lg font-medium text-[#191b23]">{repairData.numero_reparacion}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Dispositivo</p>
            <p className="text-lg font-medium text-[#191b23]">
              {repairData.marca} {repairData.modelo} - {repairData.dispositivo}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Fecha de Ingreso</p>
            <p className="text-lg font-medium text-[#191b23]">{formatDate(repairData.fecha_ingreso)}</p>
          </div>
          {repairData.fecha_estimada_entrega && (
            <div>
              <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Fecha Estimada de Entrega</p>
              <p className="text-lg font-medium text-[#191b23]">{formatDate(repairData.fecha_estimada_entrega)}</p>
            </div>
          )}
          {repairData.fecha_entrega && (
            <div>
              <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Fecha de Entrega</p>
              <p className="text-lg font-medium text-[#191b23]">{formatDate(repairData.fecha_entrega)}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Problema Reportado</p>
            <p className="text-base text-[#424754]">{repairData.problema_reportado}</p>
          </div>
          {repairData.diagnosis && (
            <div>
              <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Diagn\u00F3stico</p>
              <p className="text-base text-[#424754]">{repairData.diagnosis}</p>
            </div>
          )}
          {repairData.reparacion_realizada && (
            <div>
              <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Reparaci\u00F3n Realizada</p>
              <p className="text-base text-[#424754]">{repairData.reparacion_realizada}</p>
            </div>
          )}
          {repairData.tecnico_asignado && (
            <div>
              <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">T\u00E9cnico Asignado</p>
              <p className="text-base text-[#424754]">
                {repairData.tecnico_asignado.nombre} {repairData.tecnico_asignado.apellido}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#c2c6d6]/30 grid md:grid-cols-2 gap-4">
        {repairData.total_reparacion && (
          <div className="bg-[#f9f9ff] p-4 rounded-xl">
            <p className="text-xs font-semibold text-[#424754] uppercase tracking-wider mb-1">Total de Reparaci\u00F3n</p>
            <p className="text-2xl font-bold text-[#0058be]">{formatCurrency(repairData.total_reparacion)}</p>
          </div>
        )}
        <GarantiaProgress
          tiene_garantia={repairData.tiene_garantia || false}
          fecha_inicio_garantia={repairData.fecha_inicio_garantia}
          fecha_fin_garantia={repairData.fecha_fin_garantia}
          garantia_duracion={repairData.garantia_duracion}
          garantia_unidad={repairData.garantia_unidad}
        />
      </div>
    </div>
  );
}
