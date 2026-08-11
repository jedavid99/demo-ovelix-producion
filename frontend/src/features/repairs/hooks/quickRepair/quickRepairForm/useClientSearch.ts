import { useState, useEffect } from 'react';
import { searchClients as searchClientsApi, createClient as createClientApi } from '../../../services/quickRepair/quickRepairApi';
import type { Client, NewClient } from '../../../types/quickRepair/quickRepair.types';

interface ClientDeps {
  clientSearch: string;
  setClientSearch: (v: string) => void;
  setClients: (v: Client[]) => void;
  setShowClientDropdown: (v: boolean) => void;
  setError: (v: string | null) => void;
}

export function useClientSearchState() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState<NewClient>({ nombre_completo: '', dni: '', telefono: '', email: '' });
  const [creatingClient, setCreatingClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (clientSearch.length < 2) {
        setClients([]);
        setShowClientDropdown(false);
        return;
      }
      try {
        const filteredClients = await searchClientsApi(clientSearch);
        setClients(filteredClients);
        setShowClientDropdown(true);
      } catch (err) {
        console.error('Error searching clients:', err);
        setClients([]);
        setShowClientDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [clientSearch]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.nombre_completo);
    setShowClientDropdown(false);
  };

  const handleCreateClient = async (setError: (v: string | null) => void) => {
    if (!newClient.nombre_completo.trim() || !newClient.telefono.trim()) {
      setError('Por favor completa el nombre y tel\u00E9fono del cliente');
      return;
    }
    try {
      setCreatingClient(true);
      setError(null);
      const createdClient = await createClientApi(newClient);
      setSelectedClient(createdClient);
      setClientSearch(createdClient.nombre_completo);
      setShowNewClientForm(false);
      setNewClient({ nombre_completo: '', dni: '', telefono: '', email: '' });
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err?.response?.data?.message || 'Error al crear el cliente');
    } finally {
      setCreatingClient(false);
    }
  };

  const handleShowNewClientForm = () => {
    setShowNewClientForm(true);
    setShowClientDropdown(false);
    setNewClient({ nombre_completo: clientSearch, dni: '', telefono: '', email: '' });
  };

  return {
    clients, setClients, selectedClient, setSelectedClient,
    showClientDropdown, setShowClientDropdown, showNewClientForm, setShowNewClientForm,
    newClient, setNewClient, creatingClient, clientSearch, setClientSearch,
    handleClientSelect, handleCreateClient, handleShowNewClientForm,
  };
}
