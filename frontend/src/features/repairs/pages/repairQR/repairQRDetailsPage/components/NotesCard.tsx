import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface NotesCardProps {
  repair: RepairDetail;
}

export function NotesCard({ repair }: NotesCardProps) {
  if (!repair.notas) return null;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><FileText className="w-5 h-5 text-primary" />Notas Adicionales</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <p className="text-sm font-medium bg-muted/30 p-4 rounded-lg whitespace-pre-wrap">{repair.notas}</p>
      </CardContent>
    </Card>
  );
}
