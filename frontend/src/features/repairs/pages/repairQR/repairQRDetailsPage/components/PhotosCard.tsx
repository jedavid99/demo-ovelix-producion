import { Camera, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { parsePhotoEntry, formatPhotoDate } from '@/shared/lib/photoUtils';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface PhotosCardProps {
  repair: RepairDetail;
}

export function PhotosCard({ repair }: PhotosCardProps) {
  const hasAntes = repair.fotos_antes?.length;
  const hasDespues = repair.fotos_despues?.length;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><Camera className="w-5 h-5 text-primary" />Fotos del Equipo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        {hasAntes ? (
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3"><Camera className="w-4 h-4 text-muted-foreground" />Antes</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {repair.fotos_antes!.map((entry, idx) => {
                const photo = parsePhotoEntry(entry);
                return (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted shadow-sm border border-border/60 relative group">
                    <img src={photo.url} alt={`Antes ${idx + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    {photo.uploadedAt && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formatPhotoDate(photo.uploadedAt)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {hasDespues ? (
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3"><Camera className="w-4 h-4 text-muted-foreground" />Después</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {repair.fotos_despues!.map((entry, idx) => {
                const photo = parsePhotoEntry(entry);
                return (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted shadow-sm border border-border/60 relative group">
                    <img src={photo.url} alt={`Después ${idx + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    {photo.uploadedAt && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formatPhotoDate(photo.uploadedAt)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {!hasAntes && !hasDespues && (
          <div className="flex items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            <Camera className="w-6 h-6 mr-3 text-muted-foreground/60" />No hay fotos registradas para este equipo
          </div>
        )}
      </CardContent>
    </Card>
  );
}
