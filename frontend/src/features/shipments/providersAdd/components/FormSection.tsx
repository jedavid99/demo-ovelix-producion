import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  index: number;
  children: ReactNode;
}

export function FormSection({ icon, title, index, children }: FormSectionProps) {
  return (
    <motion.section
      variants={variants}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {children}
      </div>
    </motion.section>
  );
}
