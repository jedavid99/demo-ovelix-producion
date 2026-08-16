import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function LegalPageShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <main className="bg-surface-container-lowest min-h-screen">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -3 }}
          className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-12 transition-colors hover:text-secondary"
        >
          <ArrowLeft size={15} />
          Volver
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-12"
        >
          {title}
        </motion.h1>

        {children}
      </div>
    </main>
  )
}