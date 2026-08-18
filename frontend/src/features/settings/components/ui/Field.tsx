import React from 'react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

interface FieldProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  hint,
  htmlFor,
  className,
  value,
  onChange,
  type = 'text',
  placeholder,
  children,
}) => {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children ? (
        children
      ) : (
        <Input
          id={htmlFor}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};
export default Field;