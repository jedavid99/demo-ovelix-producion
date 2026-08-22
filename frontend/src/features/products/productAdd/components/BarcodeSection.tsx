import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import type { ProductFormData } from '../types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function BarcodeSection({ form, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && form.codigo_barra) {
      try {
        JsBarcode(svgRef.current, form.codigo_barra, {
          format: 'CODE128',
          width: 2,
          height: 40,
          displayValue: true,
          fontSize: 12,
          margin: 5,
        });
      } catch {
        // invalid barcode value, ignore
      }
    }
  }, [form.codigo_barra]);

  return (
    <FormSection title="Código de barras" index={5}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5">
          <Label htmlFor="codigo_barra" className="text-xs font-semibold">Código de barras</Label>
          <Input
            id="codigo_barra"
            value={form.codigo_barra}
            onChange={e => onChange('codigo_barra', e.target.value)}
            placeholder="Ej. 7501234567890"
            className="h-9 text-sm font-mono"
          />
          <p className="text-[10px] text-muted-foreground">
            Deja vacío si no necesitas código de barras. Se genera automáticamente al escribir.
          </p>
        </div>
        <div className="flex justify-center">
          {form.codigo_barra ? (
            <div className="bg-white p-2 rounded-lg border border-border">
              <svg ref={svgRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-16 text-xs text-muted-foreground border border-dashed border-border rounded-lg w-full">
              Sin código de barras
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
