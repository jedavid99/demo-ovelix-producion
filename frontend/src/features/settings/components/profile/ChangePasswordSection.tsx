import { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { changePassword } from '@/services/users.service';

interface ChangePasswordSectionProps {
  userId: string;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
  id: string;
  autoComplete: string;
  saving?: boolean;
}

const PasswordField = ({
  label,
  value,
  onChange,
  error,
  show,
  onToggleShow,
  placeholder,
  id,
  autoComplete,
  saving,
}: PasswordFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`pr-10 ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
        disabled={saving}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export const ChangePasswordSection = ({ userId }: ChangePasswordSectionProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.current = 'Contraseña actual requerida';
    if (!newPassword) newErrors.new = 'Nueva contraseña requerida';
    else if (newPassword.length < 6) newErrors.new = 'Mínimo 6 caracteres';
    if (newPassword !== confirmPassword) newErrors.confirm = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    setMessage(null);
    try {
      await changePassword(userId, { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cambiar la contraseña. Verificá la contraseña actual.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound size={14} className="text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Cambiar Contraseña</h2>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 max-w-md">
          <PasswordField
            label="Contraseña actual"
            value={currentPassword}
            onChange={setCurrentPassword}
            error={errors.current}
            show={showCurrent}
            onToggleShow={() => setShowCurrent(!showCurrent)}
            placeholder="Ingresá tu contraseña actual"
            id="pw-current"
            autoComplete="current-password"
            saving={saving}
          />
          <PasswordField
            label="Nueva contraseña"
            value={newPassword}
            onChange={setNewPassword}
            error={errors.new}
            show={showNew}
            onToggleShow={() => setShowNew(!showNew)}
            placeholder="Mínimo 6 caracteres"
            id="pw-new"
            autoComplete="new-password"
            saving={saving}
          />
          <PasswordField
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirm}
            show={showConfirm}
            onToggleShow={() => setShowConfirm(!showConfirm)}
            placeholder="Repetí la nueva contraseña"
            id="pw-confirm"
            autoComplete="new-password"
            saving={saving}
          />

          {message && (
            <div
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md border ${
                message.type === 'success'
                  ? 'bg-success/10 text-green-700 dark:text-green-400 border-success/20'
                  : 'bg-destructive/10 text-red-700 dark:text-red-400 border-destructive/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div className="border-t border-border my-2" />

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </form>
      </div>
    </div>
  )
};