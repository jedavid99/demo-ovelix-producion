import { useState, useEffect, useCallback } from 'react';
import { repairService } from '@/services/repairService';
import { clientService } from '@/services/clientService';
import { toast } from '@/shared/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { RepairData, FormData, RepairPart } from './RepairEdit.types';
import { initialFormData } from './RepairEdit.types';

export const useRepairEdit = (id: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [repuestos, setRepuestos] = useState<RepairPart[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: '',
    cantidad: 1,
    costo_unitario: 0,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Cargar datos de la reparación
  const loadRepairData = useCallback(async (repairId: string) => {
    try {
      setLoading(true);
      const response = await repairService.getById(repairId) as any;
      const orderData = response?.data?.data || response?.data || response;
      
      
      // Cargar datos del cliente para obtener nombre, DNI y teléfono
      let clienteData = null;
      if (orderData.cliente_id) {
        try {
          const clientResponse = await clientService.getById(orderData.cliente_id) as any;
          clienteData = clientResponse?.data?.data || clientResponse?.data || clientResponse;
        } catch (error) {
          console.error('Error al cargar cliente:', error);
        }
      }
      
      setRepairData({
        ...orderData,
        cliente_nombre: clienteData?.nombre_completo || orderData.cliente_nombre || orderData.cliente?.nombre_completo || null,
        cliente_telefono: clienteData?.telefono || orderData.cliente_telefono || orderData.cliente?.telefono || null,
        cliente_dni: clienteData?.dni || orderData.dni || orderData.cliente?.dni || null,
      });

      const totalReparacionValue = parseFloat(orderData.total_reparacion) || parseFloat(orderData.costo_estimado) || 0;
      
      setFormData({
        problema_reportado: orderData.problema_reportado || '',
        diagnosis: orderData.diagnosis || '',
        reparacion_realizada: orderData.reparacion_realizada || '',
        estado: orderData.estado || 'diagnostic',
        costo_piezas: orderData.costo_piezas || 0,
        costo_mano_obra: orderData.costo_mano_obra || 0,
        total_reparacion: totalReparacionValue,
        notas: orderData.notas || '',
        foto_evidencia: orderData.foto_evidencia || '',
        tecnico_asignado_id: orderData.tecnico_asignado_id || '',
        fecha_estimada_entrega: orderData.fecha_estimada_entrega || '',
        categoria_dispositivo: orderData.categoria_dispositivo || '',
        dispositivo: orderData.dispositivo || '',
        marca: orderData.marca || '',
        modelo: orderData.modelo || '',
        numero_serie: orderData.numero_serie || '',
        condicion_estetica: orderData.condicion_estetica || '',
        accesorios_incluidos: Array.isArray(orderData.accesorios_incluidos)
          ? orderData.accesorios_incluidos.join(', ')
          : orderData.accesorios_incluidos || '',
        tiempo_estimado_minutos: orderData.tiempo_estimado_minutos || 0,
        pagado: orderData.pagado || false,
        metodo_pago: orderData.metodo_pago || '',
        monto_pagado: orderData.monto_pagado || 0,
        tipo_seguridad: orderData.tipo_seguridad || 'none',
        pin_acceso: orderData.pin_acceso || '',
        patron_puntos: Array.isArray(orderData.patron_puntos)
          ? orderData.patron_puntos.join(', ')
          : orderData.patron_puntos || '',
        secuencia_patron: Array.isArray(orderData.secuencia_patron)
          ? orderData.secuencia_patron.join(', ')
          : orderData.secuencia_patron || '',
        chequeo_hardware: typeof orderData.chequeo_hardware === 'object'
          ? JSON.stringify(orderData.chequeo_hardware, null, 2)
          : orderData.chequeo_hardware || '',
      });

      setRepuestos(orderData.repuestos || []);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({ title: 'Error', description: 'No se pudo cargar la reparación', variant: 'destructive' });
      navigate('/reparaciones/list');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Efecto para cargar datos cuando cambia el ID
  useEffect(() => {
    if (id) loadRepairData(id);
  }, [id, loadRepairData]);

  // Efecto para actualizar costo_piezas cuando cambian repuestos
  useEffect(() => {
    const totalRepuestos = repuestos.reduce((sum, r) => sum + r.cantidad * r.costo_unitario, 0);
    setFormData((prev) => ({
      ...prev,
      costo_piezas: totalRepuestos,
    }));
  }, [repuestos]);

  // Handlers para repuestos
  const agregarRepuesto = useCallback(() => {
    if (!nuevoRepuesto.nombre || nuevoRepuesto.costo_unitario <= 0) {
      toast({ title: 'Error', description: 'Complete los datos del repuesto', variant: 'destructive' });
      return;
    }
    const repuesto: RepairPart = {
      id: Date.now().toString(),
      nombre: nuevoRepuesto.nombre,
      cantidad: nuevoRepuesto.cantidad,
      costo_unitario: nuevoRepuesto.costo_unitario,
    };
    setRepuestos([...repuestos, repuesto]);
    setNuevoRepuesto({ nombre: '', cantidad: 1, costo_unitario: 0 });
  }, [nuevoRepuesto]);

  const eliminarRepuesto = useCallback((id: string) => {
    setRepuestos(repuestos.filter(r => r.id !== id));
  }, [repuestos]);

  // Handler para guardar
  const handleSave = useCallback(async () => {
    if (!repairData) return;

    try {
      setSaving(true);

      const validTransitions: Record<string, string[]> = {
        pending: ['diagnostic', 'cancelled'],
        diagnostic: ['in_progress', 'cancelled'],
        in_progress: ['waiting_parts', 'ready', 'cancelled'],
        waiting_parts: ['in_progress', 'ready', 'cancelled'],
        ready: ['delivered'],
        delivered: [],
        cancelled: [],
      };

      const payload: any = {};

      if (formData.estado !== repairData.estado) {
        const allowed = validTransitions[repairData.estado] || [];
        if (!allowed.includes(formData.estado)) {
          toast({
            title: 'Error',
            description: `No puedes cambiar de "${repairData.estado}" a "${formData.estado}". Transición no válida.`,
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
        payload.estado = formData.estado;
      }

      // Campos de diagnóstico
      if (formData.problema_reportado) payload.problema_reportado = formData.problema_reportado;
      if (formData.diagnosis) payload.diagnosis = formData.diagnosis;
      if (formData.reparacion_realizada) payload.reparacion_realizada = formData.reparacion_realizada;
      if (formData.notas) payload.notas = formData.notas;
      if (formData.costo_piezas > 0) payload.costo_piezas = formData.costo_piezas;
      if (formData.costo_mano_obra > 0) payload.costo_mano_obra = formData.costo_mano_obra;
      if (formData.total_reparacion > 0) payload.total_reparacion = formData.total_reparacion;
      if (formData.foto_evidencia) payload.foto_evidencia = formData.foto_evidencia;
      if (formData.tecnico_asignado_id) payload.tecnico_asignado_id = formData.tecnico_asignado_id;
      if (formData.fecha_estimada_entrega) payload.fecha_estimada_entrega = formData.fecha_estimada_entrega;

      // Dispositivo
      if (formData.categoria_dispositivo) payload.categoria_dispositivo = formData.categoria_dispositivo;
      if (formData.dispositivo) payload.dispositivo = formData.dispositivo;
      if (formData.marca) payload.marca = formData.marca;
      if (formData.modelo) payload.modelo = formData.modelo;
      if (formData.numero_serie) payload.numero_serie = formData.numero_serie;
      if (formData.condicion_estetica) payload.condicion_estetica = formData.condicion_estetica;
      if (formData.accesorios_incluidos) {
        payload.accesorios_incluidos = formData.accesorios_incluidos
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      if (formData.tiempo_estimado_minutos > 0) {
        payload.tiempo_estimado_minutos = formData.tiempo_estimado_minutos;
      }

      // Pago
      payload.pagado = formData.pagado;
      if (formData.metodo_pago) payload.metodo_pago = formData.metodo_pago;
      if (formData.monto_pagado > 0) payload.monto_pagado = formData.monto_pagado;

      // Seguridad
      if (formData.tipo_seguridad) payload.tipo_seguridad = formData.tipo_seguridad;
      if (formData.pin_acceso) payload.pin_acceso = formData.pin_acceso;
      if (formData.patron_puntos) {
        payload.patron_puntos = formData.patron_puntos.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (formData.secuencia_patron) {
        payload.secuencia_patron = formData.secuencia_patron.split(',').map(s => s.trim()).filter(Boolean);
      }

      // Hardware
      if (formData.chequeo_hardware) {
        try {
          payload.chequeo_hardware = JSON.parse(formData.chequeo_hardware);
        } catch {
          payload.chequeo_hardware = formData.chequeo_hardware;
        }
      }

      // Repuestos
      if (repuestos.length > 0) {
        payload.repuestos = repuestos;
      }

      await repairService.update(repairData.id, payload);
      toast({ title: 'Éxito', description: 'Reparación actualizada correctamente' });
      navigate('/reparaciones/list');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      toast({ title: 'Error', description: 'No se pudo guardar la reparación', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }, [repairData, formData, repuestos, navigate]);

  return {
    loading,
    saving,
    repairData,
    formData,
    setFormData,
    repuestos,
    setRepuestos,
    nuevoRepuesto,
    setNuevoRepuesto,
    uploadingPhoto,
    setUploadingPhoto,
    agregarRepuesto,
    eliminarRepuesto,
    handleSave,
  };
};
