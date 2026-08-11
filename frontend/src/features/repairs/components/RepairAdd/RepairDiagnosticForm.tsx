import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface RepairDiagnosticFormProps {
  issueDescription: string;
  technicianNotes: string;
  priority: string;
  estimatedDays: number;
  onIssueDescriptionChange: (desc: string) => void;
  onTechnicianNotesChange: (notes: string) => void;
  onPriorityChange: (priority: string) => void;
  onEstimatedDaysChange: (days: number) => void;
}

export const RepairDiagnosticForm: React.FC<RepairDiagnosticFormProps> = ({
  issueDescription,
  technicianNotes,
  priority,
  estimatedDays,
  onIssueDescriptionChange,
  onTechnicianNotesChange,
  onPriorityChange,
  onEstimatedDaysChange,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-success/10 text-success p-2 rounded-xl">
            <AlertCircle size={18} />
          </div>
          <h2 className="text-base font-bold text-foreground">Diagnóstico y Notas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rd-issue" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Descripción del Problema
            </label>
            <textarea
              id="rd-issue"
              value={issueDescription}
              onChange={(e) => onIssueDescriptionChange(e.target.value)}
              placeholder="Pantalla rota, puerto de carga suelto..."
              rows={3}
              className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
            />
          </div>
          <div>
            <label htmlFor="rd-notes" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Notas del Técnico
            </label>
            <textarea
              id="rd-notes"
              value={technicianNotes}
              onChange={(e) => onTechnicianNotesChange(e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
              className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
          <div>
            <label htmlFor="rd-priority" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Prioridad</label>
            <select
              id="rd-priority"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
            >
              <option>Normal</option>
              <option>Urgente</option>
              <option>Baja</option>
            </select>
          </div>
          <div>
            <label htmlFor="rd-days" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Días Estimados</label>
            <input
              id="rd-days"
              type="number"
              value={estimatedDays}
              onChange={(e) => onEstimatedDaysChange(parseInt(e.target.value))}
              className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
