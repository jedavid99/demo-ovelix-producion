import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTenantPage, tenantHref } from './tenantConfig'

export default function LegalPage({ slug: slugProp }: { slug?: string } = {}) {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugProp ?? slugParam
  const { brand, footer } = useTenantPage()
  const navigate = useNavigate()
  const toHome = tenantHref('/presupuesto')

  const page = footer.legalPages.find(p => p.slug === slug) ?? footer.legalPages[0]

  if (!page) {
    return (
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-16">
        <p className="text-muted-foreground">Contenido no encontrado.</p>
        <button onClick={() => navigate(toHome)} className="mt-6 text-xs font-black text-primary uppercase tracking-widest">
          ← VOLVER
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-5 md:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={14} /> VOLVER
        </button>

        <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">{brand.name}</p>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-8">{page.label}</h1>

        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          {page.content.split('\n').map((line, i) =>
            line.trim() ? (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                {line}
              </p>
            ) : (
              <div key={i} className="h-4" />
            ),
          )}
        </div>
      </motion.div>
    </main>
  )
}
