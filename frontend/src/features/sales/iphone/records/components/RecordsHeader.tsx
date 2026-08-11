interface RecordsHeaderProps {
  currentStep: number;
  progressPercentage: number;
  stepLabel: string;
}

export function RecordsHeader({ currentStep, progressPercentage, stepLabel }: RecordsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Registro de Ventas iPhone</h1>
        <p className="text-muted-foreground">
          Paso {currentStep} de 4: {stepLabel}
        </p>
      </div>
      <div className="flex gap-1 h-2 w-32 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
