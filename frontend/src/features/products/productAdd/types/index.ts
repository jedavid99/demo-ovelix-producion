export interface ProductFormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  modelo: string;
  imagen_url: string;
  proveedor_nombre: string;
  tipo_producto: string;
  tipo_precio: string;
  canales_venta: string[];
  es_por_encargo: boolean;
  codigo_barra: string;
  stock_actual: string;
  stock_minimo: string;
  stock_maximo: string;
  costo_unitario: string;
  precio_venta: string;
  ubicacion_almacen: string;
  notas: string;
}

export interface ProductFormProps {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: any) => void;
}
