export function BottomSections() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-12">
      <div className="bg-card  p-6 rounded-xl border border-border  shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-foreground">Distribuci\u00F3n de stock por serie</h3>
          <button className="text-primary text-xs font-semibold hover:underline">Ver detalles</button>
        </div>
        <div className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            <p className="font-medium">Sin datos disponibles</p>
            <p className="text-sm">No hay stock registrado</p>
          </div>
        </div>
      </div>
      <div className="bg-card  p-6 rounded-xl border border-border  shadow-sm">
        <h3 className="font-bold text-lg text-foreground mb-6">Actividad reciente</h3>
        <div className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            <p className="font-medium">Sin actividad reciente</p>
            <p className="text-sm">Los movimientos aparecer\u00E1n aqu\u00ED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
