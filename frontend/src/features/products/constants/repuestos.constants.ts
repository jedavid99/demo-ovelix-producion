import type { Variants } from 'framer-motion'

export const categories = ['all', 'pantallas', 'baterías', 'componentes', 'cables', 'ventiladores']

export const statusOptions = ['all', 'good', 'low', 'out']

export const categoryColorMap: Record<string, string> = {
  Pantallas: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Baterías: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  Componentes: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Cables: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Ventiladores: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
}

export const kpiContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const kpiCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  hover: {
    y: -4, scale: 1.02,
    boxShadow: '0 12px 30px -8px rgba(0,0,0,0.15)',
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
}

export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}
