import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { Client } from '@/types/client.types';
import type { ClientSelectorProps } from './RepairAdd.types';

interface ClientSelectorWithSearchProps extends ClientSelectorProps {
  search: string;
  searchResults: Client[];
  searching: boolean;
  lastClient: Client | null;
  loadingClients: boolean;
  onSearchChange: (search: string) => void;
  onSelectFromSearch: (client: Client) => void;
  onSelectLastClient: () => void;
}

export const ClientSelector: React.FC<ClientSelectorWithSearchProps> = ({
  selectedClient,
  onSelectClient,
  onClearClient,
  search,
  searchResults,
  searching,
  lastClient,
  loadingClients,
  onSearchChange,
  onSelectFromSearch,
  onSelectLastClient,
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Último cliente registrado */}
        {!selectedClient && !search && (
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Último cliente registrado</p>
              {loadingClients ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : null}
            </div>
            {lastClient ? (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{lastClient.nombre_completo}</p>
                  <p className="text-xs text-muted-foreground">{lastClient.telefono}</p>
                </div>
                <Button
                  size="sm"
                  onClick={onSelectLastClient}
                  className="h-7 text-xs"
                >
                  Seleccionar
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No hay clientes registrados</p>
            )}
          </div>
        )}

        {/* Buscador de clientes */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar cliente por nombre, teléfono..."
              aria-label="Buscar cliente por nombre, teléfono"
              className="w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary whitespace-nowrap px-3"
            onClick={() => navigate('/clients/add')}
          >
            <UserPlus size={16} className="mr-1" />
            Agregar
          </Button>
        </div>

        {/* Resultados de búsqueda */}
        {search && searchResults.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Nombre</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Teléfono</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {searchResults.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/50">
                    <td className="px-3 py-2 text-xs font-medium text-foreground">{client.nombre_completo}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{client.telefono}</td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        onClick={() => onSelectFromSearch(client)}
                        className="h-6 text-xs"
                      >
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}

        {search && searching && (
          <div className="flex items-center justify-center py-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {search && searchResults.length === 0 && !searching && (
          <p className="text-center text-xs text-muted-foreground py-2">
            No se encontraron clientes
          </p>
        )}

        {/* Cliente seleccionado */}
        {selectedClient ? (
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                {selectedClient.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{selectedClient.name}</p>
                <p className="text-[10px] text-muted-foreground">{selectedClient.phone}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearClient}>
              Cambiar
            </Button>
          </div>
        ) : (
          !search && (
            <p className="text-center text-xs text-muted-foreground py-2">
              No hay cliente seleccionado.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
};
