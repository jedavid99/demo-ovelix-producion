import { Wrench, Camera } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  repairId: string;
}

export function ActionButtons({ repairId }: ActionButtonsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <Button onClick={() => navigate(`/reparaciones/edit/${repairId}`)} className="flex-1 gap-2" size="lg">
        <Wrench className="w-4 h-4" />Editar Reparación
      </Button>
      <Button variant="outline" onClick={() => navigate('/reparaciones/qr-scanner')} className="flex-1 gap-2" size="lg">
        <Camera className="w-4 h-4" />Escanear Otro QR
      </Button>
    </div>
  );
}
