import { Tag, X } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { CATEGORIES, PART_OPTIONS } from '../constants';
import type { ProviderFormData } from '../types';

interface CategoriesSectionProps {
  form: ProviderFormData;
  toggleCategory: (cat: string) => void;
  handlePartsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  removePart: (part: string) => void;
}

export function CategoriesSection({ form, toggleCategory, handlePartsChange, removePart }: CategoriesSectionProps) {
  return (
    <FormSection icon={<Tag size={18} className="text-primary" />} title="Categorías y piezas" index={2}>
      <div className="md:col-span-3 space-y-4">
        <div>
          <Label className="text-xs font-semibold block mb-2">Categorías de suministro</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <label
                key={cat}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-all text-sm ${
                  form.categories.includes(cat)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <input
                  checked={form.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  type="checkbox"
                />
                <span className="font-medium">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="parts" className="text-xs font-semibold block mb-1.5">
            Piezas específicas que suministra
          </Label>
          <select
            id="parts" multiple
            value={form.parts}
            onChange={handlePartsChange}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
          >
            {PART_OPTIONS.map(part => (
              <option key={part} value={part}>{part}</option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Mantén <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl</kbd> o{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘</kbd> para seleccionar múltiples.
          </p>
          {form.parts.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {form.parts.map(part => (
                <Badge key={part} variant="secondary" className="text-xs px-2 py-0.5">
                  {part}
                  <button type="button" onClick={() => removePart(part)} className="ml-1 hover:text-destructive transition-colors">
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
