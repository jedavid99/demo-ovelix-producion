import { CheckCircle } from 'lucide-react';
import { statusConfig } from '../constants';
import type { RepairData } from '../types';

interface StatusCardProps {
  repairData: RepairData;
}

export function StatusCard({ repairData }: StatusCardProps) {
  const config = statusConfig[repairData.estado];
  const IconComponent = config?.icon || CheckCircle;

  return (
    <div className={`p-6 rounded-2xl border-2 ${config?.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <IconComponent className="w-12 h-12 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold mb-1">
            {config?.label || repairData.estado}
          </h2>
          <p className="text-sm opacity-80">
            {config?.description || 'Estado de la reparaci\u00F3n'}
          </p>
        </div>
      </div>
    </div>
  );
}
