import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './presupuesto.css'

export default function PresupuestoLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="presupuesto-root min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">{children ?? <Outlet />}</div>
      <Footer />
    </div>
  )
}
