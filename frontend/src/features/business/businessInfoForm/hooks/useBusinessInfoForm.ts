import { useState } from 'react';
import type { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useBusinessInfoForm(businessInfo: BusinessInfo, onSubmit: (data: BusinessInfoUpdate) => Promise<void>) {
  const [formData, setFormData] = useState<BusinessInfoUpdate>({
    nombre_negocio: businessInfo.nombre_negocio,
    propietario_nombre: businessInfo.propietario_nombre,
    email: businessInfo.email,
    telefono: businessInfo.telefono,
    direccion: businessInfo.direccion,
    ciudad: businessInfo.ciudad,
    provincia: businessInfo.provincia,
    codigo_postal: businessInfo.codigo_postal,
    sitio_web: businessInfo.sitio_web || '',
    descripcion: businessInfo.descripcion || '',
    logo_url: businessInfo.logo_url || '',
    horarios: { ...businessInfo.horarios },
    moneda: businessInfo.moneda || 'ARS',
    formato_fecha: businessInfo.formato_fecha || 'DD/MM/YYYY',
    zona_horaria: businessInfo.zona_horaria || 'America/Argentina/Buenos_Aires',
    hora_cierre_caja: businessInfo.hora_cierre_caja || '18:00',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('horarios.')) {
      const dayField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        horarios: { ...prev.horarios, [dayField]: value } as any,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const setField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre_negocio?.trim()) newErrors.nombre_negocio = 'El nombre del negocio es obligatorio';
    if (!formData.propietario_nombre?.trim()) newErrors.propietario_nombre = 'El nombre del propietario es obligatorio';
    if (!formData.email?.trim()) newErrors.email = 'El email es obligatorio';
    else if (!EMAIL_REGEX.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefono?.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es obligatoria';
    if (!formData.ciudad?.trim()) newErrors.ciudad = 'La ciudad es obligatoria';
    if (!formData.provincia?.trim()) newErrors.provincia = 'La provincia es obligatoria';
    if (!formData.codigo_postal?.trim()) newErrors.codigo_postal = 'El código postal es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'NN';

  return { formData, errors, handleChange, setField, handleSubmit, getInitials };
}
