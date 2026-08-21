import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTutorial } from './hooks/useTutorial'
import { PlayCircle, GraduationCap, MousePointerClick } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { TUTORIAL_SECTIONS, getTutorialByRoute } from './constants'
import type { TutorialSection } from './types'

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { hasSeen, openTourForRoute, isDisabled } = useTutorial()
  const location = useLocation()
  const prevAuthRef = useRef(isAuthenticated)

  // Primer login: abre el tutorial de la sección que aún no fue visto
  useEffect(() => {
    if (isDisabled) return
    if (location.pathname.startsWith('/developer')) return
    if (isAuthenticated && !prevAuthRef.current) {
      const unseenList = TUTORIAL_SECTIONS.filter((s) => !hasSeen(s.id))
      if (unseenList.length > 0) {
        openTourForRoute(location.pathname)
      }
    }
    prevAuthRef.current = isAuthenticated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, hasSeen, openTourForRoute, isDisabled])

  return <>{children}</>
}

export const TutorialHelpPage: React.FC = () => {
  const { openTour, requestTour, hasSeen, isDisabled, setDisabled } = useTutorial()
  const navigate = useNavigate()

  const handleOpen = (section: TutorialSection) => {
    // Si ya estamos en la sección, abrir el tour directamente
    const current = getTutorialByRoute(window.location.pathname)
    if (current?.id === section.id) {
      openTour(section)
    } else {
      // Si no, navegar a la sección y abrir el tour cuando llegue
      requestTour(section)
      navigate(section.route)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div data-tour="content" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MousePointerClick size={22} className="text-primary" />
              Tutoriales interactivos
            </h1>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              {isDisabled ? 'Desactivado' : 'Activado'} — Mostrar recorridos al entrar
            </span>
          </label>
        </div>
        <p className="text-muted-foreground">
          Elegí una sección para ver un recorrido guiado paso a paso sobre cómo funciona. También podés
          pulsar el botón flotante de ayuda (esquina inferior derecha) en cualquier pantalla.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TUTORIAL_SECTIONS.map((section) => {
          const seen = hasSeen(section.id)
          return (
            <Card key={section.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-primary" />
                    {section.title}
                  </span>
                  {seen && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Visto
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <button
                  onClick={() => handleOpen(section)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <PlayCircle size={14} />
                  Iniciar recorrido ({section.steps.length} pasos)
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}