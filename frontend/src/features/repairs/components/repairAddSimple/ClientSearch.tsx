import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import type { Client } from '@/types/client.types';

interface ClientSearchProps {
  query: string;
  searching: boolean;
  results: Client[];
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (client: Client) => void;
}

export const ClientSearch = ({ query, searching, results, onQueryChange, onSelect }: ClientSearchProps) => (
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Buscar cliente</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Buscar por nombre, DNI o teléfono..." aria-label="Buscar por nombre, DNI o teléfono" value={query} onChange={onQueryChange} className="pl-10" />
      </div>
      {searching && <div className="flex items-center justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">DNI</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Teléfono</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results.map((client) => (
                <tr key={client.id} className="hover:bg-muted/50">
                  <td className="px-4 py-2 text-sm font-medium text-foreground">{client.nombre_completo}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{client.dni || '\u2014'}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{client.telefono}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{client.email || '\u2014'}</td>
                  <td className="px-4 py-2 text-right"><Button size="sm" onClick={() => onSelect(client)}>Seleccionar</Button></td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
      {query.length >= 2 && results.length === 0 && !searching && (
        <p className="text-center text-muted-foreground py-4">No se encontraron clientes</p>
      )}
    </CardContent>
  </Card>
);
