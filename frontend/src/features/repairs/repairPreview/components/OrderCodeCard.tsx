interface OrderCodeCardProps {
  code?: string;
  id: string;
}

export function OrderCodeCard({ code, id }: OrderCodeCardProps) {
  return (
    <div className="px-6 py-5 text-center">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-1">
        Código de Orden
      </p>
      <p className="text-2xl font-bold tracking-tight text-primary">
        {code || id}
      </p>
    </div>
  );
}
