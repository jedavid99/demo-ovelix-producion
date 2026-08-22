import { Button } from '@/shared/components/ui/button';
import { BusinessInfoFormProps } from './types';
import { useBusinessInfoForm } from './hooks/useBusinessInfoForm';
import { LogoSection } from './components/LogoSection';
import { BasicInfoFields } from './components/BasicInfoFields';
import { ContactFields } from './components/ContactFields';
import { AddressFields } from './components/AddressFields';
import { ScheduleFields } from './components/ScheduleFields';
import { SystemPrefsFields } from './components/SystemPrefsFields';

export const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ businessInfo, onSubmit, onCancel, loading = false }) => {
  const { formData, errors, handleChange, setField, handleSubmit, getInitials } = useBusinessInfoForm(businessInfo, onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LogoSection
        logoUrl={formData.logo_url || ''}
        businessName={formData.nombre_negocio || ''}
        onFieldChange={setField}
        onInputChange={handleChange}
        getInitials={getInitials}
      />
      <BasicInfoFields
        nombre_negocio={formData.nombre_negocio || ''}
        propietario_nombre={formData.propietario_nombre || ''}
        descripcion={formData.descripcion || ''}
        errors={errors}
        onChange={handleChange}
      />
      <ContactFields
        email={formData.email || ''}
        telefono={formData.telefono || ''}
        sitio_web={formData.sitio_web || ''}
        errors={errors}
        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
      />
      <AddressFields
        direccion={formData.direccion || ''}
        ciudad={formData.ciudad || ''}
        provincia={formData.provincia || ''}
        codigo_postal={formData.codigo_postal || ''}
        errors={errors}
        onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
      />
      <ScheduleFields horarios={formData.horarios || {}} onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void} />
      <SystemPrefsFields
        moneda={formData.moneda || 'ARS'}
        formato_fecha={formData.formato_fecha || 'DD/MM/YYYY'}
        zona_horaria={formData.zona_horaria || 'America/Argentina/Buenos_Aires'}
        hora_cierre_caja={formData.hora_cierre_caja || '18:00'}
        margen_porcentaje={Array.isArray(formData.margen_porcentaje) ? formData.margen_porcentaje : [10, 20, 30, 50]}
        onChange={handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
        onInputChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        onMargenChange={(val) => setField('margen_porcentaje', val)}
      />
      <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
      </div>
    </form>
  );
};
