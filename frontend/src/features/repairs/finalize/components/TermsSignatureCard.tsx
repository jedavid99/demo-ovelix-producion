import { AlertTriangle, PenTool } from 'lucide-react';
import type { RepairData } from '../../RepairFlow';

interface TermsSignatureCardProps {
  state: RepairData;
  applyUpdate: (updates: Partial<RepairData>) => void;
}

export function TermsSignatureCard({ state, applyUpdate }: TermsSignatureCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-muted-foreground" />
          Términos & Condiciones
        </h3>
        <div className="flex-1 bg-muted p-3 rounded-lg text-xs text-muted-foreground leading-relaxed mb-4 max-h-40 overflow-y-auto border border-border">
          <p className="mb-2"><span className="font-bold text-foreground">1. Garantía</span></p>
          <p className="mb-3">Piezas y mano de obra cubierta por garantía limitada de 90 días, excluyendo daño físico o por líquido después de la reparación.</p>
          <p className="mb-2"><span className="font-bold text-foreground">2. Responsabilidad</span></p>
          <p>El proveedor no es responsable por pérdida de datos. Se recomienda respaldo previo.</p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={state.termsAccepted}
            onChange={(e) => applyUpdate({ termsAccepted: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-border text-primary"
          />
          <span className="text-xs font-semibold text-foreground">
            He leído y aceptolos términos y condiciones anteriores
          </span>
        </label>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <PenTool size={18} className="text-muted-foreground" />
          Firma del Cliente
        </h3>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center min-h-32 flex items-center justify-center relative bg-gradient-to-br from-slate-50 to-white">
          {!state.signaturePad ? (
            <span className="text-muted-foreground text-xs italic">Firmar aquí...</span>
          ) : (
            <div className="text-xl font-bold text-foreground">{state.signaturePad}</div>
          )}
        </div>
        <button onClick={() => applyUpdate({ signaturePad: state.selectedClient?.name || 'Cliente' })}
          className="mt-3 text-xs text-primary hover:underline font-bold"
        >
          Demo Firma
        </button>
      </div>
    </div>
  );
}
