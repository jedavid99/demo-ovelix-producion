import { MdArrowBack } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';

interface OrderHeaderProps {
  isEditing: boolean;
  onBack: () => void;
}

export function OrderHeader({ isEditing, onBack }: OrderHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" onClick={onBack}><MdArrowBack /></Button>
      <div>
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Orden' : 'Nueva Orden de Compra'}</h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Modificá los datos de la orden' : 'Completá los datos para crear una nueva orden'}
        </p>
      </div>
    </div>
  );
}
