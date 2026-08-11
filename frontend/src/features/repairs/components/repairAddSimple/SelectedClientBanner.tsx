import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { Client } from '@/types/client.types';

interface SelectedClientBannerProps {
  client: Client;
  onChange: () => void;
}

export const SelectedClientBanner = ({ client, onChange }: SelectedClientBannerProps) => (
  <div className="border border-primary bg-primary/5 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
          {client.nombre_completo.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{client.nombre_completo}</p>
            <Badge variant="default" className="text-xs">Cliente seleccionado</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{client.telefono}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onChange}>Cambiar cliente</Button>
    </div>
  </div>
);
