import React from 'react';

interface SettingsCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, actions, children, className }) => {
  return (
    <section className={`rounded-xl border border-border bg-card shadow-sm dark:shadow-none overflow-hidden ${className ?? ''}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="size-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
              {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
};
export default SettingsCard;