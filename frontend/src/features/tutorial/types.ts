import type { ReactNode } from 'react'
import type { ReactourStepPosition } from 'reactour'

export interface TutorialStep {
  content: ReactNode
  title?: string
  selector?: string
  position?: ReactourStepPosition | [number, number]
}

export interface TutorialSection {
  id: string
  title: string
  description: string
  route: string
  /** Rutas adicionales (parámetros dinámicos) que apuntan a este tour */
  routes?: string[]
  steps: TutorialStep[]
}