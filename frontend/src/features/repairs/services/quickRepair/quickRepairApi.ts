import api from '@/services/api';
import { clientService } from '@/services/clientService';
import { Client, NewClient } from '../../types/quickRepair/quickRepair.types';

export const loadBrands = async (): Promise<string[]> => {
  const response = await api.get('/brands');
  const brands = response.data?.data || response.data || [];
  return brands.map((b: any) => b.nombre) as string[];
};

export const createBrand = async (nombre: string): Promise<void> => {
  await api.post('/brands', { nombre });
};

export const createRepair = async (repairData: any): Promise<void> => {
  await api.post('/repairs', repairData);
};

export const searchClients = async (search: string): Promise<Client[]> => {
  const response: any = await clientService.list({ limit: 100 });
  let clientesArray: any = response?.data?.data?.clientes ||
    response?.data?.data?.data ||
    response?.data?.data ||
    response?.data ||
    response;

  if (clientesArray?.data?.clientes) {
    clientesArray = clientesArray.data.clientes;
  } else if (clientesArray?.data?.data) {
    clientesArray = clientesArray.data.data;
  } else if (clientesArray?.data) {
    clientesArray = clientesArray.data;
  }

  if (!Array.isArray(clientesArray)) return [];

  const searchTerms = search.toLowerCase().split(' ').filter(Boolean);
  return clientesArray.filter((client: Client) => {
    const nombreMatch = client.nombre_completo?.toLowerCase().includes(search.toLowerCase());
    const dniMatch = client.dni?.toLowerCase().includes(search.toLowerCase());
    const termsMatch = searchTerms.every(term =>
      client.nombre_completo?.toLowerCase().includes(term) ||
      client.dni?.toLowerCase().includes(term)
    );
    return nombreMatch || dniMatch || termsMatch;
  }).slice(0, 10);
};

export const createClient = async (clientData: NewClient): Promise<Client> => {
  return await clientService.create({
    nombre_completo: clientData.nombre_completo,
    dni: clientData.dni || undefined,
    telefono: clientData.telefono,
    email: clientData.email || undefined,
  });
};
