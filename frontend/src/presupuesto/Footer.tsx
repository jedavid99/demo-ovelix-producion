import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Instagram, Facebook } from 'lucide-react'
import { useTenantPage } from './TenantProvider'
import { tenantHref } from './tenantConfig'

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export default function Footer() {
  const { brand, footer, contact, schedule } = useTenantPage()
  const navigate = useNavigate()
  const toHome = tenantHref('/presupuesto')
  const fullAddress = [contact.address, contact.city].filter(Boolean).join(', ')
  const mapsLink = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null
  const legalNav = (footer.legalPages ?? []).filter(p => !['ubicacion', 'horarios'].includes(p.slug))

  const socialLinks = [
    { href: contact.instagram, label: 'Instagram', Icon: Instagram },
    { href: contact.whatsapp, label: 'WhatsApp', Icon: WhatsAppIcon },
    { href: contact.facebook, label: 'Facebook', Icon: Facebook },
  ].filter(s => s.href)

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {/* Marca + legal */}
        <div>
          <button
            onClick={() => navigate(toHome)}
            className="text-xl font-black tracking-tighter text-secondary"
          >
            {brand.logoText}
          </button>
          {brand.tagline && (
            <p className="mt-3 text-xs font-semibold text-muted-foreground opacity-70 max-w-[240px] leading-relaxed">
              {brand.tagline}
            </p>
          )}
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-3" aria-label="Legal">
            {legalNav.map(item => (
              <button
                key={item.slug}
                onClick={() => navigate(tenantHref(`/presupuesto/legal/${item.slug}`))}
                className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-secondary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex items-center justify-center size-9 rounded-full border border-border text-muted-foreground hover:text-secondary hover:border-secondary transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Horarios */}
        <div>
          <p className="flex items-center gap-2 text-[11px] font-black text-secondary uppercase tracking-widest mb-4">
            <Clock size={14} /> HORARIOS
          </p>
          <ul className="space-y-2">
            {(schedule ?? []).map((row, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 text-xs">
                <span className="font-semibold text-foreground">{row.day}</span>
                <span className="text-muted-foreground">{row.closed ? 'Cerrado' : row.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ubicación + mapa */}
        <div>
          <p className="flex items-center gap-2 text-[11px] font-black text-secondary uppercase tracking-widest mb-4">
            <MapPin size={14} /> UBICACIÓN
          </p>
          {fullAddress && (
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed mb-3">{fullAddress}</p>
          )}
          {fullAddress ? (
            <>
              <iframe
                src={contact.mapEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                title="Mapa de ubicación"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-40 rounded-lg border border-border bg-muted"
              />
              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-[11px] font-black text-secondary uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  <MapPin size={14} /> CÓMO LLEGAR
                </a>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
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
