import { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { changePassword } from '@/services/users.service';

interface ChangePasswordSectionProps {
  userId: string;
}

export const ChangePasswordSection = ({ userId }: ChangePasswordSectionProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Completa la contraseña actual y la nueva' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await changePassword(userId, { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      reset();
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cambiar la contraseña. Verifica la contraseña actual.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
          <KeyRound size={14} className="text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Contraseña</h2>
      </div>
      <div className="space-y-4 max-w-sm">
        <div className="space-y-1.5">
          <Label htmlFor="pw-current" className="text-sm font-semibold">
            Contraseña actual
          </Label>
          <Input
            id="pw-current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Ingresa tu contraseña actual"
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-new" className="text-sm font-semibold">
            Nueva contraseña
          </Label>
          <Input
            id="pw-new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-confirm" className="text-sm font-semibold">
            Confirmar nueva contraseña
          </Label>
          <Input
            id="pw-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la nueva contraseña"
            autoComplete="new-password"
          />
        </div>
        {message && (
          <div
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
              message.type === 'success'
                ? 'bg-success/10 text-green-700 dark:text-green-400'
                : 'bg-destructive/100/10 text-red-700 dark:text-destructive'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
        </Button>
      </div>
    </div>
  );
};
