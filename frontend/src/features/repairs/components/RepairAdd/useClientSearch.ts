import { useState, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { Client } from '@/types/client.types';

export const useClientSearch = () => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const [lastClient, setLastClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);

  // Cargar último cliente al montar
  useEffect(() => {
    const fetchLastClient = async () => {
      try {
        const response = await clientService.list({ limit: 1, sort: 'created_at:desc' }) as any;
        
        let clientesArray = response?.data?.data?.clientes ||
                           response?.data?.data?.data ||
                           response?.data?.data ||
                           response?.data ||
                           response;
        
        if (Array.isArray(clientesArray) && clientesArray.length > 0) {
          setLastClient(clientesArray[0]);
        }
      } catch (error) {
        console.error('Error al cargar último cliente:', error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchLastClient();
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (search.length >= 2) {
        setSearching(true);
        try {
          const response = await clientService.list({ search: search, limit: 10 });
          
          let clientesArray = response?.data?.data?.clientes ||
                             response?.data?.data?.data ||
                             response?.data?.data ||
                             response?.data ||
                             response;
          
          if (Array.isArray(clientesArray)) {
            setSearchResults(clientesArray);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error en búsqueda:', error);
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSelectClient = useCallback((client: Client, onSelect: (client: any) => void) => {
    onSelect({
      id: client.id,
      name: client.nombre_completo,
      phone: client.telefono,
      email: client.email || ''
    });
    setSearch('');
    setSearchResults([]);
  }, []);

  const handleSelectLastClient = useCallback((onSelect: (client: any) => void) => {
    if (lastClient) {
      handleSelectClient(lastClient, onSelect);
    }
  }, [lastClient, handleSelectClient]);

  return {
    search,
    setSearch,
    searchResults,
    searching,
    lastClient,
    loadingClients,
    handleSelectClient,
    handleSelectLastClient,
  };
};
