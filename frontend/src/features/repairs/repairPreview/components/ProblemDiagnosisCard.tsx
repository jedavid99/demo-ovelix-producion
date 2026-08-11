import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProblemDiagnosisCardProps {
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
}

export function ProblemDiagnosisCard({ problema_reportado, diagnosis, reparacion_realizada }: ProblemDiagnosisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Problema y Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">Problema reportado:</p>
          <p className="font-medium">{problema_reportado}</p>
        </div>
        {diagnosis && (
          <div>
            <p className="text-muted-foreground mb-1">Diagnosis:</p>
            <p className="font-medium">{diagnosis}</p>
          </div>
        )}
        {reparacion_realizada && (
          <div>
            <p className="text-muted-foreground mb-1">Reparación realizada:</p>
            <p className="font-medium">{reparacion_realizada}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
