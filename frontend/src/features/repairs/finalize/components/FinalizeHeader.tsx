import { Printer, CheckCircle2 } from 'lucide-react';

export function FinalizeHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <a className="hover:text-primary" href="#">Reparaciones</a>
            <span>/</span>
            <span className="text-foreground">Ticket #REP-001</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Entrega de Equipo & Pago Final
          </h1>
          <p className="text-muted-foreground text-base">Finaliza la liquidación del ticket y entrega el dispositivo al cliente</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground font-bold text-sm shadow-sm hover:bg-muted">
          <Printer size={18} />
          <span>Previsualización</span>
        </button>
      </div>
      <div className="bg-primary/5 border border-blue-200 rounded-xl p-6 flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="size-2 rounded-full bg-success"></span>
              Listo para Entrega
            </div>
            <h3 className="text-xl font-bold text-foreground">Reparado & Completamente Probado</h3>
            <p className="text-muted-foreground text-sm">El dispositivo ha pasado todas las pruebas de calidad e inspección final.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
