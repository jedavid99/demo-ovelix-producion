import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import type { ProductFormData } from '../types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function NotesSection({ form, onChange }: Props) {
  return (
    <FormSection title="Notas" index={3}>
      <div className="space-y-1.5">
        <Label htmlFor="notas" className="text-xs font-semibold">Notas internas</Label>
        <textarea
          id="notas"
          value={form.notas}
          onChange={e => onChange('notas', e.target.value)}
          placeholder="Información adicional, proveedor, garantía, etc."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>
    </FormSection>
  );
}
