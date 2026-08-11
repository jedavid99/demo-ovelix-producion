import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface HeaderBarProps {
  numeroReparacion: string;
  statusInfo: { label: string; color: string; icon: React.ReactNode };
  priorityInfo: { label: string; color: string } | null;
}

export function HeaderBar({ numeroReparacion, statusInfo, priorityInfo }: HeaderBarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-card/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-border/60">
      <div className="flex items-center gap-4 w-full">
        <Button variant="ghost" size="icon" onClick={() => navigate('/reparaciones/qr-scanner')} className="hover:bg-primary/10 rounded-full" aria-label="Volver">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Detalles de Reparación
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" />
            Orden: <span className="font-mono font-semibold text-foreground">{numeroReparacion}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        {priorityInfo && (
          <Badge style={{ backgroundColor: priorityInfo.color, color: 'white' }} className="gap-1.5 px-3 py-1.5 text-sm font-medium shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />{priorityInfo.label}
          </Badge>
        )}
        <Badge style={{ backgroundColor: statusInfo.color, color: 'white' }} className="gap-1.5 px-3 py-1.5 text-sm font-medium shadow-sm">
          {statusInfo.icon}{statusInfo.label}
        </Badge>
      </div>
    </div>
  );
}
