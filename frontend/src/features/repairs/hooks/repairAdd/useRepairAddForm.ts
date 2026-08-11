import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientService } from '@/services/clientService';
import { repairService } from '@/services/repairService';
import { toast } from '@/shared/components/ui/use-toast';
import { logger } from '@/utils/logger';
import { repairCreateSchema, RepairCreateFormData } from '@/validations/repair.validation';
import type { Client } from '@/types/client.types';
import type { RepairCreate } from '@/types/repair.types';

export function useRepairAddForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastClient, setLastClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);

  const form = useForm<RepairCreateFormData>({
    resolver: zodResolver(repairCreateSchema),
    defaultValues: {
      dispositivo: '', marca: '', modelo: '', problema_reportado: '',
      diagnosis: '', prioridad: 'medium', fecha_ingreso: new Date().toISOString().split('T')[0],
      notas: '', tecnico_asignado_id: '',
    },
  });

  useEffect(() => {
    const fetchLastClient = async () => {
      try {
        const response: unknown = await clientService.list(({ limit: 1, sort: 'created_at:desc' }) as any);
        const resp = response as Record<string, unknown>;
        const clients = resp?.data as Record<string, unknown> | undefined;
        const arr = (clients?.data as Client[]) || (clients?.clientes as Client[]) || [];
        if (arr.length > 0) setLastClient(arr[0]);
      } catch (error) {
        console.error('Error al cargar último cliente:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLastClient();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearching(true);
        try {
          const response: unknown = await clientService.list({ search: searchQuery, limit: 10 });
          const resp2 = response as Record<string, unknown>;
          const data = resp2?.data as Record<string, unknown> | undefined;
          setSearchResults((data?.clientes as Client[]) || (data?.data as Client[]) || []);
        } catch { setSearchResults([]); } finally { setSearching(false); }
      } else setSearchResults([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const handleSelectLastClient = useCallback(() => {
    if (lastClient) setSelectedClient(lastClient);
  }, [lastClient]);

  const handleChangeClient = () => setSelectedClient(null);

  const handleCancel = () => navigate('/reparaciones/list');

  const onSubmit = async (data: RepairCreateFormData) => {
    if (!selectedClient) {
      toast({ title: 'Error de validación', description: 'Debe seleccionar un cliente para la reparación', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const payload = {
      cliente_id: selectedClient.id, dispositivo: data.dispositivo, marca: data.marca || undefined,
      modelo: data.modelo || undefined, problema_reportado: data.problema_reportado,
      diagnosis: data.diagnosis || undefined, prioridad: data.prioridad,
      fecha_ingreso: data.fecha_ingreso, tecnico_asignado_id: data.tecnico_asignado_id || undefined,
      notas: data.notas || undefined,
    };
    try {
      const result = await repairService.create(payload);
      toast({ title: 'Éxito', description: '¡Reparación registrada correctamente!' });
      navigate(`/reparaciones/${result.id}`);
    } catch (error) {
      logger.error('Error al crear reparación:', error);
    } finally { setSubmitting(false); }
  };

  return {
    form, loading, submitting, lastClient, selectedClient, searchQuery, searchResults, searching,
    setSearchQuery, handleSelectClient, handleSelectLastClient, handleChangeClient, handleCancel, onSubmit,
  };
}
