import { MdInfo } from 'react-icons/md';
import { Calendar, Building2, Hash, User, Mail, Phone, MapPin as LucideMapPin, Badge, LucideIcon } from 'lucide-react';
import { EditableField } from './EditableField';
import { updateSelf } from '@/services/users.service';

interface UserProfile {
  nombre?: string;
  apellido?: string;
  email?: string;
  dni?: string;
  telefono?: string;
  rol?: { name: string };
  empresa?: { razon_social: string; codigo_empresa: string; direccion?: string; ciudad?: string; provincia?: string };
  created_at?: string;
  updated_at?: string;
}

interface InformationSectionProps {
  user: UserProfile;
  onUserUpdate?: (updated: Partial<UserProfile>) => void;
}

const StaticField = ({ icon: Icon, label, value, href }: { icon: LucideIcon; label: string; value: string | null | undefined; href?: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={16} className="text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-0.5 text-foreground font-medium truncate">
        {href ? (
          <a href={href} className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
            {value || '\u2014'}
          </a>
        ) : (
          value || '\u2014'
        )}
      </p>
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

  const saveField = (field: 'nombre' | 'email' | 'dni' | 'telefono') => async (newValue: string) => {
    const payload: Partial<UserProfile> = {};
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
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <MdInfo size={12} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Información Personal</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Editable fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <EditableField label="Nombre completo" value={fullName} icon={User} onSave={saveField('nombre')} placeholder="Nombre y apellido" />
          <EditableField label="Email" value={user?.email || ''} icon={Mail} onSave={saveField('email')} type="email" placeholder="correo@ejemplo.com" />
          <EditableField label="Teléfono" value={user?.telefono || ''} icon={Phone} onSave={saveField('telefono')} placeholder="Número de teléfono" />
          <EditableField label="DNI" value={user?.dni || ''} icon={Badge} onSave={saveField('dni')} placeholder="Número de DNI" />
        </div>

        <div className="border-t border-border my-4" />

        {/* Static fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StaticField icon={Building2} label="Rol" value={user?.rol?.name} />
          <StaticField icon={Hash} label="Código empresa" value={empresa?.codigo_empresa} />
          <StaticField icon={Building2} label="Empresa" value={empresa?.razon_social} />
          <StaticField icon={LucideMapPin} label="Dirección" value={[empresa?.direccion, empresa?.ciudad, empresa?.provincia].filter(Boolean).join(', ')} />
          <StaticField icon={Calendar} label="Fecha de registro" value={createdDate} />
          <StaticField icon={Calendar} label="Última actualización" value={updatedDate} />
        </div>
      </div>
    </div>
  );
};