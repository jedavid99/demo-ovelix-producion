import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { CustomerInfo } from '../../types/sales/sales.types';

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onUpdate: (info: CustomerInfo) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CustomerInfoForm = ({ customerInfo, onUpdate, onBack, onContinue }: CustomerInfoFormProps) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Información del cliente</h2>
    <Card>
      <CardContent className="p-6 space-y-5">
        <div>
          <label htmlFor="ci-name" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <User size={16} /> Nombre completo
          </label>
          <input
            id="ci-name"
            type="text"
            value={customerInfo.name}
            onChange={(e) => onUpdate({ ...customerInfo, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            placeholder="Nombre completo"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ci-email" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Mail size={16} /> Email
            </label>
            <input
              id="ci-email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => onUpdate({ ...customerInfo, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <label htmlFor="ci-phone" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Phone size={16} /> Teléfono
            </label>
            <input
              id="ci-phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => onUpdate({ ...customerInfo, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              placeholder="Número de teléfono"
            />
          </div>
        </div>
        <div>
          <label htmlFor="ci-address" className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <MapPin size={16} /> Dirección
          </label>
          <input
            id="ci-address"
            type="text"
            value={customerInfo.address}
            onChange={(e) => onUpdate({ ...customerInfo, address: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            placeholder="Dirección de entrega"
          />
        </div>
      </CardContent>
    </Card>
    <div className="flex gap-3 justify-end">
      <Button onClick={onBack} variant="outline">Atrás</Button>
      <Button onClick={onContinue} disabled={!customerInfo.name || !customerInfo.email}>
        Continuar al pago <ChevronRight size={16} className="ml-2" />
      </Button>
    </div>
  </div>
);
