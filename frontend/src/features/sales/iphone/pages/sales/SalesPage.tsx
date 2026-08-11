import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/shared/components/ui/use-toast';
import { calculateTotals } from '../../constants/sales/sales.constants';
import { StepIndicator } from '../../components/sales/StepIndicator';
import { KpiCards } from '../../components/sales/KpiCards';
import { ProductCatalog } from '../../components/sales/ProductCatalog';
import { CartView } from '../../components/sales/CartView';
import { EmptyCart } from '../../components/sales/EmptyCart';
import { CustomerInfoForm } from '../../components/sales/CustomerInfoForm';
import { PaymentReview } from '../../components/sales/PaymentReview';
import type { CartItem, IPhoneProduct, CustomerInfo, InsurancePlan } from '../../types/sales/sales.types';

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [insuranceSelection, setInsuranceSelection] = useState<Record<string, string>>({});

  const iphones: IPhoneProduct[] = [];
  const insurancePlans: InsurancePlan[] = [];
  const { subtotal, tax, insuranceTotal, total } = calculateTotals(cart, insurancePlans, insuranceSelection);

  const addToCart = (phone: IPhoneProduct) => {
    if (phone.stock === 'out') return;
    setCart([...cart, {
      id: `${phone.id}-${Date.now()}`,
      model: phone.name,
      price: phone.price,
      storage: phone.storage,
      color: phone.color,
      quantity: 1,
    }]);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCompleteSale = () => {
    toast({ title: 'Éxito', description: `Venta completada! Total: $${total.toFixed(2)}` });
    setCart([]);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ventas iPhone</h1>
          <p className="text-muted-foreground">Flujo de ventas completo con inventario en tiempo real</p>
        </div>
        <Badge variant={cart.length > 0 ? 'default' : 'outline'}>
          <ShoppingCart size={14} className="mr-1" />
          {cart.length} en carrito
        </Badge>
      </div>

      {currentStep === 1 && <KpiCards cartCount={cart.length} />}

      <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

      {currentStep === 1 && (
        <ProductCatalog
          searchQuery={searchQuery}
          cartLength={cart.length}
          onSearchChange={setSearchQuery}
          onContinue={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        cart.length > 0 ? (
          <CartView
            cart={cart}
            insurancePlans={insurancePlans}
            insuranceSelection={insuranceSelection}
            subtotal={subtotal}
            tax={tax}
            insuranceTotal={insuranceTotal}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onInsuranceSelect={(itemId, planId) =>
              setInsuranceSelection({ ...insuranceSelection, [itemId]: planId })
            }
            onContinue={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        ) : (
          <EmptyCart onContinueShopping={() => setCurrentStep(1)} />
        )
      )}

      {currentStep === 3 && (
        <CustomerInfoForm
          customerInfo={customerInfo}
          onUpdate={setCustomerInfo}
          onBack={() => setCurrentStep(2)}
          onContinue={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <PaymentReview
          cart={cart}
          customerInfo={customerInfo}
          paymentMethod={paymentMethod}
          subtotal={subtotal}
          tax={tax}
          insuranceTotal={insuranceTotal}
          total={total}
          onPaymentChange={setPaymentMethod}
          onBack={() => setCurrentStep(3)}
          onComplete={handleCompleteSale}
        />
      )}
    </div>
  );
}
