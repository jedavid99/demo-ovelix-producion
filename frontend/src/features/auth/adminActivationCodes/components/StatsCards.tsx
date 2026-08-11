import { Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import type { ActivationCode } from '../types';

interface StatsCardsProps {
  codes: ActivationCode[];
}

export function StatsCards({ codes }: StatsCardsProps) {
  const available = codes.filter(c => !c.used).length;
  const used = codes.filter(c => c.used).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-6 bg-card dark:bg-card border border-border/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 dark:bg-blue-900/30 rounded-lg">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{codes.length}</p>
            <p className="text-sm text-muted-foreground">Total de códigos</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-card dark:bg-card border border-border/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-success dark:text-green-300" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{available}</p>
            <p className="text-sm text-muted-foreground">Códigos disponibles</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-card dark:bg-card border border-border/60">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-300" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{used}</p>
            <p className="text-sm text-muted-foreground">Códigos usados</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
