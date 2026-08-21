import React, { Component, type ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Tour from 'reactour'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/shared/components/ui/button'
import { GraduationCap } from 'lucide-react'
import { useTutorial } from '../hooks/useTutorial'
import { getTutorialByRoute } from '../constants'
import { isPublicPage } from '@/services/api'

class TourBoundary extends Component<{ onReset: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onReset()
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

const helperStyles = {
  position: 'absolute' as const,
  maxWidth: '380px',
  zIndex: 10000,
  borderRadius: '12px',
  background: 'var(--card, #ffffff)',
  color: 'var(--foreground, #0a0a0a)',
  border: '1px solid var(--border, hsl(var(--border)))',
  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
}

const badgeStyles = {
  background: 'var(--primary, hsl(var(--primary)))',
  borderRadius: '9999px',
}

export const GuidedTour: React.FC = () => {
  const { isOpen, section, steps, closeTour, openTour, pendingSection, markSeen } = useTutorial()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (location.pathname.startsWith('/developer')) return
    if (pendingSection) {
      // Se pidió un tour puntual: abrirlo cuando la ruta llegue a la sección destino
      const current = getTutorialByRoute(location.pathname)
      if (current?.id === pendingSection.id) {
        openTour(pendingSection)
      }
      return
    }
    // Si se navegó a otra sección, cerrar el tour abierto
    if (isOpen && section) {
      const current = getTutorialByRoute(location.pathname)
      if (current?.id !== section.id) {
        closeTour()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, pendingSection])

  useEffect(() => {
    if (!isOpen && isAuthenticated && section) {
      markSeen(section.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isAuthenticated || isPublicPage(location.pathname) || !section || steps.length === 0) {
    return null
  }

  return (
    <TourBoundary onReset={closeTour}>
      <Tour
        key={section.id}
        isOpen={isOpen}
        onRequestClose={closeTour}
        steps={steps}
        rounded={10}
        accentColor="var(--primary, hsl(var(--primary)))"
showNavigation
      showCloseButton
      showButtons
      showNumber
      disableInteraction={false}
      closeWithMask={false}
      maskSpace={8}
      disableFocusLock
      lastStepNextButton={<span>Finalizar</span>}
      CustomHelper={({ current, totalSteps, gotoStep, close, content }) => (
        <div style={helperStyles} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span style={badgeStyles} className="text-xs font-semibold px-2.5 py-1 text-primary-foreground">
              Paso {current + 1} de {totalSteps}
            </span>
            <Button variant="ghost" size="sm" onClick={close} className="h-7 px-2 text-muted-foreground">
              Cerrar
            </Button>
          </div>
          <div className="text-sm leading-relaxed text-foreground">
            {typeof content === 'function' ? content({ close, goTo: gotoStep, step: current, inDOM: true }) : content}
          </div>
          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ir al paso ${i + 1}`}
                  onClick={() => gotoStep(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === current ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {current > 0 && (
                <Button variant="outline" size="sm" onClick={() => gotoStep(current - 1)}>
                  Atrás
                </Button>
              )}
              <Button size="sm" onClick={() => (current < totalSteps - 1 ? gotoStep(current + 1) : close())}>
                {current < totalSteps - 1 ? 'Siguiente' : 'Finalizar'}
              </Button>
            </div>
          </div>
        </div>
      )}
      />
    </TourBoundary>
  )
}

export const HelpTourButton: React.FC = () => {
  const { openTourForRoute } = useTutorial()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated || isPublicPage(location.pathname) || location.pathname.startsWith('/developer')) {
    return null
  }

  const currentTour = getTutorialByRoute(location.pathname)

  return (
    <button
      data-tour="help-button"
      onClick={() => currentTour && openTourForRoute(location.pathname)}
      title={currentTour ? `Tutorial: ${currentTour.title}` : 'Ayuda'}
      aria-label="Reiniciar tutorial de esta sección"
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
    >
      <GraduationCap size={20} />
    </button>
  )
}