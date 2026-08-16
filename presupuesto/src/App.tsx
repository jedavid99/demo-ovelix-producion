import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ServicesPage from './pages/ServicesPage'
import ValuationPage from './pages/ValuationPage'
import TrackingPage from './pages/TrackingPage'
import BookingPage from './pages/BookingPage'
import LegalPage from './pages/legal/LegalPage'
import PrivacidadPage from './pages/legal/PrivacidadPage'
import GarantiaPage from './pages/legal/GarantiaPage'
import UbicacionYHorariosPage from './pages/legal/UbicacionYHorariosPage'
import { TenantProvider } from './context/TenantContext'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ServicesPage />} />
      <Route path="/valuation" element={<ValuationPage />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/Taller" element={<BookingPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/privacidad" element={<PrivacidadPage />} />
      <Route path="/garantia" element={<GarantiaPage />} />
      <Route path="/ubicacion" element={<UbicacionYHorariosPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <TenantProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface text-on-surface flex flex-col">
          <Header />
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TenantProvider>
  )
}