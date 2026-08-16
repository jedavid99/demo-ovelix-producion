import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PresupuestoLayout from './PresupuestoLayout'
import ServicesPage from './ServicesPage'
import ServicesListPage from './ServicesListPage'
import PresupuestoFlow from './PresupuestoFlow'
import TrackingPage from './TrackingPage'
import BookingPage from './BookingPage'
import LegalPage from './LegalPage'

/** Ruta por empresa en dev: /presupuesto.<empresa>[/valuacion|servicios|seguimiento|atelier|legal/:slug] */
const PRESUPUESTO_RE = /^\/presupuesto\.([^/]+)(?:\/(.*))?$/

export default function PresupuestoTenantRoute() {
  const { pathname } = useLocation()
  const match = PRESUPUESTO_RE.exec(pathname)

  if (!match) {
    return <Navigate to="/presupuesto" replace />
  }

  const slug = match[1].toLowerCase()
  try {
    sessionStorage.setItem('ovelix_tc_slug', slug)
  } catch {
    /* noop */
  }

  const rest = match[2] ?? ''

  let page: ReactNode
  if (!rest) {
    page = <ServicesPage />
  } else if (rest === 'servicios') {
    page = <ServicesListPage />
  } else if (rest === 'valuacion') {
    page = <PresupuestoFlow />
  } else if (rest === 'seguimiento') {
    page = <TrackingPage />
  } else if (rest === 'atelier') {
    page = <BookingPage />
  } else if (rest.startsWith('legal/')) {
    page = <LegalPage slug={rest.slice('legal/'.length).split('/')[0]} />
  } else {
    return <Navigate to={`/presupuesto.${slug}`} replace />
  }

  return <PresupuestoLayout>{page}</PresupuestoLayout>
}
