import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import type { OrderItem } from '../types';
import { generateOrderNumber } from '../constants';

function createEmptyItem(): OrderItem {
  const id = Date.now().toString();
  return { id, productId: '', productName: '', quantity: 1, unitPrice: 0, subtotal: 0 };
}

export function useOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());
  const [providerId, setProviderId] = useState('');
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState('Pendiente');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      setTimeout(() => {
        setOrderNumber('#OC-001');
        setProviderId('1');
        setIssueDate('2024-06-01');
        setDeliveryDate('2024-06-10');
        setStatus('Enviada');
        setNotes('Pedido urgente');
        setItems([
          { id: '1', productId: '1', productName: 'Pantalla iPhone 14', quantity: 5, unitPrice: 85000, subtotal: 425000 },
          { id: '2', productId: '3', productName: 'Batería Samsung J7', quantity: 10, unitPrice: 15000, subtotal: 150000 },
        ]);
        setLoading(false);
      }, 500);
    } else {
      addItem();
    }
  }, [isEditing]);

  const addItem = () => setItems(prev => [...prev, createEmptyItem()]);

  const removeItem = (itemId: string) => {
    if (items.length > 1) setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: keyof OrderItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const updated = { ...item, [field]: value };
      if (field === 'productId') {
        updated.productName = '';
        updated.unitPrice = 0;
      }
      if (field === 'quantity' || field === 'unitPrice') {
        updated.subtotal = (updated.quantity || 0) * (updated.unitPrice || 0);
      }
      return updated;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!providerId) newErrors.providerId = 'El proveedor es requerido';
    if (!deliveryDate) newErrors.deliveryDate = 'La fecha de entrega es requerida';
    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto';
    } else {
      items.forEach((item, index) => {
        if (!item.productId) newErrors[`item-${index}-product`] = 'El producto es requerido';
        if (item.quantity <= 0) newErrors[`item-${index}-quantity`] = 'La cantidad debe ser mayor a 0';
        if (item.unitPrice <= 0) newErrors[`item-${index}-price`] = 'El precio debe ser mayor a 0';
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate('/providers/orders'); }, 1000);
  };

  return {
    loading, saving, isEditing, errors, orderNumber, providerId, issueDate, deliveryDate, status, notes, items,
    subtotal, iva, total,
    setOrderNumber, setProviderId, setIssueDate, setDeliveryDate, setStatus, setNotes,
    addItem, removeItem, updateItem, handleSubmit, navigate,
  };
}
