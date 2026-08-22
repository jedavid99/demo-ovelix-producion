import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { StockItem, StockItemCreate } from '@/types/stock.types';

const EXPORT_COLUMNS = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'marca', label: 'Marca' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'imagen_url', label: 'Imagen URL' },
  { key: 'stock_actual', label: 'Stock actual' },
  { key: 'stock_minimo', label: 'Stock mínimo' },
  { key: 'stock_maximo', label: 'Stock máximo' },
  { key: 'costo_unitario', label: 'Costo unitario' },
  { key: 'precio_venta', label: 'Precio de venta' },
  { key: 'ubicacion_almacen', label: 'Ubicación' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'notas', label: 'Notas' },
];

export function exportStockToExcel(items: StockItem[]) {
  const data = items.map(item =>
    Object.fromEntries(EXPORT_COLUMNS.map(col => [col.label, item[col.key as keyof StockItem] ?? '']))
  );
  const ws = XLSX.utils.json_to_sheet(data);

  ws['!cols'] = EXPORT_COLUMNS.map(col => ({
    wch: col.key === 'nombre' || col.key === 'descripcion' ? 30 : 15,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `inventario_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

const FIELD_MAP: Record<string, keyof StockItemCreate> = {
  'código': 'codigo',
  'codigo': 'codigo',
  'code': 'codigo',
  'nombre': 'nombre',
  'name': 'nombre',
  'producto': 'nombre',
  'descripción': 'descripcion',
  'descripcion': 'descripcion',
  'description': 'descripcion',
  'categoría': 'categoria',
  'categoria': 'categoria',
  'category': 'categoria',
  'marca': 'marca',
  'brand': 'marca',
  'modelo': 'modelo',
  'model': 'modelo',
  'stock': 'stock_actual',
  'stock actual': 'stock_actual',
  'cantidad': 'stock_actual',
  'quantity': 'stock_actual',
  'stock mínimo': 'stock_minimo',
  'stock minimo': 'stock_minimo',
  'min': 'stock_minimo',
  'stock máximo': 'stock_maximo',
  'stock maximo': 'stock_maximo',
  'max': 'stock_maximo',
  'costo': 'costo_unitario',
  'costo unitario': 'costo_unitario',
  'cost': 'costo_unitario',
  'purchase cost': 'costo_unitario',
  'precio': 'precio_venta',
  'precio de venta': 'precio_venta',
  'price': 'precio_venta',
  'selling price': 'precio_venta',
  'ubicación': 'ubicacion_almacen',
  'ubicacion': 'ubicacion_almacen',
  'location': 'ubicacion_almacen',
  'notas': 'notas',
  'notes': 'notas',
};

function mapHeaders(headers: string[]): Record<number, keyof StockItemCreate> {
  const map: Record<number, keyof StockItemCreate> = {};
  headers.forEach((h, i) => {
    const normalized = h.toLowerCase().trim();
    if (FIELD_MAP[normalized]) {
      map[i] = FIELD_MAP[normalized];
    }
  });
  return map;
}

export function parseImportedFile(file: File): Promise<StockItemCreate[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        let workbook: XLSX.WorkBook;

        if (ext === 'csv' || ext === 'txt') {
          const text = e.target?.result as string;
          workbook = XLSX.read(text, { type: 'string' });
        } else if (ext === 'json') {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          const items = Array.isArray(json) ? json : json.data || json.items || json.stock || json.productos || [];
          const mapped = items.map(normalizeItem).filter(Boolean) as StockItemCreate[];
          resolve(mapped);
          return;
        } else {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          workbook = XLSX.read(data, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const raw: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (raw.length === 0) {
          resolve([]);
          return;
        }

        const firstRow = raw[0];
        const headers = Object.keys(firstRow);
        const headerMap = mapHeaders(headers);

        const items: StockItemCreate[] = raw
          .map(row => {
            const item: Partial<StockItemCreate> = {};
            Object.entries(headerMap).forEach(([idx, field]) => {
              const val = row[Object.keys(row)[parseInt(idx)]];
              if (val !== undefined && val !== '') {
                (item as any)[field] = val;
              }
            });
            return normalizeItem(item);
          })
          .filter(Boolean) as StockItemCreate[];

        resolve(items);
      } catch (err) {
        reject(new Error(`Error al leer el archivo: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));

    if (ext === 'csv' || ext === 'txt') {
      reader.readAsText(file);
    } else if (ext === 'json') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

function normalizeItem(raw: Record<string, any>): StockItemCreate | null {
  const codigo = String(raw.codigo || raw.Codigo || '').trim();
  const nombre = String(raw.nombre || raw.Nombre || raw.producto || raw.Producto || '').trim();
  if (!codigo || !nombre) return null;

  return {
    codigo,
    nombre,
    descripcion: raw.descripcion || raw.Descripcion || undefined,
    categoria: raw.categoria || raw.Categoria || 'general',
    marca: raw.marca || raw.Marca || undefined,
    modelo: raw.modelo || raw.Modelo || undefined,
    imagen_url: raw.imagen_url || raw.imagen || undefined,
    stock_actual: parseInt(raw.stock_actual || raw.Stock || raw.cantidad || '0') || 0,
    stock_minimo: parseInt(raw.stock_minimo || raw.StockMinimo || '0') || 0,
    stock_maximo: raw.stock_maximo || raw.StockMaximo ? parseInt(raw.stock_maximo || raw.StockMaximo) : undefined,
    costo_unitario: parseFloat(raw.costo_unitario || raw.Costo || raw.cost || '0') || 0,
    precio_venta: parseFloat(raw.precio_venta || raw.Precio || raw.price || '0') || 0,
    ubicacion_almacen: raw.ubicacion_almacen || raw.Ubicacion || undefined,
    notas: raw.notas || raw.Notas || undefined,
  };
}

export const IMPORT_FORMATS = [
  { ext: '.xlsx,.xls', label: 'Excel (.xlsx, .xls)' },
  { ext: '.csv,.txt', label: 'CSV (.csv, .txt)' },
  { ext: '.json', label: 'JSON (.json)' },
];
