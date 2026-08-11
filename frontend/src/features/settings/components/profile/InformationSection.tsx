import { MdInfo } from 'react-icons/md';
import { MapPin, Calendar } from 'lucide-react';
import { FaRegAddressCard, FaEnvelope, FaPhone, FaBuilding, FaHashtag, FaCircleUser } from "react-icons/fa6";
import { EditableField } from './EditableField';
import { updateSelf } from '@/services/users.service';

interface InformationSectionProps {
  user: any;
  onUserUpdate?: (updated: any) => void;
}

const Field = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={16} className="text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="mt-0.5 text-foreground font-medium truncate">{value || '\u2014'}</p>
    </div>
  </div>
);

export const InformationSection = ({ user, onUserUpdate }: InformationSectionProps) => {
  const fullName = [user?.nombre, user?.apellido].filter(Boolean).join(' ');
  const empresa = user?.empresa;
  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const updatedDate = user?.updated_at
    ? new Date(user.updated_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const saveField = async (field: 'nombre' | 'email' | 'dni' | 'telefono') => async (newValue: string) => {
    const payload: any = {};
    if (field === 'nombre') {
      const parts = newValue.split(/\s+/);
      payload.nombre = parts[0] || '';
      payload.apellido = parts.slice(1).join(' ') || '';
    } else if (field === 'email') {
      payload.email = newValue;
    } else if (field === 'dni') {
      payload.dni = newValue;
    } else if (field === 'telefono') {
      payload.telefono = newValue;
    }
    await updateSelf(payload);
    onUserUpdate?.({ ...user, ...payload });
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
          <MdInfo size={12} className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Información Personal</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <EditableField label="Nombre completo" value={fullName} icon={FaCircleUser} onSave={saveField('nombre')} placeholder="Nombre y apellido" />
        <EditableField label="Email" value={user?.email || ''} icon={FaEnvelope} onSave={saveField('email')} type="email" placeholder="correo@ejemplo.com" />
        <EditableField label="Teléfono" value={user?.telefono || ''} icon={FaPhone} onSave={saveField('telefono')} placeholder="Número de teléfono" />
        <EditableField label="DNI" value={user?.dni || ''} icon={FaRegAddressCard} onSave={saveField('dni')} placeholder="Número de DNI" />
        <Field icon={FaBuilding} label="Rol" value={user?.rol?.name} />
        <Field icon={FaHashtag} label="Código empresa" value={empresa?.codigo_empresa} />
        <Field icon={FaBuilding} label="Empresa" value={empresa?.razon_social} />
        <Field icon={MapPin} label="Dirección" value={[empresa?.direccion, empresa?.ciudad, empresa?.provincia].filter(Boolean).join(', ')} />
        <Field icon={Calendar} label="Fecha de registro" value={createdDate} />
        <Field icon={Calendar} label="Última actualización" value={updatedDate} />
      </div>
    </div>
  );
};
