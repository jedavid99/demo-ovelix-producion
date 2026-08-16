import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

export interface ScheduleRow {
  day: string
  hours: string
  closed?: boolean
}

const DAY_ORDER = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

function toMin(t: string): number {
  const [h = '0', m = '0'] = t.split(':')
  return Number(h) * 60 + Number(m)
}

/** Intenta parsear "09:00 - 18:00", "9 a 18", "09:00-18:00". Devuelve null si no se puede. */
function parseRange(hours: string): { start: number; end: number } | null {
  const s = hours.trim().toLowerCase()
  if (/\b24h\b/.test(s) || s.includes('todo el dia')) return { start: 0, end: 24 * 60 }
  const times = s.match(/\d{1,2}(?::\d{2})?/g)
  if (!times || times.length < 2) return null
  return { start: toMin(times[0]), end: toMin(times[1]) }
}

export function getOpenStatus(rows: ScheduleRow[], now = new Date()): 'open' | 'closed' | null {
  if (!rows.length) return null
  const todayNorm = norm(DAY_ORDER[(now.getDay() + 6) % 7])
  const today = rows.find(r => {
    const d = norm(r.day)
    return d === todayNorm || d.startsWith(todayNorm)
  })
  if (!today) return 'closed'
  if (today.closed) return 'closed'
  const range = parseRange(today.hours)
  if (!range) return null
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= range.start && mins < range.end ? 'open' : 'closed'
}

export default function ScheduleBoard({
  rows,
  note,
}: {
  rows: ScheduleRow[]
  note?: string
}) {
  const today = useMemo(() => new Date(), [])
  const todayNorm = norm(DAY_ORDER[(today.getDay() + 6) % 7])
  const status = getOpenStatus(rows, today)
  const statusLabel =
    status === 'open' ? 'ABIERTO AHORA' : status === 'closed' ? 'CERRADO AHORA' : 'HORARIO DE ATENCIÓN'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
      className="max-w-2xl"
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 border mb-6 ${
          status === 'open'
            ? 'border-secondary bg-secondary/10 text-secondary'
            : status === 'closed'
            ? 'border-outline-variant bg-surface-container-low text-on-surface-variant'
            : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
        }`}
      >
        {status === 'open' ? (
          <CheckCircle2 size={18} />
        ) : status === 'closed' ? (
          <XCircle size={18} />
        ) : (
          <Clock size={18} />
        )}
        <span className="text-[11px] font-black uppercase tracking-widest">{statusLabel}</span>
      </div>

      <div className="border border-outline-variant divide-y divide-outline-variant bg-surface-container">
        {rows.map((row, i) => {
          const isToday = norm(row.day) === todayNorm || norm(row.day).startsWith(todayNorm)
          return (
            <motion.div
              key={`${row.day}-${i}`}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              className={`flex items-center justify-between gap-6 px-6 py-4 ${
                isToday ? 'bg-secondary/10 border-l-2 border-l-secondary' : ''
              }`}
            >
              <span
                className={`text-sm font-bold uppercase tracking-widest ${
                  isToday ? 'text-secondary' : 'text-on-surface'
                }`}
              >
                {row.day}
                {isToday && (
                  <span className="ml-3 text-[10px] font-black text-secondary">HOY</span>
                )}
              </span>
              {row.closed ? (
                <span className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest bg-outline-variant/40 px-3 py-1">
                  Cerrado
                </span>
              ) : (
                <span className="text-sm font-semibold text-on-surface">{row.hours}</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {note && (
        <p className="mt-6 text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{note}</p>
      )}
    </motion.div>
  )
}