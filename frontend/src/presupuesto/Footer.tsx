import { useNavigate } from 'react-router-dom'
import { useTenantPage, tenantHref } from './tenantConfig'

export default function Footer() {
  const { brand, footer, contact } = useTenantPage()
  const navigate = useNavigate()
  const toHome = tenantHref('/presupuesto')
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={() => navigate(toHome)}
          className="text-xl font-black tracking-tighter text-secondary"
        >
          {brand.logoText}
        </button>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8" aria-label="Legal">
          {footer.legalPages.map(item => (
            <button
              key={item.slug}
              onClick={() => navigate(tenantHref(`/presupuesto/legal/${item.slug}`))}
              className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-secondary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-muted-foreground opacity-70 text-center">
            {footer.rights}
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground opacity-60 text-center">
            {contact.city}
          </span>
        </div>
      </div>
    </footer>
  )
}
