import React from 'react'
import { MotionConfig } from 'framer-motion'
import RootLayout from './app/layout'
import { AppRouter } from './app/router'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </MotionConfig>
    </ErrorBoundary>
  )
}
