import { AlertCircle, Stethoscope, Wrench } from 'lucide-react';

interface ProblemDiagnosisCardProps {
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
}

export function ProblemDiagnosisCard({ problema_reportado, diagnosis, reparacion_realizada }: ProblemDiagnosisCardProps) {
  return (
    <div className="px-6 py-4 space-y-4">
      <Section
        icon={AlertCircle}
        iconColor="text-orange-500"
        label="Problema reportado"
        text={problema_reportado}
      />
      {diagnosis && (
        <Section
          icon={Stethoscope}
          iconColor="text-blue-500"
          label="Diagnóstico"
          text={diagnosis}
        />
      )}
      {reparacion_realizada && (
        <Section
          icon={Wrench}
          iconColor="text-green-600"
          label="Reparación realizada"
          text={reparacion_realizada}
        />
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  iconColor,
  label,
  text,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  text: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed pl-5.5">{text}</p>
    </div>
  );
}
