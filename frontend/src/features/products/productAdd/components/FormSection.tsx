import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
};

interface FormSectionProps {
  title: string;
  index: number;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, index, children, className }: FormSectionProps) {
  return (
    <motion.section
      variants={sectionVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className={className || 'p-4'}>{children}</div>
    </motion.section>
  );
}
