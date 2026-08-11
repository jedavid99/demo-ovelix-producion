import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';

export function OrdersListHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Órdenes de Compra</h1>
        <p className="text-muted-foreground">Gestioná los pedidos a proveedores y su estado</p>
      </div>
      <Button onClick={() => navigate('/providers/orders/add')}>
        <MdAdd className="mr-2" />
        Nueva orden
      </Button>
    </div>
  );
}
