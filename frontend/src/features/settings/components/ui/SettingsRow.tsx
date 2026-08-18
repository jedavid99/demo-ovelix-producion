import React from 'react';

interface SettingsRowProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ left, right, children, className }) => {
  if (children) {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-3.5 ${className ?? ''}`}>
        {children}
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-3.5 ${className ?? ''}`}>
      {left && <div className="flex min-w-0 items-center gap-3">{left}</div>}
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
};
export default SettingsRow;