import React from 'react'
import { useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import RootLayout from './app/layout'
import { AppRouter } from './app/router'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

function AppWithErrorBoundary() {
  const location = useLocation()
  return (
    <ErrorBoundary resetKey={location.pathname}>
      <MotionConfig reducedMotion="user">
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <AppWithErrorBoundary />
  )
}