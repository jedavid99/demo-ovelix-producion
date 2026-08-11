import { useState } from 'react';
import type { ProviderFormData } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialForm: ProviderFormData = {
  businessName: '', taxId: '', website: '', contactName: '', role: '',
  phone: '', email: '', categories: [], parts: [], address: '', city: '',
  postal: '', incoterms: 'DDP', leadTime: '2-3 Business Days',
};

export function useProviderForm(onSubmit: (data: ProviderFormData) => void) {
  const [form, setForm] = useState<ProviderFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handlePartsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, o => o.value);
    setForm(prev => ({ ...prev, parts: selectedOptions }));
  };

  const removePart = (part: string) => {
    setForm(prev => ({ ...prev, parts: prev.parts.filter(p => p !== part) }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.businessName.trim()) newErrors.businessName = 'El nombre del negocio es obligatorio';
    if (!form.contactName.trim()) newErrors.contactName = 'El nombre del contacto es obligatorio';
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    if (!form.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!form.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return {
    form, errors, handleChange, toggleCategory, handlePartsChange,
    removePart, handleSubmit, setErrors,
  };
}
