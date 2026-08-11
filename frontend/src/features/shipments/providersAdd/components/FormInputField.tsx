import { AlertCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface FormInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: string;
  spanFull?: boolean;
}

export function FormInputField({
  id, label, value, onChange, placeholder, error,
  required, type = 'text', spanFull,
}: FormInputFieldProps) {
  return (
    <div className={spanFull ? 'md:col-span-3 space-y-1' : 'space-y-1'}>
      <Label htmlFor={id} className="text-xs font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className={`h-9 text-sm ${error ? 'border-destructive' : ''}`}
      />
      {error && (
        <p className="text-[10px] text-destructive flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
