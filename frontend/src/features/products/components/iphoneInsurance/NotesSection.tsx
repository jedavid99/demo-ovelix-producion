import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

interface NotesSectionProps {
  formData: InsuranceFormData;
  onFieldChange: (field: keyof InsuranceFormData, value: string) => void;
}

export const NotesSection = ({ formData, onFieldChange }: NotesSectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <FileText size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Notas Adicionales</h2>
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-xs font-semibold">Observaciones</Label>
        <textarea id="notes" value={formData.notes} onChange={(e) => onFieldChange('notes', e.target.value)}
          rows={2} placeholder="Detalles adicionales sobre el seguro..."
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
      </div>
    </CardContent>
  </Card>
);
