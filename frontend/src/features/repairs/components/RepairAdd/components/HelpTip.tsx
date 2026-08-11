export function HelpTip() {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary">i</span>
        </div>
        <span className="text-xs font-bold text-muted-foreground">Ayuda</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Completa todos los campos para crear la orden. El número de orden se genera automáticamente.
      </p>
    </div>
  );
}
