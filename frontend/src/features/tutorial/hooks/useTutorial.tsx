import { createContext, useContext, useCallback, useState } from 'react'
import type { TutorialSection, TutorialStep } from '../types'
import { getTutorialByRoute } from '../constants'

interface TutorialContextType {
  isOpen: boolean
  section: TutorialSection | null
  pendingSection: TutorialSection | null
  steps: TutorialStep[]
  openTour: (section: TutorialSection) => void
  openTourForRoute: (pathname: string) => void
  requestTour: (section: TutorialSection) => void
  closeTour: () => void
  hasSeen: (sectionId: string) => boolean
  markSeen: (sectionId: string) => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

const STORAGE_KEY = 'ovelix_tutorial_seen'

const getSeen = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [section, setSection] = useState<TutorialSection | null>(null)
  const [pendingSection, setPendingSection] = useState<TutorialSection | null>(null)

  const openTour = useCallback((s: TutorialSection) => {
    setPendingSection(null)
    setSection(s)
    setIsOpen(true)
  }, [])

  /** Solicita abrir el tour de una sección luego de navegar a su ruta. */
  const requestTour = useCallback((s: TutorialSection) => {
    setPendingSection(s)
  }, [])

  const openTourForRoute = useCallback(
    (pathname: string) => {
      const s = getTutorialByRoute(pathname)
      if (s) openTour(s)
    },
    [openTour],
  )

  const closeTour = useCallback(() => {
    setPendingSection(null)
    setIsOpen(false)
  }, [])

  const hasSeen = useCallback((sectionId: string) => getSeen().includes(sectionId), [])

  const markSeen = useCallback((sectionId: string) => {
    const seen = getSeen()
    if (!seen.includes(sectionId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, sectionId]))
    }
  }, [])

  return (
    <TutorialContext.Provider
      value={{
        isOpen,
        section,
        pendingSection,
        steps: section?.steps ?? [],
        openTour,
        openTourForRoute,
        requestTour,
        closeTour,
        hasSeen,
        markSeen,
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider')
  }
  return context
}

export { getTutorialByRoute, STORAGE_KEY }