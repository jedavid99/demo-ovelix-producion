import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, eyebrow, title, description, actions }) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="size-11 shrink-0 rounded-xl border border-primary/10 bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
};
export default SectionHeader;