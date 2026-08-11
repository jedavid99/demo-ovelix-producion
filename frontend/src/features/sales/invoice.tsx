import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Download,
  ChevronRight,
  Cloud,
  QrCode,
  Eye,
  Bell,
  Settings,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
interface InvoiceItem {
  id: string;
  description: string;
  ticketRef?: string;
  quantity: number;
  unitPrice: number;
  iva: number;
}
export default function CreateInvoice() {
  const { toast } = useToast()
  const [selectedCustomer, setSelectedCustomer] = useState('Tech Repair Hub S.A. (CUIT: 30-71452678-9)');
  const [invoiceType, setInvoiceType] = useState('A');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [dueDate, setDueDate] = useState('2023-11-25');
  const [pointOfSale, setPointOfSale] = useState('00005');
  const [sendEmail, setSendEmail] = useState(true);
  const [autoDeductInventory, setAutoDeductInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'Logic Board Repair - iPhone 13',
      ticketRef: 'Linked to Ticket #8842',
      quantity: 1,
      unitPrice: 45000,
      iva: 21,
    },
    {
      id: '2',
      description: 'Screen Protector - Privacy Glass',
      ticketRef: 'Inventory SKU: SP-13-PRIV',
      quantity: 2,
      unitPrice: 2500,
      iva: 21,
    },
  ]);
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      iva: 21,
    };
    setItems([...items, newItem]);
  };
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  const calculateSubtotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const tax = (subtotal * item.iva) / 100;
    return subtotal + tax;
  };
  const calculateTotals = () => {
    let neto = 0;
    let iva21 = 0;
    let iva105 = 0;
    items.forEach(item => {
      const subtotal = item.quantity * item.unitPrice;
      neto += subtotal;
      
      if (item.iva === 21) {
        iva21 += (subtotal * 21) / 100;
      } else if (item.iva === 10.5) {
        iva105 += (subtotal * 10.5) / 100;
      }
    });
    return {
      neto,
      iva21,
      iva105,
      total: neto + iva21 + iva105,
    };
  };
  const totals = calculateTotals();
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    toast({
      title: "Factura creada exitosamente",
      description: "La factura ha sido generada y autorizada por ARCA.",
    })
  }
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Factura</CardTitle>
          <CardDescription>Completa los datos para generar la factura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente</Label>
            <select
              id="customer"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full rounded border border-input bg-background text-foreground py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            >
              <option>Consumidor Final</option>
              <option>Tech Repair Hub S.A. (CUIT: 30-71452678-9)</option>
              <option>Gomez, Juan Alberto (DNI: 28.456.123)</option>
            </select>
          </div>
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
            />
          </div>
          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus size={16} className="mr-2" />
                Agregar item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 items-start p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Descripción"
                      value={item.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(item.id, 'description', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Input
                        type="number"
                        placeholder="Precio"
                        value={item.unitPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ítem ${item.description || item.id}`}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="text-2xl font-bold text-foreground">
              Total: $ {totals.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="flex-1">
            {isSubmitting ? 'Creando...' : 'Crear Factura'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
