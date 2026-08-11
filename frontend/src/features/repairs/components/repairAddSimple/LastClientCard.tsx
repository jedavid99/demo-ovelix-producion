import React from 'react';
import { User, Check } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { Client } from '@/types/client.types';

interface LastClientCardProps {
  loading: boolean;
  lastClient: Client | null;
  selectedClientId: string | undefined;
  onSelect: () => void;
}

export const LastClientCard = ({ loading, lastClient, selectedClientId, onSelect }: LastClientCardProps) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><User className="h-5 w-5" /> Último cliente registrado</h2>
      {loading ? (
        <div className="space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-48" /><Skeleton className="h-10 w-32" /></div>
      ) : lastClient ? (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{lastClient.nombre_completo}</p>
            <p className="text-sm text-muted-foreground">DNI: {lastClient.dni || '\u2014'}</p>
            <p className="text-sm text-muted-foreground">Tel: {lastClient.telefono}</p>
            <p className="text-sm text-muted-foreground">{lastClient.email || 'Sin email'}</p>
          </div>
          <Button onClick={onSelect} disabled={selectedClientId === lastClient.id} className="shrink-0">
            {selectedClientId === lastClient.id ? <><Check className="h-4 w-4 mr-2" /> Seleccionado</> : 'Seleccionar este cliente'}
          </Button>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">No hay clientes registrados aún</p>
      )}
    </CardContent>
  </Card>
);
