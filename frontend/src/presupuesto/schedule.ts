/* =====================================================================
   HORARIOS — helpers para consumir `config.schedule` (editado en el
   admin) en la página pública: días hábiles, apertura/cierre y turnos.
   ===================================================================== */

const DAY_NAMES: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
}

const DAY_ABBR = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

export interface ScheduleInfo {
  businessDays: number[]
  openMin: number
  closeMin: number
}

const DEFAULT_OPEN_MIN = 9 * 60
const DEFAULT_CLOSE_MIN = 18 * 60

/** Convierte `config.schedule` (filas {day, hours, closed}) en días hábiles
 *  (getDay()) y rango de apertura/cierre. Fallback: lun-vie 09:00-18:00. */
export function parseSchedule(schedule: { day?: string; hours?: string; closed?: boolean }[] = []): ScheduleInfo {
  const days = new Set<number>()
  let openMin = DEFAULT_OPEN_MIN
  let closeMin = DEFAULT_CLOSE_MIN
  let hasHours = false

  for (const row of schedule) {
    if (!row || row.closed) continue
    const dayName = (row.day ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const idx = DAY_NAMES[dayName]
    if (idx !== undefined) days.add(idx)

    const m = (row.hours ?? '').match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
    if (m) {
      const start = Number(m[1]) * 60 + Number(m[2])
      const end = Number(m[3]) * 60 + Number(m[4])
      if (end > start) {
        hasHours = true
        openMin = Math.min(openMin, start)
        closeMin = Math.max(closeMin, end)
      }
    }
  }

  if (!hasHours) {
    openMin = DEFAULT_OPEN_MIN
    closeMin = DEFAULT_CLOSE_MIN
  }

  return {
    businessDays: days.size ? [...days].sort() : [1, 2, 3, 4, 5],
    openMin,
    closeMin,
  }
}

/** Genera los turnos disponibles entre apertura y cierre (default: cada 60 min). */
export function buildBusinessSlots(openMin: number, closeMin: number, intervalMin = 60): string[] {
  const slots: string[] = []
  for (let t = openMin; t < closeMin; t += intervalMin) {
    slots.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`)
  }
  return slots
}

/** Etiqueta corta para los días hábiles: "LUN A VIE", "LUN A SÁB", "TODO EL DÍA". */
export function businessDaysLabel(days: number[]): string {
  if (days.length === 5 && days.every((d) => d >= 1 && d <= 5)) return 'LUN A VIE'
  if (days.length === 6 && days.every((d) => d >= 1 && d <= 6)) return 'LUN A SÁB'
  if (days.length === 7) return 'TODO EL DÍA'
  return days.map((d) => DAY_ABBR[d] ?? '').join(' ')
}

/** Formatea el rango de apertura/cierre como "09:00 – 18:00". */
export function hoursLabel(openMin: number, closeMin: number): string {
  const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
  return `${fmt(openMin)} – ${fmt(closeMin)}`
}
