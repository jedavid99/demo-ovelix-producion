import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react'
import { useTenant } from '../../context/TenantContext'
import LegalPageShell from './LegalPageShell'
import ScheduleBoard from '../../components/ScheduleBoard'

export default function UbicacionYHorariosPage() {
  const { footer, brand, contact, schedule } = useTenant()
  const page = (footer.legalPages ?? []).find(p => p.slug === 'ubicacion')
  if (!page) return <Navigate to="/" replace />

  const hasSchedule = (schedule ?? []).length > 0
  const addressText = [contact.address, contact.city].filter(Boolean)
  const mapQuery = addressText.join(', ')

  const waUrl = contact.whatsapp ?? ''
  const contactItems = [
    contact.phone && {
      label: 'TELÉFONO',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
      Icon: Phone,
    },
    waUrl && {
      label: 'WHATSAPP',
      value: waUrl.match(/wa\.me\/(\d+)/)?.[1] ? `+${waUrl.match(/wa\.me\/(\d+)/)![1]}` : waUrl,
      href: waUrl,
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
    <LegalPageShell title={page.label}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {hasSchedule && (
          <div className="lg:col-span-5">
            <ScheduleBoard rows={schedule} note={page.content} />
          </div>
        )}

        {mapQuery && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-secondary" />
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                {addressText.join(' — ')}
              </p>
            </div>
            <div className="relative border border-outline-variant overflow-hidden bg-surface-container-low h-[380px] lg:h-full lg:min-h-[440px]">
              <iframe
                title={`Mapa de ${brand.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        )}
      </div>

      {contactItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
          className="mt-12 border border-outline-variant bg-surface-container rounded-lg overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-outline-variant flex items-center gap-3">
            <Phone size={16} className="text-secondary" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-on-surface">Contacto</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            {contactItems.map(({ label, value, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 px-6 py-5 transition-colors hover:bg-surface-container-low"
              >
                <Icon size={17} className="text-secondary shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">
                    {label}
                  </span>
                  <span className="block text-sm font-semibold text-on-surface truncate">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </LegalPageShell>
  )
}