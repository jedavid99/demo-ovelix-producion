import { Card, CardContent } from '@/shared/components/ui/card';

interface InfoCardProps {
  code: string;
  id: string;
}

export function OrderCodeCard({ code, id }: InfoCardProps) {
  return (
    <Card className="bg-primary/10 border-primary">
      <CardContent className="p-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Código de Orden</p>
        <p className="text-3xl font-bold text-primary">{code || id}</p>
      </CardContent>
    </Card>
  );
}
