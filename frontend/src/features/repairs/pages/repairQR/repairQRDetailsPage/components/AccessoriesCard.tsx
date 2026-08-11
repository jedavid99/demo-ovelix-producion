import { Package, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface AccessoriesCardProps {
  repair: RepairDetail;
}

export function AccessoriesCard({ repair }: AccessoriesCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden mt-6 lg:col-span-2">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><Package className="w-5 h-5 text-primary" />Accesorios Incluidos</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        {repair.accesorios_incluidos && repair.accesorios_incluidos.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {repair.accesorios_incluidos.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm font-medium gap-1.5"><Package className="w-3.5 h-3.5" />{item}</Badge>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed"><Info className="w-5 h-5 mr-2" />No hay accesorios incluidos</div>
        )}
      </CardContent>
    </Card>
  );
}
