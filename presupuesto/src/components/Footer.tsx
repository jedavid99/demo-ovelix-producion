import { useNavigate, Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { useTenant } from '../context/TenantContext'

export default function Footer() {
  const { brand, footer, contact } = useTenant()
  const navigate = useNavigate()

  const wa = contact.whatsapp ?? ''
  const contactLinks = [
    contact.phone && {
      label: 'TELÉFONO',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
      Icon: Phone,
    },
    wa && {
      label: 'WHATSAPP',
      value: wa.match(/wa\.me\/(\d+)/)?.[1] ? `+${wa.match(/wa\.me\/(\d+)/)![1]}` : wa,
      href: wa,
      Icon: MessageCircle,
    },
    contact.email && {
      label: 'CORREO',
      value: contact.email,
      href: `mailto:${contact.email}`,
      Icon: Mail,
    },
  ].filter(Boolean) as { label: string; value: string; href: string; Icon: typeof Phone }[]

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={() => navigate('/')}
          aria-label={`${brand.name} — ir al inicio`}
          className="flex items-center gap-3"
        >
          <img
            src={brand.logo || '/favicon.png'}
            alt={brand.name}
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-black tracking-tighter text-secondary">{brand.logoText}</span>
        </button>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8" aria-label="Legal">
          {(footer.legalPages ?? []).map(page => (
            <Link
              key={page.slug}
              to={`/${page.slug}`}
              className="text-xs font-bold text-on-surface-variant uppercase tracking-widest transition-colors hover:text-secondary"
            >
              {page.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-on-surface-variant opacity-70 text-center">
            {footer.rights}
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant opacity-60 text-center">
            {contact.city}
          </span>
        </div>
      </div>

      {contactLinks.length > 0 && (
        <div className="border-t border-outline-variant">
          <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {contactLinks.map(({ label, value, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest transition-colors hover:text-secondary"
              >
                <Icon size={13} className="shrink-0" />
                <span>
                  {label} · <span className="normal-case tracking-normal">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </footer>
  )
}