import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockService } from '@/services/stockService';
import { toast } from '@/shared/components/ui/use-toast';
import type { ProductFormData } from '../types';
import type { StockItemCreate } from '@/types/stock.types';

const initialForm: ProductFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  marca: '',
  modelo: '',
  imagen_url: '',
  proveedor_nombre: '',
  tipo_producto: 'repuesto',
  tipo_precio: 'minorista',
  canales_venta: [],
  es_por_encargo: false,
  codigo_barra: '',
  stock_actual: '0',
  stock_minimo: '5',
  stock_maximo: '',
  costo_unitario: '',
  precio_venta: '',
  ubicacion_almacen: '',
  notas: '',
};

export function useProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'es_por_encargo' && value === true) {
        next.stock_actual = '1';
        next.stock_minimo = '0';
      }
      return next;
    });
  };

  const toPayload = (): StockItemCreate => ({
    codigo: form.codigo.trim(),
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim() || undefined,
    categoria: form.categoria || 'general',
    marca: form.marca.trim() || undefined,
    modelo: form.modelo.trim() || undefined,
    imagen_url: form.imagen_url.trim() || undefined,
    proveedor_nombre: form.proveedor_nombre.trim() || undefined,
    tipo_producto: form.tipo_producto as any,
    tipo_precio: form.tipo_precio as any,
    canales_venta: form.canales_venta as any,
    es_por_encargo: form.es_por_encargo,
    codigo_barra: form.codigo_barra.trim() || undefined,
    stock_actual: form.es_por_encargo ? 1 : (parseInt(form.stock_actual) || 0),
    stock_minimo: form.es_por_encargo ? 0 : (parseInt(form.stock_minimo) || 0),
    stock_maximo: form.stock_maximo ? parseInt(form.stock_maximo) : undefined,
    costo_unitario: parseFloat(form.costo_unitario) || 0,
    precio_venta: parseFloat(form.precio_venta) || 0,
    ubicacion_almacen: form.ubicacion_almacen.trim() || undefined,
    notas: form.notas.trim() || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.codigo.trim() || !form.nombre.trim()) {
      toast({ title: 'Campos requeridos', description: 'Código y nombre son obligatorios.', variant: 'destructive' });
      return;
    }
    if (!form.costo_unitario || !form.precio_venta) {
      toast({ title: 'Campos requeridos', description: 'Costo de compra y precio de venta son obligatorios.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await stockService.create(toPayload());
      toast({ title: 'Producto agregado', description: `"${form.nombre}" se agregó al inventario.` });
      navigate('/stock');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar';
      toast({ title: 'Error', description: Array.isArray(msg) ? msg.join(', ') : msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, handleChange, handleSubmit, isSubmitting };
}
