import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText } from 'lucide-react';

export function PhotoCard({ src }: { src: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Foto de Evidencia</CardTitle></CardHeader>
      <CardContent>
        <img src={src} alt="Evidencia" loading="lazy" className="w-full h-64 object-cover rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function NotesCard({ notas }: { notas: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Notas Adicionales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notas}</p>
      </CardContent>
    </Card>
  );
}
