import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export const EmptyCart = ({ onContinueShopping }: EmptyCartProps) => (
  <Card>
    <CardContent className="p-12 text-center">
      <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">Tu carrito está vacío</p>
      <Button onClick={onContinueShopping} className="mt-4">
        Continuar comprando
      </Button>
    </CardContent>
  </Card>
);
