import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/shared/components/ui/dialog';
import { toast } from '@/shared/components/ui/use-toast';
import { stockService } from '@/services/stockService';
import { parseImportedFile, IMPORT_FORMATS } from '@/services/stockImportExport';
import type { StockItemCreate } from '@/types/stock.types';

interface Props {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

type Step = 'upload' | 'preview' | 'importing' | 'done';

export function StockImportModal({ open, onClose, onImported }: Props) {
  const [step, setStep] = useState<Step>('upload');
  const [items, setItems] = useState<StockItemCreate[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState({ total: 0, current: 0, success: 0, failed: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep('upload');
    setItems([]);
    setErrors([]);
    setProgress({ total: 0, current: 0, success: 0, failed: 0 });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (file: File) => {
    try {
      const parsed = await parseImportedFile(file);
      if (parsed.length === 0) {
        toast({ title: 'Archivo vacío', description: 'No se encontraron productos válidos en el archivo.', variant: 'destructive' });
        return;
      }
      const validationErrors: string[] = [];
      const valid = parsed.filter((item, i) => {
        if (!item.codigo?.trim()) { validationErrors.push(`Fila ${i + 1}: código vacío`); return false; }
        if (!item.nombre?.trim()) { validationErrors.push(`Fila ${i + 1}: nombre vacío`); return false; }
        if (!item.costo_unitario || item.costo_unitario <= 0) { validationErrors.push(`Fila ${i + 1}: costo inválido`); return false; }
        if (!item.precio_venta || item.precio_venta <= 0) { validationErrors.push(`Fila ${i + 1}: precio inválido`); return false; }
        return true;
      });
      setItems(valid);
      setErrors(validationErrors);
      setStep('preview');
    } catch (err: any) {
      toast({ title: 'Error al leer archivo', description: err.message, variant: 'destructive' });
    }
  };

  const handleImport = async () => {
    setStep('importing');
    setProgress({ total: items.length, current: 0, success: 0, failed: 0 });

    let success = 0;
    let failed = 0;

    for (let i = 0; i < items.length; i++) {
      try {
        await stockService.create(items[i]);
        success++;
      } catch {
        failed++;
      }
      setProgress({ total: items.length, current: i + 1, success, failed });
    }

    setStep('done');
    if (success > 0) {
      toast({ title: 'Importación completada', description: `${success} productos importados${failed > 0 ? `, ${failed} fallidos` : ''}.` });
      onImported();
    }
  };

  const accept = IMPORT_FORMATS.flatMap(f => f.ext.split(',').join(','));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet size={18} /> Importar productos
          </DialogTitle>
          <DialogDescription>
            Sube un archivo Excel, CSV o JSON con tu inventario.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
            >
              <Upload size={32} className="text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Haz clic o arrastra un archivo</p>
                <p className="text-xs text-muted-foreground mt-1">Excel (.xlsx, .xls), CSV (.csv) o JSON (.json)</p>
              </div>
            </button>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Formato esperado (columnas):</p>
              <p className="font-mono text-[10px] bg-muted/50 rounded px-2 py-1">
                Código, Nombre, Categoría, Marca, Modelo, Stock actual, Stock mínimo, Costo unitario, Precio de venta
              </p>
              <p>Código y nombre son obligatorios. Las filas sin código válido serán omitidas.</p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            {errors.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-medium mb-1">
                  <AlertCircle size={14} /> {errors.length} advertencia(s)
                </div>
                <ul className="text-[10px] text-amber-600 dark:text-amber-500 space-y-0.5 max-h-20 overflow-y-auto">
                  {errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                  {errors.length > 5 && <li>...y {errors.length - 5} más</li>}
                </ul>
              </div>
            )}
            <div className="border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Código</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Nombre</th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Categoría</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Costo</th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.slice(0, 50).map((item, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono">{item.codigo}</td>
                      <td className="px-3 py-2">{item.nombre}</td>
                      <td className="px-3 py-2">{item.categoria}</td>
                      <td className="px-3 py-2 text-right">${item.costo_unitario}</td>
                      <td className="px-3 py-2 text-right">${item.precio_venta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length > 50 && (
                <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                  Mostrando 50 de {items.length} productos
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={reset}>
                <X size={14} className="mr-1" /> Volver
              </Button>
              <Button size="sm" onClick={handleImport}>
                <Upload size={14} className="mr-1" /> Importar {items.length} productos
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="space-y-4 py-4">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Importando {progress.current} de {progress.total}...
              <span className="ml-2 text-emerald-600">{progress.success} OK</span>
              {progress.failed > 0 && <span className="ml-2 text-destructive">{progress.failed} fallidos</span>}
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-foreground">Importación completada</p>
              <p className="text-xs text-muted-foreground mt-1">
                {progress.success} productos importados{progress.failed > 0 ? `, ${progress.failed} fallidos` : ''}
              </p>
            </div>
            <Button size="sm" onClick={handleClose}>Cerrar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
