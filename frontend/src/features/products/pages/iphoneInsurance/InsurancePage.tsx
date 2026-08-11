import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';
import { DeviceInfoSection } from '../../components/iphoneInsurance/DeviceInfoSection';
import { InsuranceInfoSection } from '../../components/iphoneInsurance/InsuranceInfoSection';
import { DatesAmountsSection } from '../../components/iphoneInsurance/DatesAmountsSection';
import { NotesSection } from '../../components/iphoneInsurance/NotesSection';
import { SummarySidebar } from '../../components/iphoneInsurance/SummarySidebar';
import { INITIAL_FORM_DATA, validateInsurance, INITIAL_ERRORS } from '../../constants/iphoneInsurance/insurance.constants';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

export default function InsurancePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InsuranceFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>(INITIAL_ERRORS);

  const handleInputChange = (field: keyof InsuranceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = validateInsurance(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: 'Éxito', description: 'Seguro agregado correctamente' });
      setIsSaving(false);
      navigate('/products/inventory');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted  p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar Seguro de iPhone</h1>
            <p className="text-sm text-muted-foreground">Registra la información del seguro del dispositivo</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/iphone/insurance')}>Cancelar</Button>
            <Button onClick={handleSubmit} size="sm" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar seguro'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DeviceInfoSection formData={formData} errors={errors} onFieldChange={handleInputChange} />
            <InsuranceInfoSection formData={formData} errors={errors} onFieldChange={handleInputChange} />
            <DatesAmountsSection formData={formData} errors={errors} onFieldChange={handleInputChange} />
            <NotesSection formData={formData} onFieldChange={handleInputChange} />
          </div>
          <SummarySidebar formData={formData} isSaving={isSaving} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
