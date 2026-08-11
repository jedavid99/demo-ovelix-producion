import { useState } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { Pencil } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface EditableFieldProps {
  label: string;
  value: string;
  icon?: any;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'email';
  placeholder?: string;
}

export const EditableField = ({ label, value, icon: Icon, onSave, type = 'text', placeholder }: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => {
    setDraft(value);
    setError('');
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setError('');
  };

  const save = async () => {
    if (!draft.trim()) {
      setError('Este campo es obligatorio');
      return;
    }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft)) {
      setError('Email inválido');
      return;
    }
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
      setError('');
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-start gap-3 group">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={16} className="text-primary" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center justify-between">
          {label}
          {!editing && (
            <button
              onClick={startEdit}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50 text-muted-foreground"
              aria-label={`Editar ${label}`}
            >
              <Pencil size={13} />
            </button>
          )}
        </p>
        {editing ? (
          <div className="mt-1 flex items-center gap-1.5">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              type={type}
              autoFocus
              disabled={saving}
              placeholder={placeholder}
              className={`h-8 text-sm ${error ? 'border-destructive' : ''}`}
            />
            <button onClick={save} disabled={saving} className="p-1.5 rounded hover:bg-success/10 text-success shrink-0">
              <MdCheck size={18} />
            </button>
            <button onClick={cancel} disabled={saving} className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground shrink-0">
              <MdClose size={18} />
            </button>
          </div>
        ) : (
          <p className="mt-0.5 text-foreground font-medium truncate">{value || '\u2014'}</p>
        )}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
};
