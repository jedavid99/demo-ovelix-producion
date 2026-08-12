import React from "react"
import { Button } from "@/shared/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
  resetKey?: string | number
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error no controlado:", error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Si cambió la ruta, reiniciar el estado de error para que la app se recupere por sí sola
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  handleReload = () => {
    window.location.href = "/"
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-background text-foreground">
          <div className="max-w-md text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold">Algo salió mal</h1>
            <p className="text-muted-foreground text-sm">
              Ocurrió un error inesperado. Por favor, intentá recargar la página.
            </p>
            {this.state.error && (
              <details className="text-xs text-left bg-muted p-3 rounded-md max-h-32 overflow-auto">
                <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => window.history.back?.()}>
                Volver atrás
              </Button>
              <Button onClick={this.handleReload}>
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}