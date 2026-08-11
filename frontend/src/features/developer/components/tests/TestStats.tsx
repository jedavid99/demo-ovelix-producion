interface TestStatsProps {
  totalTests: number;
  successCount: number;
  errorCount: number;
}

export const TestStats = ({ totalTests, successCount, errorCount }: TestStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="bg-card rounded-xl shadow-sm border border-border p-4">
      <div className="text-2xl font-bold text-primary">{totalTests}</div>
      <div className="text-sm text-muted-foreground">Total de Tests</div>
    </div>
    <div className="bg-card rounded-xl shadow-sm border border-border p-4">
      <div className="text-2xl font-bold text-success">{successCount}</div>
      <div className="text-sm text-muted-foreground">Exitosos</div>
    </div>
    <div className="bg-card rounded-xl shadow-sm border border-border p-4">
      <div className="text-2xl font-bold text-destructive">{errorCount}</div>
      <div className="text-sm text-muted-foreground">Fallidos</div>
    </div>
  </div>
);
