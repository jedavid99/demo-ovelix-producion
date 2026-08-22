import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';
import { useUpload } from '@/shared/hooks/useUpload';
import { DeviceSpecsSection } from '../../components/iphoneInventory/DeviceSpecsSection';
import { IdentificationSection } from '../../components/iphoneInventory/IdentificationSection';
import { SupplySection } from '../../components/iphoneInventory/SupplySection';
import { SalesInfoSection } from '../../components/iphoneInventory/SalesInfoSection';
import { MultimediaSection } from '../../components/iphoneInventory/MultimediaSection';
import { ActionButtons } from '../../components/iphoneInventory/ActionButtons';
import { INITIAL_FORM_DATA, validateInventory } from '../../constants/iphoneInventory/inventory.constants';
import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

export default function InventoryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IPhoneFormData>(INITIAL_FORM_DATA);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [autoSaveTime] = useState('14:24');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { upload } = useUpload({ folder: 'inventory/iphone' });

  const handleInputChange = (field: keyof IPhoneFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const result = await upload(file);
      if (result) setUploadedPhotos((prev) => [...prev, result.url]);
    }
    e.target.value = '';
  };

  const removePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newErrors = validateInventory(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSaving(true);
    setTimeout(() => {
      toast({ title: 'Éxito', description: 'Producto agregado al inventario' });
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted  p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar iPhone al Inventario</h1>
            <p className="text-sm text-muted-foreground">Completa las especificaciones técnicas y financieras para el nuevo stock.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Guardar borrador</Button>
            <Button onClick={handleSubmit} size="sm" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Confirmar y agregar'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DeviceSpecsSection formData={formData} errors={errors} onFieldChange={handleInputChange} />
            <IdentificationSection formData={formData} errors={errors} onFieldChange={handleInputChange} />
            <SupplySection formData={formData} errors={errors} onFieldChange={handleInputChange} />
          </div>
          <div className="space-y-4">
            <SalesInfoSection formData={formData} onFieldChange={handleInputChange} />
            <MultimediaSection uploadedPhotos={uploadedPhotos} onPhotoUpload={handlePhotoUpload} onRemovePhoto={removePhoto} />
            <ActionButtons isSaving={isSaving} autoSaveTime={autoSaveTime} onSubmit={handleSubmit} onNavigateInsurance={() => navigate('/stock/iphone-insurance')} />
          </div>
        </div>
      </div>
    </div>
  );
}
