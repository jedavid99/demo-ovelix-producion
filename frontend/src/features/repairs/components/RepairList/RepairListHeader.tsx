import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RepairListHeaderProps {
  onNewRepair: () => void;
}

export const RepairListHeader: React.FC<RepairListHeaderProps> = ({ onNewRepair }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Reparaciones</h1>
        <p className="text-muted-foreground">Gestiona y rastrea todos los tickets de reparación</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => navigate('/reparaciones/qr-scanner')} variant="outline">
          <Camera size={16} className="mr-2" />
          Escanear QR
        </Button>
        <Button onClick={onNewRepair}>
          <Plus size={16} className="mr-2" />
          Nueva reparación
        </Button>
      </div>
    </div>
  );
};
